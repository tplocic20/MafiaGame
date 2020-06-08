import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JoinGameFormComponent } from './join-game-form.component';
import {FormBuilder, ReactiveFormsModule} from "@angular/forms";
import {RouterTestingModule} from "@angular/router/testing";
import {NewGameFormComponent} from "../new-game-form/new-game-form.component";
import {AngularFireDatabase, AngularFireDatabaseModule} from "@angular/fire/database";
import {AngularFireModule} from "@angular/fire";
import {MatSnackBarModule} from "@angular/material/snack-bar";

describe('JoinGameFormComponent', () => {
  let component: JoinGameFormComponent;
  let fixture: ComponentFixture<JoinGameFormComponent>;
  const firebaseConfig = {
    databaseURL: "https://example.firebaseio.com",
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule,
        RouterTestingModule,
        AngularFireModule.initializeApp(firebaseConfig),
        AngularFireDatabaseModule,
        AngularFireDatabaseModule,
        MatSnackBarModule
      ],
      declarations: [ NewGameFormComponent ],
      providers: [
        FormBuilder,
        AngularFireDatabase
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JoinGameFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('JoinGameFormComponent.form initially should be not Touched', () => {
    expect(component.form.touched).toBeFalse();
  });
  it('JoinGameFormComponent.form initially should be empty', () => {
    expect(component.form.value).toEqual({ gameCode: '', playerName: '' });
  });
  it('JoinGameFormComponent.form with no value should be invalid', () => {
    component.form.setValue({
      gameCode: '',
      playerName: ''
    });
    component.form.markAllAsTouched();
    fixture.detectChanges();
    expect(component.form.valid).toBeFalse();
  });
  it('JoinGameFormComponent.form with set value should be valid', () => {
    component.form.setValue({
      gameCode: 'test',
      playerName: 'name'
    });
    component.form.markAllAsTouched();
    fixture.detectChanges();
    expect(component.form.valid).toBeTrue();
  });
});
