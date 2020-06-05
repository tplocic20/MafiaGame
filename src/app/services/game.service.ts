import {Injectable, OnDestroy} from '@angular/core';
import {AngularFireDatabase} from "@angular/fire/database";
import {BehaviorSubject, combineLatest, forkJoin, from, Subject} from "rxjs";
import {Game} from "../models/game";
import {GameState} from "../models/game-state.enum";
import {concatAll, map, switchMap, take, takeUntil, tap} from "rxjs/operators";
import {AngularFireObject} from "@angular/fire/database/interfaces";
import {Player} from "../models/player";

@Injectable({
  providedIn: 'root'
})
export class GameService implements OnDestroy {

  private unsubscribe: Subject<void> = new Subject<void>();
  private gameKey;

  private _game: BehaviorSubject<Game> = new BehaviorSubject<Game>(null);
  public game = this._game.asObservable();
  private _me: BehaviorSubject<Player> = new BehaviorSubject<Player>(null);
  public me = this._me.asObservable();


  constructor(private readonly db: AngularFireDatabase) {
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
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
        return combineLatest([this.joinPlayer(playerName), this.fetchGame(item.key)]).pipe(
          map(_ => code)
        )
      }),
    )
  }

  private fetchGame(key) {
    return this.db.object(`/games/${key}`).valueChanges()
      .pipe(
        takeUntil(this.unsubscribe),
        tap(item => {
          this._game.next(item as Game);
          console.info('game', item)
        })
      )
  }

  joinGame(code: string, playerName: string) {
    return this.db.list('games',
      ref => ref.orderByChild('accessCode()').equalTo(code).limitToFirst(1))
      .snapshotChanges()
      .pipe(
        take(1),
        tap(res => {
          if (res.length === 0) {
            throw "InvalidCode";
          } else {
            this.fetchGame(res[0].key)
          }
        }),
        switchMap(res => {
          this.gameKey = res[0].key;
          return combineLatest([this.joinPlayer(playerName), this.fetchGame(res[0].key)]).pipe(
            map(_ => code)
          )
        })
      )
  }

  joinPlayer(name: string) {
    return from(this.db.list(`/games/${this.gameKey}/players`).push(name)).pipe(
      take(1),
      tap(item => {
        this.fetchPlayer(item.key);
      })
    )
  }

  private fetchPlayer(key) {
    this.db.object(`/games/${this.gameKey}/players/${key}`).valueChanges()
      .pipe(
        takeUntil(this.unsubscribe),
        tap((item: Player) => this._me.next({
          ...item,
          $key: key
        }))
      ).subscribe(val => console.info('player', val))
  }
}
