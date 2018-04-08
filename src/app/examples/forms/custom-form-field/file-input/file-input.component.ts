import {FocusMonitor} from '@angular/cdk/a11y';
import {coerceBooleanProperty} from '@angular/cdk/coercion';
import {CommonModule} from '@angular/common';
import {Component, ElementRef, HostBinding, HostListener, Input, NgModule, OnDestroy, OnInit, Renderer2} from '@angular/core';
import {ControlValueAccessor, FormBuilder, FormGroup, FormsModule, NgControl, ReactiveFormsModule, Validators} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {Subject} from 'rxjs/Subject';
import {MatFormFieldControl, MatFormFieldModule} from '@angular/material/form-field';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';


class FileInput {
  private _fileNames;
  
  constructor(private _files: File[], private delimiter: string = ', ') {
    this._fileNames = this._files.map((f: File) => f.name).join(delimiter);
  }
  
  get files() {
    return this._files || [];
  }
  
  get fileNames(): string {
    return this._fileNames;
  }
}

@Component({
  selector: 'mat-file-input',
  template: `
    <div>
      <input #input id="md-input-file" type="file" [attr.multiple]="_multiple? '' : null">
      <span class="filename">{{fileNames()}}</span>
      <span>{{value|json}}</span>
    </div>
  `,
  providers: [
    {
      provide: MatFormFieldControl,
      useExisting: FileInputCustomFormFieldControlComponent,
    }
  ],
  styles: [
    `
      :host:not(.file-input-disabled) {
        cursor: pointer;
      }

      input {
        width: 0px;
        height: 0px;
        opacity: 0;
        overflow: hidden;
        position: absolute;
        z-index: -1;
      }

      .filename {
        display: inline-block;
      }
    `
  ]
})
export class FileInputCustomFormFieldControlComponent implements MatFormFieldControl<FileInput>, ControlValueAccessor, OnDestroy{
  // value
  @Input() set value(fileInput: FileInput | null) {
    this.writeValue(fileInput.files);
    this.stateChanges.next();
  }
  get value(): FileInput | null {
    //console.log(this.elementRef.nativeElement.value);
    return this.empty ? null : new FileInput(this.elementRef.nativeElement.value || []);
  }
  
  // stateChanges
  stateChanges = new Subject<void>();
  ngOnDestroy(): void {
    this.stateChanges.complete();
    this.fm.stopMonitoring(this.elementRef.nativeElement);
  }
  
  // id
  static nextId = 0;
  @HostBinding() id = `file-input-${FileInputCustomFormFieldControlComponent.nextId++}`;
  
  // placeholder
  private _placeholder: string;
  @Input() set placeholder(placeholder) {
    this._placeholder = placeholder;
    this.stateChanges.next();
  }
  get placeholder() {
    return this._placeholder;
  }
  
  focused: boolean;
  constructor(
    private elementRef: ElementRef,
    private fm: FocusMonitor,
    public ngControl: NgControl,
    private renderer: Renderer2
  ) {
    // ngControl
    ngControl.valueAccessor = this;
  
    // focused
    fm.monitor(elementRef.nativeElement, true).subscribe(origin => {
      this.focused = !!origin;
      this.stateChanges.next(); // We also need to remember to emit on the stateChanges stream so change detection can happen.
    });
  }
  
  // ngControl
  writeValue(value: any): void {
    this.renderer.setProperty(this.elementRef.nativeElement, 'value', value);
  }
  // ngControl
  _onChange: Function = (_:any)=>{};
  registerOnChange(fn: any): void {
    this._onChange = fn;
  }
  // ngControl
  _onTouch: Function = ()=>{};
  registerOnTouched(fn: any): void {
    this._onTouch = fn;
  }
  // ngControl
  setDisabledState(isDisabled: boolean): void {
    this.renderer.setProperty(this.elementRef.nativeElement, 'disabled', isDisabled);
  }
  
  // empty
  get empty(): boolean {
    // return this.elementRef.nativeElement.value || this.elementRef.nativeElement.value.length === 0;
    // console.log(this.elementRef.nativeElement.value);
    return !this.elementRef.nativeElement.value;
  }
  
  // shouldLabelFloat
  @Input() valuePlaceholder: string;
  @HostBinding('class.floating')
  get shouldLabelFloat(): boolean {
    return this.focused || !this.empty || this.valuePlaceholder !== undefined;
  }
  
  //required
  private _required = false;
  @Input() set required(req: boolean) {
    this._required = coerceBooleanProperty(req);
    this.stateChanges.next();
  }
  get required() {
    return this._required;
  }
  
  // disabled
  @Input() set disabled(disabled: boolean) {
    this.setDisabledState(coerceBooleanProperty(disabled));
    this.stateChanges.next();
  }
   get disabled(): boolean {
    return this.elementRef.nativeElement.disabled;
  }
  
  // errorState
  @Input() get errorState(): boolean {
    return this.ngControl.touched && this.ngControl.errors !== null;
  }
  
  // controlType
  controlType = 'file-input';
  
  // setDescribedByIds
  @HostBinding('attr.aria-describedby') describedBy = '';
  setDescribedByIds(ids: string[]): void {
    this.describedBy = ids.join(' ');
  }
  
  // onContainerClick
  onContainerClick(event: MouseEvent): void {
    if ((event.target as Element).tagName.toLowerCase() != 'input' && !this.disabled) {
      this.elementRef.nativeElement.querySelector('input').focus();
      this.focused = true;
      
      this.open();
    }
  }
  open() {
    if (!this.disabled) {
      this.elementRef.nativeElement.querySelector('input').click();
    }
  }
  
  // component logic
  fileNames() {
    return this.value ? this.value.fileNames : this.valuePlaceholder;
  }
  
  _multiple: boolean;
  @Input() set multiple(multiple) {
    this._multiple = coerceBooleanProperty(multiple);
  }
  
  @HostListener('change', ['$event']) change(event) {
    const fileList = event.target.files;
    const fileArray = [];
    if (fileList) {
      for (let i = 0; i < fileList.length; i++) {
        fileArray.push(fileList[i]);
      }
    }
    this.value = new FileInput(fileArray);
    this._onChange(this.value);
  }
}


@Component({
  template: `
    <mat-toolbar color="primary">
      Angular Material - File Input
    </mat-toolbar>

    <div style="padding: 7px">
      <form [formGroup]="formDoc" (ngSubmit)="onSubmit()" novalidate>
        <mat-form-field>
          <mat-file-input formControlName="basicfile" placeholder="Basic Input"></mat-file-input>
          <mat-icon matSuffix>folder</mat-icon>
        </mat-form-field>

        <mat-form-field>
          <mat-file-input formControlName="requiredfile" placeholder="Required input" valuePlaceholder="No file selected" required></mat-file-input>
          <mat-icon matSuffix>folder</mat-icon>
          <mat-error *ngIf="formDoc.get('requiredfile').hasError('required')">
            Please select a file
          </mat-error>
          <mat-error *ngIf="formDoc.get('requiredfile').hasError('maxContentSize')">
            <!--The total size must not exceed {{formDoc.get('requiredfile')?.getError('maxContentSize').maxSize | byteFormat}}-->
            <!--({{formDoc.get('requiredfile')?.getError('maxContentSize').actualSize | byteFormat}}).-->
          </mat-error>
        </mat-form-field>
        <pre>{{formDoc.get('requiredfile').errors | json}}</pre>

        <mat-form-field>
          <mat-file-input formControlName="disabledfile" placeholder="Disabled Input"></mat-file-input>
          <mat-icon matSuffix>folder</mat-icon>
        </mat-form-field>

        <mat-form-field>
          <mat-file-input formControlName="multiplefile" placeholder="Multiple inputs" multiple></mat-file-input>
          <mat-icon matSuffix>folder</mat-icon>
        </mat-form-field>

        <!--<button type="submit" [disabled]="formDoc.invalid" mat-raised-button>Submit</button>-->
        <button type="submit" mat-raised-button>Submit</button>
        <hr>
      </form>
    </div>
  `
})
export class ExampleFileInputCustomFormFieldControlComponent implements OnInit {
  formDoc: FormGroup;
  constructor(private fb: FormBuilder) {
  }
  
  ngOnInit() {
    this.formDoc = this.fb.group({
      basicfile: [],
      requiredfile: [{ value: undefined, disabled: false }, [Validators.required]],
      disabledfile: [{ value: undefined, disabled: true }],
      multiplefile: [{ value: undefined, disabled: false }],
    });
  }
  onSubmit() {
    //console.log('SUBMITTED', this.formDoc.value);
  }
}


@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: ExampleFileInputCustomFormFieldControlComponent,
      }
    ]),
  ],
  exports: [RouterModule]
})
export class ExampleFileInputRoutingModule {}

@NgModule({
  imports: [
    // angular
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    
    ExampleFileInputRoutingModule,
    
    // material
    MatToolbarModule,
    MatIconModule,
    MatFormFieldModule,
  ],
  declarations: [
    ExampleFileInputCustomFormFieldControlComponent,
    FileInputCustomFormFieldControlComponent
  ],
  exports: [
    FileInputCustomFormFieldControlComponent,
  ]
})
export class ExampleFileInputModule { }