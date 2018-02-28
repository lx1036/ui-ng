import { Component, OnInit } from '@angular/core';
import {ControlValueAccessor} from '@angular/forms';

@Component({
  selector: 'app-radio',
  template: `
    <label>
      <input #radio type="radio" [disabled]="disabled" [checked]="checked" [name]="name" (change)="change(radio.checked)"/>
      <div class="ui-radio-title">{{label}}</div>
    </label>
  `,
  styleUrls: ['./radio.component.css']
})
export class RadioComponent implements ControlValueAccessor {
  writeValue(obj: any): void {
  }

  registerOnChange(fn: any): void {
  }

  registerOnTouched(fn: any): void {
  }

  setDisabledState(isDisabled: boolean): void {
  }

  constructor() { }

}
