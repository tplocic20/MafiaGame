import {Component, OnDestroy, OnInit} from '@angular/core';
import {GameService} from "./services/game.service";
import {takeUntil} from "rxjs/operators";
import {Subject} from "rxjs";
import {MatDialog, MatDialogRef} from "@angular/material/dialog";
import {GameResultModalComponent} from "./common/loader/game-result-modal.component";
import {GameState} from "./models/game-state.enum";
import {Router} from "@angular/router";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {

  private unsubscribe: Subject<void> = new Subject<void>();
  private dialogRef: MatDialogRef<GameResultModalComponent>;
  public loading = this.gameService.loading;

  constructor(private readonly gameService: GameService,
              private readonly dialog: MatDialog,
              private readonly router: Router) {
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  ngOnInit(): void {
    this.gameService.game.pipe(
      takeUntil(this.unsubscribe)
    ).subscribe(game => {
      if (game) {
        if (game.state === GameState.CityWon || game.state === GameState.MafiaWon) {
          this.dialog.open(GameResultModalComponent, {
            data: game.state
          }).beforeClosed().subscribe(_ => {
            this.router.navigate(['/start']);
          })
        }
      }
    })
  }
}
