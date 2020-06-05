import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewGameFormComponent } from './new-game-form.component';
import {FormBuilder, ReactiveFormsModule} from "@angular/forms";
import {RouterTestingModule} from "@angular/router/testing";

describe('NewGameFormComponent', () => {
  let component: NewGameFormComponent;
  let fixture: ComponentFixture<NewGameFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, RouterTestingModule ],
      declarations: [ NewGameFormComponent ],
      providers: [
        FormBuilder
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
    expect(component.form.value).toEqual({ name: '' });
  });
  it('NewGameFormComponent.form with no value should be invalid', () => {
    component.form.setValue({
      name: ''
    });
    component.form.markAllAsTouched();
    fixture.detectChanges();
    expect(component.form.valid).toBeFalse();
  });
  it('NewGameFormComponent.form with set value should be valid', () => {
    component.form.setValue({
      name: 'test'
    });
    component.form.markAllAsTouched();
    fixture.detectChanges();
    expect(component.form.valid).toBeTrue();
  });

});
