import {Component, Inject, OnInit} from '@angular/core';
import {GameState} from "../../models/game-state.enum";
import {MAT_DIALOG_DATA} from "@angular/material/dialog";

@Component({
  selector: 'app-game-result',
  templateUrl: './game-result-modal.component.html',
  styleUrls: ['./game-result-modal.component.scss']
})
export class GameResultModalComponent implements OnInit {
  GameState=GameState;

  constructor(@Inject(MAT_DIALOG_DATA) public data: GameState) { }

  ngOnInit(): void {
  }

}
