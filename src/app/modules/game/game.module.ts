import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {GameRouter} from "./game.routing";
import { GameMainComponent } from './components/game-main/game-main.component';
import {MatSidenavModule} from "@angular/material/sidenav";
import { PlayerCardComponent } from './components/player-card/player-card.component';
import {MatCardModule} from "@angular/material/card";
import {FlexModule} from "@angular/flex-layout";
import {MatButtonModule} from "@angular/material/button";



@NgModule({
  declarations: [GameMainComponent, PlayerCardComponent],
    imports: [
        CommonModule,
        GameRouter,
        MatSidenavModule,
        MatCardModule,
        FlexModule,
        MatButtonModule
    ]
})
export class GameModule { }
