import {Component, Input, OnInit} from '@angular/core';
import {MatDrawer} from "@angular/material/sidenav";
import {GameService} from "../../../../services/game.service";
import {Observable} from "rxjs";
import {map} from "rxjs/operators";
import {GameState} from "../../../../models/game-state.enum";
import {PlayerAlignment} from "../../../../models/player-alignment.enum";

@Component({
  selector: 'app-player-card',
  templateUrl: './player-card.component.html',
  styleUrls: ['./player-card.component.scss']
})
export class PlayerCardComponent implements OnInit {
  PlayerAlignment = PlayerAlignment;

  @Input() drawer: MatDrawer;
  public me = this.gameService.me;
  public game = this.gameService.game;
  public gameReady: Observable<boolean>;

  constructor(private readonly gameService: GameService) { }

  ngOnInit(): void {
    this.gameReady = this.gameService.game.pipe(
      map(game => game.state !== GameState.Lobby)
    );
  }

  toggleVision() {
    this.drawer.close();
  }

}
