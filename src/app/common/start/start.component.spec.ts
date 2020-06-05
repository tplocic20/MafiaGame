import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StartComponent } from './start.component';
import {JoinFormEnum} from "../../models/join-form.enum";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";

describe('StartComponent', () => {
  let component: StartComponent;
  let fixture: ComponentFixture<StartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule
      ],
      declarations: [ StartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('StartComponent.gameForm should me null', () => {
    expect(component.gameForm).toBeNull();
  });
  it('StartComponent.newGame should set gameFormValue', () => {
    component.newGame();
    fixture.detectChanges();
    expect(component.gameForm).toBe(JoinFormEnum.NewGame);
  });
  it('StartComponent.joinGame should set gameFormValue', () => {
    component.joinGame();
    fixture.detectChanges();
    expect(component.gameForm).toBe(JoinFormEnum.JoinGame);
  });
});
