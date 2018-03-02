import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  CheckboxComponent, CounterComponent, PersonComponent, PersonTestComponent, SimpleFormControl,
  SimpleNgModel
} from './checkbox.component';
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
    SimpleNgModel,
  ],
  exports: [
    CheckboxComponent,
    CounterComponent,
    PersonTestComponent,
    SimpleFormControl,
    SimpleNgModel,
  ]
})
export class CheckboxModule { }
