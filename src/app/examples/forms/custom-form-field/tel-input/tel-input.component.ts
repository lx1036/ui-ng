import {A11yModule, FocusMonitor} from '@angular/cdk/a11y';
import {coerceBooleanProperty} from '@angular/cdk/coercion';
import {CdkTableModule} from '@angular/cdk/table';
import {CommonModule} from '@angular/common';
/** Data structure for holding telephone number. */
import {Component, ElementRef, HostBinding, Input, NgModule, OnDestroy} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, NgControl, ReactiveFormsModule} from '@angular/forms';
import {MatFormFieldControl, MatFormFieldModule, MatIconModule} from '@angular/material';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule, NoopAnimationsModule} from '@angular/platform-browser/animations';
import {RouterModule} from '@angular/router';
import {Subject} from 'rxjs/Subject';


export class Tel {
  constructor(public area: string, public exchange: string, public subscriber: string) {}
}

@Component({
  selector: 'tel-input',
  template: `
    <div [formGroup]="parts">
      <input class="area" formControlName="area" size="3">
      <span>&ndash;</span>
      <input class="exchange" formControlName="exchange" size="3">
      <span>&ndash;</span>
      <input class="subscriber" formControlName="subscriber" size="4">
    </div>
    <span>{{value|json}}</span>
  `,
  styles: [
    `
      div {
          display: flex;
      }
      input {
          border: none;
          background: none;
          padding: 0;
          outline: none;
          font: inherit;
          text-align: center;
      }
      span {
        opacity: 0;
        transition: opacity 200ms;
      }
      :host.floating span {
        opacity: 1;
      }
    `,
  ],
  providers: [
    {
      provide: MatFormFieldControl,
      useExisting: TelInputCustomFormFieldControlComponent,
      multi: true,
    },
  ],
  host: {
    '[class.floating]': 'shouldLabelFloat',
    '[id]': 'id',
    '[attr.aria-describedby]': 'describedBy',
  }
})
export class TelInputCustomFormFieldControlComponent implements MatFormFieldControl<Tel>, OnDestroy {
  parts: FormGroup;
  
  // value, property which allow to set/get value of this form control, its type should be the type parameter, like Tel in this case.
  @Input() set value(tel: Tel | null) {
    tel = tel || new Tel('', '', '');
    this.parts.setValue({area: tel.area, exchange: tel.exchange, subscriber: tel.subscriber});
    this.stateChanges.next();
  }
  get value(): Tel | null {
    let n = this.parts.value;
    
    if (n.area.length == 1 && n.exchange.length == 1 && n.subscriber.length == 1) {
      return new Tel(n.area, n.exchange, n.subscriber);
    }
    
    return null;
  }
  
  // stateChanges, when the form control value changes, inform the outside world to change detection.
  stateChanges = new Subject<void>();
  ngOnDestroy(): void {
    this.stateChanges.complete();
    this.fm.stopMonitoring(this.elementRef.nativeElement);
  }
  
  // id, associate labels and hint.
  static nextId = 0;
  @HostBinding() id = `tel-input-${TelInputCustomFormFieldControlComponent.nextId++}`;
  
  // placeholder
  private _placeholder: string;
  @Input() set placeholder(placeholder) {
    this._placeholder = placeholder;
    this.stateChanges.next(); // Since the value of the placeholder may change over time, we need to make sure to trigger change detection in the parent form field.
  }
  get placeholder() {
    return this._placeholder;
  }
  
  // ngControl
  ngControl: NgControl = null; // It is likely you will want to implement ControlValueAccessor so that your component can work with formControl and ngModel.
  
  // focused, this property indicates whether or not the form field control should be considered to be in a focused state.
  focused = false;
  constructor(private fb: FormBuilder, private elementRef: ElementRef, private fm: FocusMonitor) {
    this.parts = fb.group({
      'area': '',
      'exchange': '',
      'subscriber': '',
    });
    
    fm.monitor(elementRef.nativeElement, true).subscribe(origin => {
      this.focused = !!origin;
      this.stateChanges.next(); // We also need to remember to emit on the stateChanges stream so change detection can happen.
    });
  }
  
  // empty, property indicates whether the form field control is empty.
  get empty() {
    let value = this.parts.value;
    return !value.area && !value.exchange && !value.subscriber;
  }
  
  // shouldLabelFloat, property is used to indicate whether the label should be in the floating position.
  @HostBinding('class.floating')
  get shouldLabelFloat(): boolean {
    return this.focused || !this.empty;
  }
  
  // required, property is used to indicate whether the input is required. <mat-form-field> uses this information to add a required indicator to the placeholder.
  private _required = false;
  @Input() set required(required) {
    this._required = coerceBooleanProperty(required);
    this.stateChanges.next(); // we'll want to make sure we run change detection if the required state changes.
  }
  get required() {
    return this._required;
  }
  
  
  // disabled, property tells the form field when it should be in the disabled state.
  private _disabled = false;
  @Input() set disabled(disabled) {
    this._disabled = coerceBooleanProperty(disabled);
    this.stateChanges.next();
  }
  get disabled() {
    return this._disabled;
  }
  
  // errorState, property indicates whether the associated NgControl is in an error state.
  errorState = false;
  
  // controlType, property allows us to specify a unique string for the type of control in form field.
  controlType = 'tel-input';
  
  // setDescribedByIds, method is used by the <mat-form-field> to specify the IDs that should be used for the aria-describedby attribute of your component.
  @HostBinding('attr.aria-describedby') describedBy = '';
  setDescribedByIds(ids: string[]) {
    this.describedBy = ids.join(' ');
  }
  
  // onContainerClick, method will be called when the form field is clicked on.
  onContainerClick(event: MouseEvent) {
    if ((event.target as Element).tagName.toLowerCase() != 'input') {
      this.elementRef.nativeElement.querySelector('input').focus();
    }
  }
}

/** @title Form field with custom telephone number input control. */
@Component({
  selector: 'example-custom-form-field-control',
  template: `
    <mat-form-field>
      <tel-input></tel-input>
      <mat-icon matSuffix>phone</mat-icon>
      <mat-hint>Include area code</mat-hint>
    </mat-form-field>
  `
})
export class ExampleCustomFormFieldControl {}

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: ExampleCustomFormFieldControl
      }
    ]),
  ],
  exports: [RouterModule]
})
export class ExampleTelInputRoutingModule {
  constructor() {
    console.log(this.constructor.name);
  }
}


@NgModule({
  imports: [
    // angular
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    
    //routing
    ExampleTelInputRoutingModule,
    
    // material
    A11yModule,
    MatFormFieldModule,
    MatIconModule,
  ],
  declarations: [
    ExampleCustomFormFieldControl,
    TelInputCustomFormFieldControlComponent
  ],
  exports: [
    TelInputCustomFormFieldControlComponent,
  ]
})
export class ExampleTelInputModule { }