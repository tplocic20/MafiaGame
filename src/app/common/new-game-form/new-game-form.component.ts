import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {GameService} from "../../services/game.service";
import {take} from "rxjs/operators";

@Component({
  selector: 'app-new-game-form',
  templateUrl: './new-game-form.component.html',
  styleUrls: ['./new-game-form.component.scss']
})
export class NewGameFormComponent implements OnInit {

  @Output() back = new EventEmitter();

  public form: FormGroup;
  public loading = false;

  constructor(private readonly fb: FormBuilder,
              private readonly router: Router,
              private readonly gameService: GameService) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      playerName: ['', Validators.required]
    })
  }

  get playerNameCtrl() {
    return this.form.get('playerName');
  }

  start() {
    this.form.markAllAsTouched();
    if (this.form.valid && !this.loading) {
      this.loading = true;
      const data = this.form.value;
      this.gameService.newGame(data.playerName).pipe(
        take(1)
      ).subscribe(gameCode => {
        console.log(gameCode);
        this.router.navigate(['game', gameCode]).then(_ => {
          this.loading = false;
        })
      })
    }
  }

}
