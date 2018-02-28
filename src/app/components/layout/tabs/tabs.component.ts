import {AfterContentInit, Component, ElementRef, EventEmitter, Input, NgModule, OnInit, Output, Renderer2, ViewChild} from '@angular/core';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-tab-nav',
  template: `
    <ul class="app-tab-nav">
      <li *ngFor="let tab of tabs; ">
        <span (click)="click(index, tab.disabled)">
          <ng-container *ngIf="tab.headerTpl;else h">
            
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
  selector: 'app-tab',
  template: `
    <div [ngClass]="tabClass" [class.active]="selected" [class.isScroll]="maxHeight" [style.max-height]="maxHeight">
      <div class="app-tab-wrapper">
        <ng-content></ng-content>
      </div>
    </div>
  `,
  styleUrls: ['./tabs.component.css']
})
export class TabComponent implements OnInit {
  @Input() header: string;
  @Input() disabled: boolean;
  headerTpl: any;

  constructor() { }

  ngOnInit() {
  }

  _selected: boolean;
  @Input()
  set selected(value: boolean) {
    this._selected = value;

    this.toggleClass();
  }
  get selected() {
    return this._selected;
  }

  tabClass: any;
  toggleClass() {
    this.tabClass = {
      'active': this._selected,
    };
  }
}

@Component({
  selector: 'app-tab-group',
  template: `
    <div class="app-tab-group" [class.app-tab-vertical]="vertical" #group>
      <app-tab-nav [tabs]="tabs" (click)="click()"></app-tab-nav>
      <div class="app-tab-box">
        <ng-content></ng-content>
      </div>
    </div>
  `
})
export class TabGroupComponent implements AfterContentInit {
  @Input() direction: string;
  @ViewChild('group') group: ElementRef;

  tabs: TabComponent[] = [];
  vertical: any;

  constructor(private render2: Renderer2) {

  }


  ngAfterContentInit(): void {
    if (this.direction) {
      this.render2.addClass(this.group.nativeElement, 'app-tab-group-' + this.direction);
    }
  }

  click() {

  }
}

NgModule({
  imports: [CommonModule],
  declarations: [TabComponent, TabNavComponent, TabGroupComponent],
  exports: [TabComponent, TabNavComponent, TabGroupComponent]
})
export class TabGroupModule {}
