import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {GameService} from "../../services/game.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-join-game-form',
  templateUrl: './join-game-form.component.html',
  styleUrls: ['./join-game-form.component.scss']
})
export class JoinGameFormComponent implements OnInit {

  @Output() back = new EventEmitter();

  public form: FormGroup;

  constructor(private readonly fb: FormBuilder,
              private readonly router: Router,
              private readonly gameService: GameService) {
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      gameCode: ['', Validators.required],
      playerName: ['', Validators.required]
    })
  }

  get gameCodeCtrl() {
    return this.form.get('gameCode');
  }

  get playerNameCtrl() {
    return this.form.get('playerName');
  }

  join() {
    this.form.markAllAsTouched();
    if (this.form.valid) {
      const data = this.form.value;
      this.gameService.joinGame(data.gameCode, data.playerName).subscribe(item => {
        this.router.navigate(['game', data.gameCode])
      }, err => {
        this.gameCodeCtrl.setErrors({'InvalidCode': true})
      });
    }
  }

}
