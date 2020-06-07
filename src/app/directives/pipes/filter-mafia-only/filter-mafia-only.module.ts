import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FilterMafiaOnlyPipe} from "./filter-mafia-only.pipe";



@NgModule({
  declarations: [FilterMafiaOnlyPipe],
  exports: [FilterMafiaOnlyPipe],
  imports: [
    CommonModule
  ]
})
export class FilterMafiaOnlyModule { }
