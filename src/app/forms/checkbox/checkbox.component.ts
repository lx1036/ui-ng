import {Component, forwardRef, Input, OnInit} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';

@Component({
  selector: 'app-checkbox',
  template: `
    <label>
      <input type="checkbox" [value]="value" [checked]="checked" (change)="change($event, label)"/>
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

  @Input set checked(checked: boolean) {
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

  constructor() { }

  change($event, label) {
    console.log($event);

    if (!this.disabled) {
      this.checked = $event.target.checked;

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
export class CounterComponent implements ControlValueAccessor{
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
