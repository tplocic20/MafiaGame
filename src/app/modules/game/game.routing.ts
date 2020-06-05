import {NgModule} from "@angular/core";
import {Route, RouterModule} from "@angular/router";
import { GameMainComponent } from './components/game-main/game-main.component';

const routes: Route[] = [
  {
    path: ':id',
    component: GameMainComponent
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GameRouter { }
