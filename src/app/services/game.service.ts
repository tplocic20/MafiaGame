import {Injectable, OnDestroy, OnInit} from '@angular/core';
import {AngularFireDatabase} from "@angular/fire/database";
import {BehaviorSubject, forkJoin, from, Subject} from "rxjs";
import {Game} from "../models/game";
import {GameState} from "../models/game-state.enum";
import {map, switchMap, take, takeUntil, tap} from "rxjs/operators";
import {Player} from "../models/player";
import {PlayerAlignment} from "../models/player-alignment.enum";
import {PlayerState} from "../models/player-state.enum";
import {MatSnackBar} from "@angular/material/snack-bar";

@Injectable({
  providedIn: 'root'
})
export class GameService implements OnInit, OnDestroy {

  private unsubscribe: Subject<void> = new Subject<void>();
  private gameKey;
  private playerKey;

  private _game: BehaviorSubject<Game> = new BehaviorSubject<Game>(null);
  public game = this._game.asObservable();
  private _me: BehaviorSubject<Player> = new BehaviorSubject<Player>(null);
  public me = this._me.asObservable();
  private _loading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public loading = this._loading.asObservable();


  constructor(private readonly db: AngularFireDatabase, private readonly snackBar: MatSnackBar) {
  }

  ngOnInit() {
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  private _patchPlayer(key, data: any) {
    return this.db.object(`/games/${this.gameKey}/players/${key}`).update(data);
  }

  private _changeTurn(turn: GameState) {
    return this.db.object(`/games/${this.gameKey}`).update({
      state: turn
    }).then(_ => {
      this._loading.next(false);
    });
  }

  private _showMessage(msg) {
    this.snackBar.open(msg, 'Close', {
      duration: 2000,
    })
  }

  private gameStateChange(game: Game) {
    const me = this._me.getValue();
    const players = Object.values(game.players);
    if (me && me.owner && players.length >= 6 && players.every(player => player.ready === true || player.state === PlayerState.Dead)) {
      this._loading.next(true);
      this.clearsPlayerReady(game);
      switch (game.state) {
        case GameState.Lobby:
          this.handleGameStart(game);
          break;
        case GameState.FirstNight:
          this.handleFirstNight(game);
          break;
        case GameState.Day:
          this.handleDay(game);
          break;
        case GameState.Vote:
          this.handleTownVote(game);
          break;
        case GameState.Night:
          this.handleNight(game);
      }
    }
  }

  private handleGameStart(game: Game) {
    const playerKeys = Object.keys(game.players);
    this._changeTurn(GameState.FirstNight).then(_ => {
      this.calcMafia(playerKeys);
      this._showMessage("It's first night, mafia has a change to know each other");
    })
  }

  private handleFirstNight(game: Game) {
    this._changeTurn(GameState.Day).then(_ => {
      this._showMessage("It's a beautiful day... Discuss and blame each other");
    });
  }

  private handleDay(game: Game) {
    this._changeTurn(GameState.Vote).then(_ => {
      this._showMessage("It's a evening already... Citizens can now exile one suspicious player");
    });
  }

  private handleNight(game: Game) {
    const players = Object.values(game.players);
    const toKill = players.find(item => {
      item.mafiaMarked
    });
    this._patchPlayer(toKill.$key, {
      state: GameState.Vote
    }).then(_ => {
      this._changeTurn(GameState.Day).then(_ => {
        this._showMessage(`Mafia killed ${toKill.name}, next day arrives...`);
        this.handleGameScore(game);
      });
    });
  }

  private handleTownVote(game: Game) {
    let exile: Player = null;
    let max = 0;
    const players = Object.values(game.players)
    players.forEach(player => {
      if (player.exileMarked) {
        const votes = Object.keys(player.exileMarked);
        if (votes.length === max) {
          return;
        }
        if (votes.length > max) {
          max = votes.length;
          exile = player;
        }
      }
    })
    this._patchPlayer(exile.$key, {
      state: PlayerState.Dead
    }).then(_ => {
      this._changeTurn(GameState.Night).then(_ => {
        this._showMessage(`Citizens has decided to exile... ${exile.name},
          he was ${exile.alignment === PlayerAlignment.Mafia ? 'Mafia' : 'Citizen'}. The night comes...`);
      });
    });
  }

  handleGameScore(game: Game) {
    const players = Object.values(game.players);
    const mafia = players.filter((player: Player) => player.state === PlayerState.Alive && player.alignment === PlayerAlignment.Mafia);
    const town = players.filter((player: Player) => player.state === PlayerState.Alive && player.alignment === PlayerAlignment.Townie);
    if (mafia.length === 0) {
      this._changeTurn(GameState.MafiaWon)
    } else if (mafia.length > town.length) {
      this._changeTurn(GameState.CityWon)
    }
  }

  private clearsPlayerReady(game: Game) {
    const playerKeys = Object.keys(game.players);
    playerKeys.forEach(player => {
      this._patchPlayer(player, {
        ready: false
      })
    })
  }

  private calcMafia(playersKeys: string[]) {
    let mafiaPlayers = 0;
    if (playersKeys.length <= 7) mafiaPlayers = 2;
    else if (playersKeys.length <= 10) mafiaPlayers = 3;
    else if (playersKeys.length <= 13) mafiaPlayers = 4;
    else if (playersKeys.length <= 16) mafiaPlayers = 5;
    for (let i = 0; i < mafiaPlayers; i++) {
      const randomPerson = playersKeys[Math.floor(Math.random() * playersKeys.length)];
      playersKeys.splice(playersKeys.indexOf(randomPerson), 1);
      this._patchPlayer(randomPerson, {
        alignment: PlayerAlignment.Mafia
      })
    }
  }

  private setPlayerAlignment(playerKey) {

  }

  accessCode() {
    return Math.random().toString(36).substring(7).toUpperCase();
  }

  newGame(playerName: string) {
    const code = this.accessCode();
    return from(this.db.list('games').push({
      accessCode: code,
      state: GameState.Lobby,
    } as Game)).pipe(
      take(1),
      switchMap(item => {
        this.gameKey = item.key;
        return forkJoin([this.joinPlayer(playerName, true), this.fetchGame(item.key)])
      }),
      map(_ => code),
    )
  }

  private fetchGame(key) {
    return from([true]).pipe(
      take(1),
      tap(_ => {
        this.db.object(`/games/${key}`).valueChanges()
          .pipe(
            tap((game: Game) => {
              this.gameStateChange(game);
            })).subscribe(item => this._game.next(item as Game))
      })
    )
  }

  joinGame(code: string, playerName: string) {
    return this.db.list('games',
      ref => ref.orderByChild('accessCode').equalTo(code).limitToFirst(1))
      .snapshotChanges()
      .pipe(
        take(1),
        tap(res => {
          if (res.length === 0) {
            throw "InvalidCode";
          }
        }),
        switchMap(res => {
          this.gameKey = res[0].key;
          return forkJoin([this.joinPlayer(playerName), this.fetchGame(res[0].key)]);
        }),
        map(_ => code)
      )
  }

  joinPlayer(name: string, owner = false) {
    return from(this.db.list(`/games/${this.gameKey}/players`).push({
      name,
      owner,
      alignment: PlayerAlignment.Townie,
      state: PlayerState.Alive
    })).pipe(
      take(1),
      tap(item => {
        this.fetchPlayer(item.key);
      })
    )
  }

  private fetchPlayer(key) {
    this.playerKey = key;
    this.db.object(`/games/${this.gameKey}/players/${this.playerKey}`).valueChanges()
      .pipe(
        takeUntil(this.unsubscribe),
      ).subscribe((item: Player) => this._me.next({
      ...item,
      $key: key
    }))
  }

  setReady() {
    this._patchPlayer(this.playerKey, {
      ready: !this._me.getValue().ready
    })
  }

  mafiaMark(markedKey) {
    const game = this._game.getValue();
    const playerKeys = Object.keys(game.players);
    playerKeys.forEach(key => {
      this._patchPlayer(key, {
        mafiaMarked: key === markedKey
      })
    })

  }

  markExile(markedKey) {
    const me = this._me.getValue();
    if (me.markedByMe) {
      this.db.object(`/games/${this.gameKey}/players/${me.markedByMe}/exileMarked/${me.$key}`).remove();
    }
    this._patchPlayer(this.playerKey, {
      markedByMe: markedKey
    });
    this.db.list(`/games/${this.gameKey}/players/${markedKey}/exileMarked`).set(this.playerKey, true);
  }
}
