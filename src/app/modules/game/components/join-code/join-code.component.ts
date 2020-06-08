import { Component, OnInit } from '@angular/core';
import {GameService} from "../../../../services/game.service";
import { GameState } from 'src/app/models/game-state.enum';

@Component({
  selector: 'app-join-code',
  templateUrl: './join-code.component.html',
  styleUrls: ['./join-code.component.scss']
})
export class JoinCodeComponent implements OnInit {
  GameState = GameState;
  public game = this.gameService.game;

  constructor(private readonly gameService: GameService) { }

  ngOnInit(): void {
  }

}
