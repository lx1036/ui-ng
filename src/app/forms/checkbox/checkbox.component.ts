import {Component, ElementRef, forwardRef, Input, OnInit, ViewChild} from '@angular/core';
import {ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR, Validators} from '@angular/forms';

@Component({
  selector: 'app-checkbox',
  template: `
    <label>
      <input #checkbox type="checkbox" [value]="value" [checked]="checked" (change)="change(checkbox.checked, label)"/>
      <div class="ui-checkbox-title">{{label}}</div>
    </label>
  `,
  styleUrls: ['./checkbox.component.css']
})
export class CheckboxComponent implements ControlValueAccessor {
  @Input() label: string;
  @Input() value: any;
  @Input() disabled: boolean;
  @Input() binary: boolean;

  _checked: boolean;

  @Input('checked') set checked(checked: boolean) {
    console.log(checked);
    this._checked = checked;

    if (checked) {
      this.addValue();
    } else {
      this.removeValue();
    }
  }

  checkedValue: Array<any> = [];

  addValue() {
    this.checkedValue = [...this.checkedValue, this.value];

    console.log(this.checkedValue);
  }

  removeValue() {
    this.checkedValue = this.checkedValue.filter(value => value !== this.value);
  }

  get checked(): boolean {
    return this._checked;
  }

  constructor() {
  }

  change(checked, label) {
    console.log(checked);

    if (!this.disabled) {
      this.checked = checked;

      if (!this.binary) {

      }
    }
  }

  writeValue(obj: any): void {
  }

  registerOnChange(fn: any): void {
  }

  registerOnTouched(fn: any): void {
  }

  setDisabledState(isDisabled: boolean): void {
  }

}

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
    console.log('writeValue called with:', value);

    if (value) {
      this.person = value;
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = () => {
      console.log(this.person);
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
