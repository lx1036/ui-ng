import {CommonModule} from '@angular/common';
import {
  AfterViewInit, Component, ComponentFactoryResolver, EventEmitter, Injectable, Input, NgModule, OnInit, Output, ViewChild,
  ViewContainerRef
} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatInputModule} from '../packages/material/input';
import {MatFormFieldModule} from '../packages/material/form-field';

/**
 * https://blog.angularindepth.com/everything-you-need-to-know-about-the-expressionchangedafterithasbeencheckederror-error-e3fd9ce7dbb4
 *
 * update bound properties for all child components/directives
 * call ngOnInit, OnChanges and ngDoCheck lifecycle hooks on all child components/directives
 * update DOM for the current component
 * run change detection for a child component
 * call ngAfterViewInit lifecycle hook for all child components/directives
 *
 */
@Component({
  selector: 'a-comp',
  template: `
    <span>{{name}}</span>
    <br/>
    <b-comp [text]="text"></b-comp>
  `
})
export class AComponent {
  name = 'I am A Component';
  text = 'A message from A Component';
}

@Component({
  selector: 'b-comp',
  template: `
    <span>{{text}}</span>
  `
})
export class BComponent implements OnInit, AfterViewInit {
  @Input() text;
  
  constructor(private parent: AComponent) {}
  
  ngOnInit() {
    // this.parent.text = 'Updated message'; // run change detection for a child component
    // this.parent.name = 'Updated name'; // call ngOnInit, OnChanges and ngDoCheck lifecycle hooks on all child components/directives
  }
  
  ngAfterViewInit() {
    // this.parent.name = 'Updated second name';
  }
}

////////////////Shared Service////////////////////////
@Injectable()
export class SharedService {
  listeners = [];
  _text = '';
  
  onNameChange(fn) {
    this.listeners.push(fn);
  }
  
  set text(value) {
    this._text = value;
    this.listeners.forEach((fn) => {
      fn(value);
    })
  }
}

@Component({
  selector: 'c-comp',
  template: `
      <h1>Hello {{name}}</h1>
      <d-comp [text]="text"></d-comp>
  `,
})
export class CComponent {
  name = 'I am A component';
  text = 'A message for the child component';
  
  constructor(sharedService: SharedService) {
    sharedService.onNameChange((value) => {
      this.text = value;
    })
  }
}

@Component({
  selector: 'd-comp',
  template: `
        <span>{{name}}</span>
    `
})
export class DComponent {
  name = 'I am D component';
  @Input() text;
  
  constructor(private sharedService: SharedService) {}
  
  ngOnInit() {
    // this.sharedService.text = 'updated name';
  }
}
////////////////Shared Service////////////////////////


///////////////Synchronous event broadcasting//////////////////


@Component({
  selector: 'e-comp',
  template: `
        <span>{{name}}</span>
    `
})
export class EComponent {
  name = 'I am E component';
  @Input() text;
  @Output() change = new EventEmitter();
  
  constructor() {
  
  }
  
  ngOnInit() {
    this.change.emit('updated text');
  }
}

@Component({
  selector: 'f-comp',
  template: `
      <h1>Hello {{name}}</h1>
      <e-comp [text]="text" (change)="update($event)"></e-comp>
  `,
})
export class FComponent {
  name = 'I am F component';
  text = 'A message for the child component';
  
  constructor() {}
  
  update(value) {
    // this.text = value;
  }
}

///////////////Synchronous event broadcasting//////////////////



//////////////Dynamic component instantiation///////////////////

@Component({
  selector: 'g-comp',
  template: `
        <span>{{name}}</span>
    `
})
export class GComponent {
  name = 'I am G component';
  
  constructor() {
  }
}

@Component({
  selector: 'h-comp',
  template: `
      <h1>Hello {{name}}</h1>
      <ng-container #vc></ng-container>
  `,
})
export class HComponent {
  @ViewChild('vc', {read: ViewContainerRef}) vc;
  name = 'I am H component';
  
  constructor(private r: ComponentFactoryResolver) {
  }
  
  ngAfterViewInit() {
    // const componentRef = this.vc.createComponent(this.r.resolveComponentFactory(GComponent));
  }
}

//////////////Dynamic component instantiation///////////////////


/**
 * https://github.com/angular/material2/issues/7737
 */
@Component({
  selector: 'i-comp',
  template: `
    <h1>i-comp</h1>
    <form [formGroup]="form">
      <mat-form-field>
        <!--<ng-template [ngIf]="true">-->
        <input matInput placeholder="Enter name">
        <!--</ng-template>-->
        <!--<input  matInput placeholder="Enter name">-->
        <mat-hint>Some hint.</mat-hint>
        <!--<input *ngIf="true" matInput placeholder="Enter name">-->
        <!--<input *ngIf="isFile()" matInput placeholder="Enter name" formControlName="filename">-->
        <!--<input *ngIf="isDirectory()" matInput placeholder="Enter name" formControlName="filename">-->
        <!--<mat-hint>Some hint.</mat-hint>-->
      </mat-form-field>
    </form>
    
    <p>{{form.value | json}}</p>
  `
})
export class IComponent {
  
  form: FormGroup;
  
  constructor(private formBuilder: FormBuilder) {
  
  }
  
  ngOnInit() {
    this.form = this.formBuilder.group({
      filename: ['']
    })
  }
  
  
  isFile() {
    return true;
  }
  
  isDirectory() {
    return false;
  }
}





@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  declarations: [
    AComponent,
    BComponent,
  
    CComponent,
    DComponent,
  
    EComponent,
    FComponent,
  
    GComponent,
    HComponent,
  
    IComponent,
  ],
  entryComponents: [
    GComponent,
  ],
  providers: [
    SharedService,
  ],
  exports: [
    AComponent,
    BComponent,
  
    CComponent,
    DComponent,
  
    EComponent,
    FComponent,
  
    GComponent,
    HComponent,
  
    IComponent,
  ]
})
export class ExpressionChangedModule {}