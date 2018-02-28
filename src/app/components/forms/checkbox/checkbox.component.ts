import {Component, ElementRef, forwardRef, Input, NgModule, OnInit, ViewChild} from '@angular/core';
import {ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR, Validators} from '@angular/forms';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-checkbox',
  template: `
    <label [ngClass]="'form-checkbox'" [class]="styleClass">
      <input #checkbox type="checkbox" 
             [disabled]="disabled"
             [value]="value" [checked]="checked" [name]="name"
             (change)="change(checkbox.checked, label)"/>
      <div class="ui-checkbox-title">{{label}}</div>
    </label>
  `,
  styleUrls: ['./checkbox.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: CheckboxComponent,
      multi: true
    }
  ]
})
export class CheckboxComponent implements ControlValueAccessor {
  @Input() name: string;
  @Input() label: string;
  @Input() value: any;
  @Input() disabled: boolean;
  @Input() binary: boolean = false;
  @Input() styleClass: string;

  _checked: boolean;
  onModelChange: Function = (value) => {};

  @Input('checked') set checked(checked: boolean) {
    this._checked = checked;

    if (checked) {
      this.addValue();
    } else {
      this.removeValue();
    }
  }
  get checked(): boolean {
    return this._checked;
  }

  checkedValue: any = [];

  constructor() {
  }

  addValue() {
    if (this.isChecked()) return;

    this.checkedValue = [...this.checkedValue, this.value];
  }

  removeValue() {
    this.checkedValue = this.checkedValue.filter(value => value !== this.value);
  }

  change(checked: boolean, label: string) {
    if (!this.disabled) {
      this.checked = checked;

      if (!this.binary) {
        this.onModelChange(this.checkedValue);
      }
    }
  }

  writeValue(value: any): void {
    if (value) {
      this.checkedValue = value;

      if (!this.binary && !Array.isArray(this.checkedValue)) {
        this.checkedValue = [value];
      }

      this.checked = this.isChecked();
    }
  }

  registerOnChange(fn: any): void {
    this.onModelChange = fn;
  }

  registerOnTouched(fn: any): void {
  }

  setDisabledState(isDisabled: boolean): void {
  }

  isChecked(): boolean {
    return this.checkedValue.indexOf(this.value) !== -1; // check value if exists in checkedValue
  }
}


@NgModule({
  imports: [CommonModule],
  declarations: [CheckboxComponent],
  exports: [CheckboxComponent],
})
export class CheckboxModule {}


/////////////////////////*****Test*****//////////////////////////////////////////////
// Example(https://segmentfault.com/a/1190000009070500#articleHeader19)

export const CONTROL_VALUE_ACCESSOR = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => CounterComponent),
  multi: true,
};

@Component({
  selector: 'exe-counter',
  template: `
    <div>
      <p>current value: {{count}}</p>
      <button (click)="increment()">+</button>
      <button (click)="decrement()">-</button>
    </div>
  `,
  providers: [CONTROL_VALUE_ACCESSOR]
})
export class CounterComponent implements ControlValueAccessor {
  propagateChange = (value) => {};

  writeValue(value: any): void {
    if (value) {
      this.count = value;
    }
  }

  registerOnChange(fn: any): void {
    this.propagateChange = fn;
  }

  registerOnTouched(fn: any): void {
  }

  setDisabledState(isDisabled: boolean): void {
  }

  count: number = 0;

  increment() {
    this.count++;
    this.propagateChange(this.count);
  }

  decrement() {
    this.count--;
    this.propagateChange(this.count);
  }
}

// Example(https://plnkr.co/edit/PDaIgVOV0aN6lNh7Nstu?p=preview)
@Component({
  selector: 'person',
  template: `
    <div style="border: 1px solid black; padding: 1rem; margin: 1rem;" *ngIf="person">
      <p>Name: <input type="text" [(ngModel)]="person.name" (change)="onChange()"/></p>
      <p>Age: <input type="text" [(ngModel)]="person.age" (change)="onChange()"/></p>
      <p>Gender: 
        <select [(ngModel)]="person.gender" (change)="onChange()">
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>
      </p>
    </div>
  `,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: PersonComponent,
      multi: true
    }
  ]
})
export class PersonComponent implements ControlValueAccessor {
  person: Person;
  onChange: any;

  writeValue(value: any): void {
    if (value) {
      this.person = value;
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = () => {
      // fn(this.person);
    }
  }

  registerOnTouched(fn: any): void {
  }

  setDisabledState(isDisabled: boolean): void {
  }

}

@Component({
  selector: 'person-test',
  template: `
    <form #myForm="ngForm">
      <person
        [(ngModel)]="people[i]"
        *ngFor="let person of people; index as i; trackBy: trackByIndex"
        name="person-{{i}}"
        (change)="onPersonChange()"></person>
      <button (click)="addPerson()">Add Person</button>
    </form>
    <pre>form: {{form.value | json}}</pre>
    <pre>friends: {{people | json}}</pre>
  `
})
export class PersonTestComponent {
  people = [
    {
      name: 'lx1',
      age: 1,
      gender: 'male',
    },
    {
      name: 'lx2',
      age: 2,
      gender: 'female',
    }
  ];

  @ViewChild('myForm') form;
  @ViewChild('input[name="name"]') nameField: ElementRef;
  name: string;

  trackByIndex(index) {
    return index;
  }

  onPersonChange() {

  }

  addPerson() {
    this.people.push(new Person());
  }
}

export class Person {
  name: string;
  age: number;
  gender: 'male' | 'female';
}

// Example FormControl
/**
 * In other words, this directive ensures that any values written to the {@link FormControl}
 * instance programmatically will be written to the DOM element (model -> view). Conversely,
 * any values written to the DOM element through user input will be reflected in the
 * {@link FormControl} instance (view -> model).
 */
@Component({
  selector: 'example-form-control',
  template: `
    <input [formControl]="control">

    <p>Value: {{ control.value }}</p>
    <p>Validation status: {{ control.status }}</p>

    <button (click)="setValue()">Set value</button>
  `
})
export class SimpleFormControl {
  control: FormControl = new FormControl('value', Validators.minLength(6));

  setValue() {
    this.control.setValue('new value');
  }
}


// Example NgModel Directive
@Component({
  selector: 'example-ng-model',
  template: `
    <input [(ngModel)]="name" #ctl="ngModel" required>
    <input [ngModel]="name" required>

    <p>Value: {{ name }}</p>
    <p>Validation status: {{ ctl.valid }}</p>

    <button (click)="setValue()">Set value</button>
  `
})
export class SimpleNgModel {
  // control: FormControl = new FormControl('value', Validators.minLength(6));
  name: string = '';

  setValue() {
    // this.control.setValue('new value');
    this.name = 'new value';
  }
}
