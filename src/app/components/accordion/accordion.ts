import {
  AfterContentChecked,
  Component,
  ContentChildren,
  Directive, Input,
  NgModule,
  QueryList,
  TemplateRef
} from "@angular/core";
import {CommonModule} from "@angular/common";


/**
 * @link https://mdbootstrap.com/angular/advanced/accordion/
 * @link http://ngx-bootstrap.com/#/modals
 *
 */


let nextId = 0;

@Directive({
  selector: 'ng-template[ngPanelTitle]'
})
export class NgPanelTitle {
  constructor(public templateRef: TemplateRef<any>) {}
}

@Directive({
  selector: 'ng-template[ngPanelContent]'
})
export class NgPanelContent {
  constructor(public templateRef: TemplateRef<any>) {}
}

@Directive({
  selector: 'ng-panel'
})
export class NgPanel implements AfterContentChecked {
  @ContentChildren(NgPanelTitle) titleTpls: QueryList<NgPanelTitle>;
  @ContentChildren(NgPanelContent) contentTpls: QueryList<NgPanelContent>;

  @Input() id = `ng-panel-${nextId++}`;
  titleTpl;
  contentTpl;
  isOpen = false;

  @Input() title;

  ngAfterContentChecked() {
    this.titleTpl = this.titleTpls.first;
    this.contentTpl = this.contentTpls.first;
  }
}


/**
 * 1. Open a panel at one time
 */
@Component({
  selector: 'ng-accordion',
  template: `
    <div *ngFor="let panel of panels" class="card">
      <div role="tab" class="card-header">
        <h5 class="mb-0">
          <button class="btn btn-link" (click)="toggle(panel.id)">
            {{panel.title}}<ng-template [ngTemplateOutlet]="panel.titleTpl?.templateRef"></ng-template>
          </button>
        </h5>
      </div>
      <div role="tabpanel" [id]="panel.id" [class.show]="panel.isOpen" *ngIf="panel.isOpen">
        <div class="card-body">
          <ng-template [ngTemplateOutlet]="panel.contentTpl?.templateRef"></ng-template>
        </div>
      </div>
    </div>
  `,
  host: {
    'class': 'accordion',
    'role': 'tablist'
  },
  styleUrls: ['./accordion.scss']
})
export class NgAccordion implements AfterContentChecked {
  @ContentChildren(NgPanel) panels: QueryList<NgPanel>;

  @Input() activeIds: string|string[];
  @Input('closeOthers') closeOtherPanels = false;

  constructor() {

  }

  toggle(id: string) {
    let panel = this.panels.find(item => item.id === id);

    if (panel) {
      if (this.closeOtherPanels) {
        this.closeOthers(panel.id);
      }

      this.toggleCurrentPanel(panel.id);
  
      this.updateActiveIds();
    }
  }

  updateActiveIds() {
    this.activeIds = this.panels.filter(panel => panel.isOpen).map(panel => panel.id);
  }

  toggleCurrentPanel(id) {
    this.panels.forEach(panel => {
      if (panel.id === id) {
        panel.isOpen = ! panel.isOpen;
      }
    });
  }

  closeOthers(id) {
    this.panels.forEach(panel => {
      if (panel.id !== id) {
        panel.isOpen = false;
      }
    });
  }

  ngAfterContentChecked() {
    if (typeof this.activeIds === 'string') {
      this.activeIds = this.activeIds.split(',');
    }

    console.log(this.activeIds);

    if (this.activeIds) {
      this.panels.forEach(panel => panel.isOpen = this.activeIds.indexOf(panel.id) > -1);
    }
  }
}




@Component({
  selector: 'demo-bootstrap-accordion',
  template: `
    <ng-accordion activeIds="static-2,static-1">
      <ng-panel id="static-1" title="Simple">
        <ng-template ngPanelContent>
          Panel1
        </ng-template>
      </ng-panel>
      <ng-panel id="static-2">
        <ng-template ngPanelTitle>
          <span>&#9733; <b>Fancy</b> title &#9733;</span>
        </ng-template>
        <ng-template ngPanelContent>
          Panel2
        </ng-template>
      </ng-panel>
      <ng-panel title="Disabled" id="static-3">
        <ng-template ngPanelContent>
          Panel3
        </ng-template>
      </ng-panel>
    </ng-accordion>
  `
})
export class DemoBootstrapAccordion {
  
}



@NgModule({
  imports: [
    CommonModule,
  ],
  declarations: [
    DemoBootstrapAccordion,
    NgAccordion,
    NgPanel,
    NgPanelContent,
    NgPanelTitle,
  ],
  exports: [
    DemoBootstrapAccordion
  ]
})
export class DemoBootstrapAccordionModule {
  
}

