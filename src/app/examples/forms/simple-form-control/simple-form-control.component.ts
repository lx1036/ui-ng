import {Component} from '@angular/core';
import {FormControl, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {NgModule} from '@angular/core';

@Component({
  selector: 'simple-form-control',
  template: `
     <input [formControl]="control">
     
     <p>Value: {{ control.value }}</p>
     <p>Validation status: {{ control.status }}</p>
     
     <button (click)="setValue()">Set value</button>
  `,
})
export class SimpleFormControl {
  control: FormControl = new FormControl('value', Validators.minLength(2));
  
  setValue() { this.control.setValue('new value'); }
}



@NgModule({
  imports: [
    ReactiveFormsModule,
  ],
  exports: [SimpleFormControl],
  declarations: [SimpleFormControl],
  providers: [],
})
export class SimpleFormControlModule {
}
