import { Component, OnInit } from '@angular/core';
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

  public form: FormGroup;

  constructor(private readonly fb: FormBuilder,
              private readonly router: Router,
              private gameService: GameService) { }

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
    if (this.form.valid) {
      const data = this.form.value;
      this.gameService.newGame(data.playerName).pipe(
        take(1)
      ).subscribe(gameCode => {
        this.router.navigate(['game', gameCode])
      })
    }
  }

}
