import {Component, OnInit} from '@angular/core';
import {GameService} from "../../../../services/game.service";
import {GameState} from "../../../../models/game-state.enum";

@Component({
  selector: 'app-game-main',
  templateUrl: './game-main.component.html',
  styleUrls: ['./game-main.component.scss']
})
export class GameMainComponent implements OnInit {
  GameState = GameState;
  public game = this.gameService.game;

  constructor(private gameService: GameService) {
  }

  ngOnInit(): void {
  }

}
