import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {CheckboxComponent, CounterComponent, PersonComponent, PersonTestComponent} from './checkbox.component';
import {FormsModule} from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    FormsModule
  ],
  declarations: [
    CheckboxComponent,
    CounterComponent,
    PersonComponent,
    PersonTestComponent,
  ],
  exports: [
    CheckboxComponent,
    CounterComponent,
    PersonTestComponent,
  ]
})
export class CheckboxModule { }
