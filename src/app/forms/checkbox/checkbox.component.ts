import {Component, Input, OnInit} from '@angular/core';
import {ControlValueAccessor} from '@angular/forms';

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
  // @Input() binary: boolean;

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
  }

  removeValue() {
    this.checkedValue = this.checkedValue.filter(value => value !== this.value);
  }

  get checked() {
    return this._checked;
  }

  constructor() { }

  change($event, label) {
    console.log($event);

    if (!this.disabled) {
      this.checked = $event.target.checked;
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
