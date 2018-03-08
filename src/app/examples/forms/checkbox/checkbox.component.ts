import {CommonModule} from '@angular/common';
import {Component, NgModule, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, FormsModule, NG_VALIDATORS, ReactiveFormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {CheckboxModule, createCounterValidator} from '../../../components/forms/checkbox/checkbox.component';

export function validateCounterRange(fc: FormControl) {
  let err = {given: fc.value, max: 10, min: 0};
  
  return (fc.value > 10 || fc.value < 0) ? err : null;
}

@Component({
  selector: 'app-checkbox',
  templateUrl: './checkbox.component.html',
  styleUrls: ['./checkbox.component.css'],
  providers: [
    // {
    //   provide: NG_VALIDATORS,
    //   useValue: validateCounterRange,
    //   multi: true
    // }
  ]
})
export class ExampleCheckboxComponent implements OnInit {
  outerCounterValue = 5;
  selectedCity: any;
  checked: any;
  binaryChecked: any;
  
  
  modelForm: FormGroup;
  constructor(private fb: FormBuilder) {
    this.modelForm = this.fb.group({
      // counter3: 8
      counter3: [8, createCounterValidator(10, 0)]
    });
  }

  ngOnInit() {
  }
  
  submit(value) {
    console.log(value);
  }
}


@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: ExampleCheckboxComponent
      }
    ]),
  ],
  exports: [RouterModule]
})
export class ExampleCheckboxRoutingModule {
  constructor() {
    console.log(this.constructor.name);
  }
}

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    
    ExampleCheckboxRoutingModule,
    CheckboxModule,
    // TabGroupModule,
    // CodeModule,
  ],
  declarations: [
    ExampleCheckboxComponent,
  ],
})
export class ExampleCheckboxModule {
  constructor() {
    console.log(this.constructor.name);
  }
}