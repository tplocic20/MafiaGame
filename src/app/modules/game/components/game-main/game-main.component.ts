import {Component, OnInit} from '@angular/core';
import {GameService} from "../../../../services/game.service";
import {GameState} from "../../../../models/game-state.enum";
import {PlayerState} from "../../../../models/player-state.enum";

@Component({
  selector: 'app-game-main',
  templateUrl: './game-main.component.html',
  styleUrls: ['./game-main.component.scss']
})
export class GameMainComponent implements OnInit {
  GameState = GameState;
  PlayerState = PlayerState;
  public game = this.gameService.game;
  public me = this.gameService.me;

  constructor(private readonly gameService: GameService) {
  }

  ngOnInit(): void {
  }


  toggleReady() {
    this.gameService.setReady();
  }

}
