import {Component, Input, OnInit} from '@angular/core';
import {MatDrawer} from "@angular/material/sidenav";
import {GameService} from "../../../../services/game.service";

@Component({
  selector: 'app-player-card',
  templateUrl: './player-card.component.html',
  styleUrls: ['./player-card.component.scss']
})
export class PlayerCardComponent implements OnInit {

  @Input() drawer: MatDrawer;
  public me = this.gameService.me;

  constructor(private readonly gameService: GameService) { }

  ngOnInit(): void {
  }

  toggleVision() {
    this.drawer.close();
  }

}
