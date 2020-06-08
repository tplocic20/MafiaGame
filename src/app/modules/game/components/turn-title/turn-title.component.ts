import { Component, OnInit } from '@angular/core';
import {GameService} from "../../../../services/game.service";
import {GameState} from "../../../../models/game-state.enum";

@Component({
  selector: 'app-turn-title',
  templateUrl: './turn-title.component.html',
  styleUrls: ['./turn-title.component.scss']
})
export class TurnTitleComponent implements OnInit {
  GameState = GameState;

  public game = this.gameService.game;

  constructor(private readonly gameService: GameService) { }

  ngOnInit(): void {
  }

}
