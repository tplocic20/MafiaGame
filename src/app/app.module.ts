import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {ServiceWorkerModule} from '@angular/service-worker';
import {environment} from '../environments/environment';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {AppRouter} from "./app.router";
import {StartComponent} from './common/start/start.component';
import {MatCardModule} from "@angular/material/card";
import {MatDividerModule} from "@angular/material/divider";
import {MatButtonModule} from "@angular/material/button";
import {NewGameFormComponent} from './common/new-game-form/new-game-form.component';
import {JoinGameFormComponent} from './common/join-game-form/join-game-form.component';
import {MatFormFieldModule} from "@angular/material/form-field";
import {ReactiveFormsModule} from "@angular/forms";
import {MatInputModule} from "@angular/material/input";
import {FlexLayoutModule} from "@angular/flex-layout";
import {AngularFireModule} from "@angular/fire";
import {AngularFireDatabaseModule} from "@angular/fire/database";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import { GameResultModalComponent } from './common/loader/game-result-modal.component';
import {MatDialogModule} from "@angular/material/dialog";
import {MatSnackBarModule} from "@angular/material/snack-bar";

@NgModule({
  declarations: [
    AppComponent,
    StartComponent,
    NewGameFormComponent,
    JoinGameFormComponent,
    GameResultModalComponent,
  ],
  imports: [
    BrowserModule,
    AppRouter,
    ServiceWorkerModule.register('ngsw-worker.js', {enabled: environment.production}),
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireDatabaseModule,
    FlexLayoutModule,
    BrowserAnimationsModule,
    MatCardModule,
    MatDividerModule,
    MatDialogModule,
    MatSnackBarModule,
    MatButtonModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule,
    MatProgressSpinnerModule
  ],
  providers: [],
  entryComponents: [GameResultModalComponent],
  bootstrap: [AppComponent]
})
export class AppModule {
}
