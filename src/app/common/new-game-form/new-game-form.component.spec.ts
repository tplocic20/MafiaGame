import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {NewGameFormComponent} from './new-game-form.component';
import {FormBuilder, ReactiveFormsModule} from "@angular/forms";
import {RouterTestingModule} from "@angular/router/testing";
import {AngularFireModule} from "@angular/fire";
import {AngularFireDatabase, AngularFireDatabaseModule} from "@angular/fire/database";
import {MatSnackBarModule} from "@angular/material/snack-bar";

describe('NewGameFormComponent', () => {
  let component: NewGameFormComponent;
  let fixture: ComponentFixture<NewGameFormComponent>;
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
      ], declarations: [NewGameFormComponent],
      providers: [
        FormBuilder,
        AngularFireDatabase
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewGameFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('NewGameFormComponent.form initially should be not Touched', () => {
    expect(component.form.touched).toBeFalse();
  });
  it('NewGameFormComponent.form initially should be empty', () => {
    expect(component.form.value).toEqual({playerName: ''});
  });
  it('NewGameFormComponent.form with no value should be invalid', () => {
    component.form.setValue({
      playerName: ''
    });
    component.form.markAllAsTouched();
    fixture.detectChanges();
    expect(component.form.valid).toBeFalse();
  });
  it('NewGameFormComponent.form with set value should be valid', () => {
    component.form.setValue({
      playerName: 'test'
    });
    component.form.markAllAsTouched();
    fixture.detectChanges();
    expect(component.form.valid).toBeTrue();
  });

});
