import {
  AfterContentInit, AfterViewInit, Component, ContentChildren, ElementRef, EventEmitter, forwardRef, Inject, Input, NgModule, OnInit,
  Output, QueryList, Renderer2,
  TemplateRef,
  ViewChild
} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ShareModule, TemplateDirective} from '../common/share';

@Component({
  selector: 'ui-tab-nav',
  template: `
    <ul class="app-tab-nav">
      <li *ngFor="let tab of tabs; let i = index;">
        <span (click)="click(i, tab.disabled)">
          <ng-container *ngIf="tab.headerTpl;else h">
            <ui-template [template]="tab.headerTpl"></ui-template>
          </ng-container>
          <ng-template #h>{{tab.header}}</ng-template>
        </span>
      </li>
    </ul>
  `
})
export class TabNavComponent {
  @Input() tabs: TabComponent[];
  @Output() tabClick = new EventEmitter();
  
  click(index: number, disabled: boolean) {
    if (!disabled) {
      this.tabClick.emit(index);
    }
  }
}


@Component({
  selector: 'ui-tab',
  template: `
    <div [ngClass]="tabClass"
         [class.active]="selected"
         [class.isScroll]="maxHeight"
         [style.max-height]="maxHeight">
      <div class="ui-tab-wrapper">
        <ng-content></ng-content>
      </div>
    </div>
  `
})
export class TabComponent implements AfterViewInit {
  @Input() header: string;
  @Input() disabled: boolean;
  @Input() maxHeight: number;
  
  headerTpl: TemplateRef<any>;
  @ContentChildren(TemplateDirective) templates: QueryList<TemplateDirective>;

  constructor(@Inject(forwardRef(()=>TabGroupComponent)) private tabsGroup) {}

  _selected: boolean;
  @Input()
  set selected(value: boolean) {
    this._selected = value;

    this.toggleClass();
  }
  get selected() {
    return this._selected;
  }
  
  ngAfterViewInit(): void {
    this.templates.toArray().forEach((template: TemplateDirective) => {
      if ('header' === template.getType()) {
        this.headerTpl = template.template;
      }
    });
    
    this.tabsGroup.addTab(this);
  }

  tabClass: any;
  toggleClass() {
    this.tabClass = {
      'ui-tab': true,
      'active': this._selected,
    };
  }
  
  setActive(active: boolean) {
    this.selected = active;
  }
}

@Component({
  selector: 'ui-tab-group',
  template: `
    <div class="ui-tab-group" [class.ui-tab-vertical]="vertical" #group>
      <ui-tab-nav [tabs]="tabs" (tabClick)="tabClick(index)"></ui-tab-nav>
      <div class="ui-tab-box">
        <ng-content></ng-content>
      </div>
    </div>
  `,
  styleUrls: ['./tabs.component.scss']
})
export class TabGroupComponent implements AfterContentInit {
  @Input() direction: string;
  @ViewChild('group') group: ElementRef;
  @Input() vertical: boolean;

  tabs: TabComponent[] = [];
  activeIndex: number = 0;

  constructor(private render2: Renderer2) {
  }

  ngAfterContentInit(): void {
    if (this.direction) {
      this.render2.addClass(this.group.nativeElement, 'app-tab-group-' + this.direction);
    }
  }
  
  tabClick(index: number) {
    this.open(index);
  }
  
  open(index: number) {
    this.activeIndex = index;
    
    this.tabs.forEach((tab: TabComponent, index: number) => {
      tab.setActive(false);

      if (index === this.activeIndex) {
        tab.setActive(true);
      }
    });
  }
  
  addTab(tab: TabComponent) {
    this.tabs.push(tab);
  }
}

@NgModule({
  imports: [
    CommonModule,
    ShareModule,
  ],
  declarations: [
    TabComponent,
    TabNavComponent,
    TabGroupComponent,
  ],
  exports: [
    TabComponent,
    TabNavComponent,
    TabGroupComponent,
  ]
})
export class TabGroupModule {}
