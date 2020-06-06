import {Injectable, OnDestroy, OnInit} from '@angular/core';
import {AngularFireDatabase} from "@angular/fire/database";
import {BehaviorSubject, combineLatest, forkJoin, from, Observable, Subject} from "rxjs";
import {Game} from "../models/game";
import {GameState} from "../models/game-state.enum";
import {concatAll, map, mergeMap, switchMap, take, takeUntil, tap} from "rxjs/operators";
import {AngularFireObject} from "@angular/fire/database/interfaces";
import {Player} from "../models/player";
import {PlayerAlignment} from "../models/player-alignment.enum";

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
  public players: Observable<Player[]>;


  constructor(private readonly db: AngularFireDatabase) {
  }

  ngOnInit() {
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  private gameStateChange(game: Game) {
    const me = this._me.getValue();
    const players = Object.values(game.players);
    if (me.owner && players.length >= 6 && players.every(player => player.ready === true)) {
      switch (game.state) {
        case GameState.Lobby:
          this.handleGameStart(game);
          break;
        case GameState.FirstNight:
          this.handleFirstNight(game);
          break;
        case GameState.Day:
          this.handleFirstNight(game);
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
    this.db.object(`/games/${this.gameKey}`).update({
      state: GameState.FirstNight
    }).then(_ => {
      this.calcMafia(playerKeys);
    })
  }

  private handleFirstNight(game: Game) {
    this.db.object(`/games/${this.gameKey}`).update({
      state: GameState.Day
    });
  }

  private handleDay(game: Game) {
    this.db.object(`/games/${this.gameKey}`).update({
      state: GameState.Vote
    });
  }

  private handleNight(game: Game) {
    this.db.object(`/games/${this.gameKey}`).update({
      state: GameState.Day
    });
  }

  private handleTownVote(game: Game) {
    this.db.object(`/games/${this.gameKey}`).update({
      state: GameState.Night
    });
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
      this.db.object(`/games/${this.gameKey}/players/${randomPerson}`).update({
        alignment: PlayerAlignment.Mafia
      });
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
      alignment: PlayerAlignment.Townie
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
    this.db.object(`/games/${this.gameKey}/players/${this.playerKey}`).update({
      ready: !this._me.getValue().ready
    });
  }
}
