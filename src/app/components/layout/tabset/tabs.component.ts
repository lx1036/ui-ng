import {
  AfterContentChecked,
  Component,
  ContentChild,
  ContentChildren,
  Directive,
  Input,
  NgModule,
  QueryList,
  TemplateRef
} from "@angular/core";
import {CommonModule} from "@angular/common";


@Component({
  selector: 'demo-tabs',
  template: `
    <ui-tabset>
      <ui-tab>
        <ng-template uiTabTitle><p>Title1</p></ng-template>
        <ng-template uiTabContent><p>Content1</p></ng-template>
      </ui-tab>

      <ui-tab>
        <ng-template uiTabTitle><p>Title2</p></ng-template>
        <ng-template uiTabContent><p>Content2</p></ng-template>
      </ui-tab>

      <ui-tab>
        <ng-template uiTabTitle><p>Title3</p></ng-template>
        <ng-template uiTabContent><p>Content3</p></ng-template>
      </ui-tab>
    </ui-tabset>
    
    {{test}}
    <button (click)="test2()">test2xx</button>
  `
})
export class DemoTabs {
  @Input() test = 'a';

  test2() {
    this.test = 'b';
  }
}


let nextId = 0;

@Directive({
  selector: 'ng-template[uiTabTitle]'
})
export class TabTitle {
  constructor(public templateRef: TemplateRef<any>) {}
}

@Directive({
  selector: 'ng-template[uiTabContent]'
})
export class TabContent {
  constructor(public templateRef: TemplateRef<any>) {}
}

@Directive({
  selector: 'ui-tab',
})
export class Tab implements AfterContentChecked {
  @ContentChildren(TabTitle, {descendants: false}) titleTpls: QueryList<TabTitle>;
  @ContentChildren(TabContent, {descendants: false}) contentTpls: QueryList<TabContent>;

  titleTpl;
  contentTpl;

  id = `tab-${nextId++}`;

  ngAfterContentChecked() {
    this.titleTpl = this.titleTpls.first;
    this.contentTpl = this.contentTpls.first;
  }
}

@Component({
  selector: 'ui-tabset',
  template: `
    {{activeId}}
    {{active}}
    <div (click)="test()">test</div>
    <ul [class]="'nav'">
      <li class="nav-item" *ngFor="let tab of tabs">
        <a [id]="tab.id" 
           class="nav-link {{tab.id === activeId ? 'active' : null}}" 
           (click)="!!select(tab.id)">
          <ng-template [ngTemplateOutlet]="tab.titleTpl?.templateRef"></ng-template>
        </a>
      </li>
    </ul>
    <div class="tab-content">
      <div>{{activeId}}</div>
      <ng-template ngFor let-tab [ngForOf]="tabs">
        <div id="panel-{{tab.id}}" 
             class="tab-pane {{tab.id === activeId ? 'active' : null}}" 
             role="tabpanel"
             *ngIf="tab.id === activeId">
          <ng-template [ngTemplateOutlet]="tab.contentTpl?.templateRef"></ng-template>
        </div>
      </ng-template>
    </div>
  `
})
export class TabSet implements AfterContentChecked {
  public activeId: string;
  @ContentChildren(Tab) tabs: QueryList<Tab>;

  public active = 'a';

  ngAfterContentChecked() {
    this.activeId = this.tabs.length ? this.tabs.first.id : null;
  }

  test() {
    console.log('test');
    this.activeId = 'tab-1asdfasdf0';
    this.active = 'b';
  }

  select(id) {
    if (this.activeId !== id) {
      console.log(id);
      this.activeId = id;
    }
  }
}






@NgModule({
  declarations: [
    DemoTabs,

    TabSet,
    Tab,
    TabTitle,
    TabContent,
  ],
  imports: [
    CommonModule,
  ],
  exports: [
    DemoTabs,
  ]
})
export class TabsModule {

}