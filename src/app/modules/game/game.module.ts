import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {GameRouter} from "./game.routing";
import { GameMainComponent } from './components/game-main/game-main.component';
import {MatSidenavModule} from "@angular/material/sidenav";
import { PlayerCardComponent } from './components/player-card/player-card.component';
import {MatCardModule} from "@angular/material/card";
import {FlexModule} from "@angular/flex-layout";
import {MatButtonModule} from "@angular/material/button";
import { PlayerListComponent } from './components/player-list/player-list.component';
import {MatListModule} from "@angular/material/list";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import { JoinCodeComponent } from './components/join-code/join-code.component';
import {FilterMafiaOnlyModule} from "../../directives/pipes/filter-mafia-only/filter-mafia-only.module";



@NgModule({
  declarations: [GameMainComponent, PlayerCardComponent, PlayerListComponent, JoinCodeComponent],
    imports: [
        CommonModule,
        GameRouter,
        MatSidenavModule,
        MatCardModule,
        FlexModule,
        MatButtonModule,
        MatListModule,
        MatProgressSpinnerModule,
        FilterMafiaOnlyModule
    ]
})
export class GameModule { }
