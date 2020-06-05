import { Component, OnInit } from '@angular/core';
import {animate, keyframes, state, style, transition, trigger} from "@angular/animations";
import {JoinFormEnum} from "../../models/join-form.enum";

@Component({
  selector: 'app-start',
  templateUrl: './start.component.html',
  styleUrls: ['./start.component.scss'],
  animations: [
    trigger('backOutRight', [
      transition('* => void', animate(400, keyframes([
        style({transform: 'scale(1)', opacity: '0.7', offset: 0}),
        style({transform: 'scale(0.7)', offset: .2}),
        style({transform: 'translateX(500px)', offset: 1}),
      ]))),
    ]),
    trigger('fadeIn', [
      state('void', style({
        opacity: '0',
        height: '0',
        transform: 'scale(0.7)',
        overflow: 'hidden'
      })),
      state('*', style({
        transform: 'scale(1)',
        opacity: '1',
        overflow: 'hidden'
      })),
      transition('void => *', [
        animate( '50ms 400ms ease')
      ])
    ])
  ]
})
export class StartComponent implements OnInit {
  JoinFormEnum = JoinFormEnum;

  gameForm = null;

  constructor() { }

  ngOnInit(): void {
  }

  newGame() {
    this.gameForm = JoinFormEnum.NewGame;
  }
  joinGame() {
    this.gameForm = JoinFormEnum.JoinGame;
  }

}
