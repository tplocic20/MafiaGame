import {Component, OnDestroy, OnInit} from '@angular/core';
import {GameService} from "../../../../services/game.service";
import {Observable, Subject} from "rxjs";
import {Player} from "../../../../models/player";
import {map, takeUntil, tap} from "rxjs/operators";

@Component({
  selector: 'app-player-list',
  templateUrl: './player-list.component.html',
  styleUrls: ['./player-list.component.scss']
})
export class PlayerListComponent implements OnInit, OnDestroy {

  private unsubscribe: Subject<void> = new Subject<void>();
  public game = this.gameService.game;
  public players: Observable<Player[]>;
  public me = this.gameService.me;


  constructor(private readonly gameService: GameService) { }

  ngOnInit(): void {
    this.players = this.game.pipe(
      map(game => {
        const keys = Object.keys(game.players)
        return keys.map(key => {
          return {
            ...game.players[key],
            $key: key
          } as Player
        })
      }),
      takeUntil(this.unsubscribe)
    )
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  toggleReady() {
    this.gameService.setReady();
  }

}
