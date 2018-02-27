import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {CheckboxComponent, CounterComponent, PersonComponent, PersonTestComponent, SimpleFormControl} from './checkbox.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  declarations: [
    CheckboxComponent,
    CounterComponent,
    PersonComponent,
    PersonTestComponent,
    SimpleFormControl,
  ],
  exports: [
    CheckboxComponent,
    CounterComponent,
    PersonTestComponent,
    SimpleFormControl,
  ]
})
export class CheckboxModule { }
