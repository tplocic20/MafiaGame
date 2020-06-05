import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JoinGameFormComponent } from './join-game-form.component';
import {FormBuilder, ReactiveFormsModule} from "@angular/forms";
import {RouterTestingModule} from "@angular/router/testing";
import {NewGameFormComponent} from "../new-game-form/new-game-form.component";

describe('JoinGameFormComponent', () => {
  let component: JoinGameFormComponent;
  let fixture: ComponentFixture<JoinGameFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, RouterTestingModule ],
      declarations: [ NewGameFormComponent ],
      providers: [
        FormBuilder
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
    expect(component.form.value).toEqual({ gameCode: '' });
  });
  it('JoinGameFormComponent.form with no value should be invalid', () => {
    component.form.setValue({
      gameCode: ''
    });
    component.form.markAllAsTouched();
    fixture.detectChanges();
    expect(component.form.valid).toBeFalse();
  });
  it('JoinGameFormComponent.form with set value should be valid', () => {
    component.form.setValue({
      gameCode: 'test'
    });
    component.form.markAllAsTouched();
    fixture.detectChanges();
    expect(component.form.valid).toBeTrue();
  });
});
