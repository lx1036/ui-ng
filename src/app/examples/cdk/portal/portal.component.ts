import {Component, NgModule, QueryList, ViewChildren} from '@angular/core';
import {CdkPortal, ComponentPortal, Portal, PortalModule} from '@angular/cdk/portal';
import {RouterModule} from '@angular/router';
import {CommonModule} from '@angular/common';


@Component({
  selector: 'example-portal',
  template: `
    <div class="demo-portal-outlet">
      <ng-template [cdkPortalOutlet]="selectedPortal"></ng-template>
    </div>
    
    <button (click)="selectedPortal=templatePortal"></button>
    <button (click)="selectedPortal=anotherTemplatePortal"></button>
    <button (click)="selectedPortal=componentPortal"></button>
    <ng-container *ngTemplateOutlet="greet;context: myContext"></ng-container>
    <ng-container [ngTemplateOutlet]="greet" [ngTemplateOutletContext]="myContext"></ng-container>
    
    <ng-template cdkPortal>
      <p>This is a template portal.</p>
    </ng-template>
    <p *cdkPortal>This is an another template portal.</p>
    <ng-template #greet let-name="name">
      <p>This is a ngTemplateOutlet. Hi, {{name}}</p>
    </ng-template>
  `,
  styles: [
    `
      .demo-portal-outlet {
          margin-bottom: 10px;
          padding: 10px;
          border: 1px dashed black;
          width: 500px;
          height: 100px;
      }
    `
  ]
})
export class ExamplePortal {
  @ViewChildren(CdkPortal, {read: CdkPortal}) templatePortals: QueryList<Portal<any>>;

  selectedPortal: Portal<any>;
  myContext = {name: 'lx1036'};

  get templatePortal() {
    return this.templatePortals.first;
  }

  get anotherTemplatePortal() {
    return this.templatePortals.last;
  }

  get componentPortal() {
    return new ComponentPortal(AComponent);
  }
}

@Component({
  template: `
    <p>This is a component portal.</p>
  `
})
export class AComponent {}




@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: ExamplePortal
      }
    ]),
  ],
  exports: [RouterModule]
})
export class ExamplePortalRoutingModule {
  constructor() {
  }
}

@NgModule({
  imports: [
    CommonModule,
    PortalModule,
    ExamplePortalRoutingModule,
  ],
  declarations: [
    ExamplePortal,
    AComponent,

  ],
  exports: [
    ExamplePortal
  ],
  entryComponents: [
    AComponent
  ]
})
export class ExamplePortalModule {}

// 1. ngTemplateOutlet
// 2. ngComponentOutlet