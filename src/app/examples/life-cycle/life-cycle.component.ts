import {CommonModule} from '@angular/common';
import {
  AfterContentChecked, AfterContentInit, AfterViewChecked, AfterViewInit, Component, ContentChild, DoCheck, Injectable, Input, NgModule,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges, ViewChild
} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';

let nextId = 1;

@Injectable()
export class LoggerService {
  logs: string[] = [];
  prevMsg = '';
  prevMsgCount = 1;
  
  log(msg: string)  {
    if (msg === this.prevMsg) {
      // Repeat message; update last log entry with count.
      this.logs[this.logs.length - 1] = msg + ` (${this.prevMsgCount += 1}x)`;
    } else {
      // New message; log it.
      this.prevMsg = msg;
      this.prevMsgCount = 1;
      this.logs.push(msg);
    }
  }
  
  clear() { this.logs = []; }
  
  // schedules a view refresh to ensure display catches up
  tick() {  this.tick_then(() => { }); }
  tick_then(fn: () => any) { setTimeout(fn, 0); }
}

@Component({
  selector: 'most-life-cycle',
  template: `
    <p>{{name}}</p>
  `,
  styles: ['p {background: LightYellow; padding: 8px}']
})
export class MostLifeCycleComponent implements OnChanges, OnInit, DoCheck, AfterContentInit, AfterContentChecked, AfterViewInit, AfterViewChecked, OnDestroy {
  @Input() public name: string = 'Angular';
  private verb = 'initialized';
  
  constructor(private logger: LoggerService) {
    let is = this.name ? 'is' : 'is not';
    
    this.logIt(`name ${is} known at construction`);
  }
  
  logIt(msg: string) {
    this.logger.log(`#${nextId++} ${msg}`);
  }
  
  // only called for/if there is an @input variable set by parent.
  ngOnChanges(changes: SimpleChanges): void {
    let changesMsgs: string[] = [];
    
    for (let propName in changes) {
      if (propName === 'name') {
        let name = changes['name'].currentValue;
        changesMsgs.push(`name ${this.verb} to "${name}"`);
      } else {
        changesMsgs.push(propName + ' ' + this.verb);
      }
    }
    
    this.logIt(`OnChanges: ${changesMsgs.join('; ')}`);
    this.verb = 'changed'; // next time it will be a change
  }
  
  ngOnInit() {
    this.logIt(`OnInit`);
  }
  
  ngDoCheck(): void {
    this.logIt(`DoCheck`);
  }
  
  ngAfterContentInit(): void {
    this.logIt(`AfterContentInit`);
  }
  
  ngAfterContentChecked(): void {
    this.logIt(`AfterContentChecked`);
  }
  
  ngAfterViewInit(): void {
    this.logIt(`AfterViewInit`);
  }
  
  ngAfterViewChecked(): void {
    this.logIt(`AfterViewChecked`);
  }
  
  ngOnDestroy(): void {
    this.logIt(`OnDestroy`);
  }
}


@Component({
  selector: 'parent-most-life-cycle',
  template: `
    <div class="parent">
      <h2>Peek-A-Boo</h2>
  
      <button (click)="toggleChild()">{{hasChild ? 'Destroy' : 'Create'}} MostLifeCycleComponent</button>
      <button (click)="updateHero()" [hidden]="!hasChild">Update Hero</button>
  
      <h4>-- MostLifeCycleComponent --</h4>
      <most-life-cycle *ngIf="hasChild" [name]="heroName"></most-life-cycle>
  
      <h4>-- Lifecycle Hook Log --</h4>
      <div *ngFor="let msg of hookLog">{{msg}}</div>
    </div>
  
    
    
    <div>
      <h4>-- OnChangesComponent --</h4>
      <on-changes-parent></on-changes-parent>
    </div>

    <div>
      <h4>-- DoCheckComponent --</h4>
      <do-check-parent></do-check-parent>
    </div>

    <div>
      <h4>-- ContentComponent --</h4>
      <after-content-parent></after-content-parent>
    </div>

    <div>
      <h4>-- ViewComponent --</h4>
      <after-view-parent></after-view-parent>
    </div>
  `,
  styles: ['.parent {background: moccasin}'],
})
export class ParentMostLifeCycleComponent {
  
  hasChild = false;
  hookLog: string[];
  
  heroName = 'Windstorm';
  private logger: LoggerService;
  
  constructor(logger: LoggerService) {
    this.logger = logger;
    this.hookLog = logger.logs;
  }
  
  toggleChild() {
    this.hasChild = !this.hasChild;
    if (this.hasChild) {
      this.heroName = 'Windstorm';
      this.logger.clear(); // clear log on create
    }
    this.logger.tick();
  }
  
  updateHero() {
    this.heroName += '!';
    this.logger.tick();
  }
}


///////////////////////////OnChanges///////////////////////////
class Hero {
  constructor(public name: string) {}
}

@Component({
  selector: 'on-changes',
  template: `
  <div class="hero">
    <p>{{hero.name}} can {{power}}</p>

    <h4>-- Change Log --</h4>
    <div *ngFor="let chg of changeLog">{{chg}}</div>
  </div>
  `,
  styles: [
    '.hero {background: LightYellow; padding: 8px; margin-top: 8px}',
    'p {background: Yellow; padding: 8px; margin-top: 8px}'
  ]
})
export class OnChangesComponent implements OnChanges {
  @Input() hero: Hero;
  @Input() power: string;
  
  changeLog: string[] = [];
  
  ngOnChanges(changes: SimpleChanges) {
    for (let propName in changes) {
      let chng = changes[propName];
      this.changeLog.push(`${propName}: currentValue = ${JSON.stringify(chng.currentValue)}, previousValue = ${JSON.stringify(chng.previousValue)}`);
    }
  }
  
  reset() { this.changeLog = []; }
}

@Component({
  selector: 'on-changes-parent',
  template: `
    <div class="parent">
      <h2>{{title}}</h2>

      <table>
        <tr><td>Power: </td><td><input [(ngModel)]="power"></td></tr>
        <tr><td>Hero.name: </td><td><input [(ngModel)]="hero.name"></td></tr>
      </table>
      <p><button (click)="reset()">Reset Log</button></p>

      <on-changes [hero]="hero" [power]="power"></on-changes>
    </div>
  `,
  styles: ['.parent {background: Lavender;}']
})
export class OnChangesParentComponent {
  // hero.name发生改变，不会触发子组件change detection,
  // Angular only calls the hook when the value of the input property changes. The value of the hero property is the reference to the hero object.
  hero: Hero;
  power: string;
  title = 'OnChanges';
  @ViewChild(OnChangesComponent) childView: OnChangesComponent;
  
  constructor() {
    this.reset();
  }
  
  reset() {
    // new Hero object every time; triggers onChanges
    this.hero = new Hero('Windstorm');
    // setting power only triggers onChanges if this value is different
    this.power = 'sing';
    if (this.childView) { this.childView.reset(); }
  }
}
///////////////////////////OnChanges///////////////////////////


///////////////////////////DoCheck///////////////////////////
@Component({
  selector: 'do-check',
  template: `
  <div class="hero">
    <p>{{hero.name}} can {{power}}</p>

    <h4>-- Change Log --</h4>
    <div *ngFor="let chg of changeLog">{{chg}}</div>
  </div>
  `,
  styles: [
    '.hero {background: LightYellow; padding: 8px; margin-top: 8px}',
    'p {background: Yellow; padding: 8px; margin-top: 8px}'
  ]
})
export class DoCheckComponent implements DoCheck { // While the ngDoCheck() hook can detect when the hero's name has changed, it has a frightful cost.
  // DoCheck is called in every change detection cycle no matter if the change occurred.
  @Input() hero: Hero;
  @Input() power: string;
  
  changeDetected = false;
  changeLog: string[] = [];
  oldHeroName = '';
  oldPower = '';
  oldLogLength = 0;
  noChangeCount = 0;
  
  ngDoCheck() {
    if (this.hero.name !== this.oldHeroName) {
      this.changeDetected = true;
      this.changeLog.push(`DoCheck: Hero name changed to "${this.hero.name}" from "${this.oldHeroName}"`);
      this.oldHeroName = this.hero.name;
    }
    
    if (this.power !== this.oldPower) {
      this.changeDetected = true;
      this.changeLog.push(`DoCheck: Power changed to "${this.power}" from "${this.oldPower}"`);
      this.oldPower = this.power;
    }
    
    if (this.changeDetected) {
      this.noChangeCount = 0;
    } else {
      // log that hook was called when there was no relevant change.
      let count = this.noChangeCount += 1;
      let noChangeMsg = `DoCheck called ${count}x when no change to hero or power`;
      if (count === 1) {
        // add new "no change" message
        this.changeLog.push(noChangeMsg);
      } else {
        // update last "no change" message
        this.changeLog[this.changeLog.length - 1] = noChangeMsg;
      }
    }
    
    this.changeDetected = false;
  }
  
  reset() {
    this.changeDetected = true;
    this.changeLog = [];
  }
}

@Component({
  selector: 'do-check-parent',
  template: `
    <div class="parent">
      <h2>{{title}}</h2>

      <table>
        <tr><td>Power: </td><td><input [(ngModel)]="power"></td></tr>
        <tr><td>Hero.name: </td><td><input [(ngModel)]="hero.name"></td></tr>
      </table>
      <p><button (click)="reset()">Reset Log</button></p>

      <do-check [hero]="hero" [power]="power"></do-check>
    </div>
  `,
  styles: ['.parent {background: Lavender}']
})
export class DoCheckParentComponent {
  hero: Hero;
  power: string;
  title = 'DoCheck';
  @ViewChild(DoCheckComponent) childView: DoCheckComponent;
  
  constructor() { this.reset(); }
  
  reset() {
    this.hero = new Hero('Windstorm');
    this.power = 'sing';
    if (this.childView) { this.childView.reset(); }
  }
}
///////////////////////////DoCheck///////////////////////////


///////////////////////////AfterContentInit,AfterContentChecked///////////////////////////
@Component({
  selector: 'app-child',
  template: '<input [(ngModel)]="hero">'
})
export class ChildContentComponent {
  hero = 'Magneta';
}

@Component({
  selector: 'after-content',
  template: `
    <div>-- projected content begins --</div>
      <ng-content></ng-content>
    <div>-- projected content ends --</div>`
  + `
    <p *ngIf="comment" class="comment">
      {{comment}}
    </p>
  `
})
export class AfterContentComponent implements AfterContentInit, AfterContentChecked {
  private prevHero = '';
  comment = '';
  
  // Query for a CONTENT child of type `ChildComponent`
  @ContentChild(ChildContentComponent) contentChild: ChildContentComponent;
  
  constructor(private logger: LoggerService) {
    this.logIt('AfterContent constructor');
  }
  
  ngAfterContentInit() {
    // contentChild is set after the content has been initialized
    this.logIt('AfterContentInit');
    this.doSomething();
  }
  
  ngAfterContentChecked() {
    // contentChild is updated after the content has been checked
    if (this.prevHero === this.contentChild.hero) {
      this.logIt('AfterContentChecked (no change)');
    } else {
      this.prevHero = this.contentChild.hero;
      this.logIt('AfterContentChecked');
      this.doSomething();
    }
  }
  
  // This surrogate for real business logic sets the `comment`
  private doSomething() {
    this.comment = this.contentChild.hero.length > 10 ? `That's a long name` : '';
  }
  
  private logIt(method: string) {
    let child = this.contentChild;
    let message = `${method}: ${child ? child.hero : 'no'} child content`;
    this.logger.log(message);
  }
}

@Component({
  selector: 'after-content-parent',
  template: `
    <div class="parent">
      <h2>AfterContent</h2>
  
      <div *ngIf="show">
        <after-content>
          <app-child></app-child>
        </after-content>
      </div>
  
      <h4>-- AfterContent Logs --</h4>
      <p><button (click)="reset()">Reset</button></p>
      <div *ngFor="let msg of logger.logs">{{msg}}</div>
    </div>
  `,
  styles: ['.parent {background: burlywood}'],
})
export class AfterContentParentComponent {
  show = true;
  
  constructor(public logger: LoggerService) {
  }
  
  reset() {
    this.logger.clear();
    // quickly remove and reload AfterContentComponent which recreates it
    this.show = false;
    this.logger.tick_then(() => this.show = true);
  }
}
///////////////////////////AfterContentInit,AfterContentChecked///////////////////////////

///////////////////////////AfterViewInit,AfterViewChecked///////////////////////////
@Component({
  selector: 'app-child-view',
  template: '<input [(ngModel)]="hero">'
})
export class ChildViewComponent {
  hero = 'Magneta';
}

//////////////////////
@Component({
  selector: 'after-view',
  template: `
    <div>-- child view begins --</div>
      <app-child-view></app-child-view>
    <div>-- child view ends --</div>
  
    <p *ngIf="comment" class="comment">
      {{comment}}
    </p>
  `
})
export class AfterViewComponent implements  AfterViewChecked, AfterViewInit {
  private prevHero = '';
  
  // Query for a VIEW child of type `ChildViewComponent`
  @ViewChild(ChildViewComponent) viewChild: ChildViewComponent;
  
  constructor(private logger: LoggerService) {
    this.logIt('AfterView constructor');
  }
  
  ngAfterViewInit() {
    // viewChild is set after the view has been initialized
    this.logIt('AfterViewInit');
    this.doSomething();
  }
  
  ngAfterViewChecked() {
    // viewChild is updated after the view has been checked
    if (this.prevHero === this.viewChild.hero) {
      this.logIt('AfterViewChecked (no change)');
    } else {
      this.prevHero = this.viewChild.hero;
      this.logIt('AfterViewChecked');
      this.doSomething();
    }
  }
  
  comment = '';
  
  // This surrogate for real business logic sets the `comment`
  private doSomething() {
    let c = this.viewChild.hero.length > 10 ? `That's a long name` : '';
    if (c !== this.comment) {
      // Wait a tick because the component's view has already been checked
      this.logger.tick_then(() => this.comment = c);
    }
  }
  
  private logIt(method: string) {
    let child = this.viewChild;
    let message = `${method}: ${child ? child.hero : 'no'} child view`;
    this.logger.log(message);
  }
}

//////////////
@Component({
  selector: 'after-view-parent',
  template: `
  <div class="parent">
    <h2>AfterView</h2>

    <after-view *ngIf="show"></after-view>

    <h4>-- AfterView Logs --</h4>
    <p><button (click)="reset()">Reset</button></p>
    <div *ngFor="let msg of logger.logs">{{msg}}</div>
  </div>
  `,
  styles: ['.parent {background: burlywood}'],
})
export class AfterViewParentComponent {
  show = true;
  
  constructor(public logger: LoggerService) {
  }
  
  reset() {
    this.logger.clear();
    // quickly remove and reload AfterViewComponent which recreates it
    this.show = false;
    this.logger.tick_then(() => this.show = true);
  }
}
///////////////////////////AfterViewInit,AfterViewChecked///////////////////////////



@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: ParentMostLifeCycleComponent
      }
    ]),
  ],
  exports: [RouterModule]
})
export class ExampleLifeCycleRoutingModule {
  constructor() {
  }
}

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    
    ExampleLifeCycleRoutingModule,
  ],
  declarations: [
    MostLifeCycleComponent,
    ParentMostLifeCycleComponent,
  
    OnChangesComponent,
    OnChangesParentComponent,
  
    DoCheckComponent,
    DoCheckParentComponent,
  
    ChildContentComponent,
    AfterContentComponent,
    AfterContentParentComponent,
  
    ChildViewComponent,
    AfterViewComponent,
    AfterViewParentComponent,
  ],
  exports: [
    MostLifeCycleComponent,
  ],
  providers: [LoggerService]
})
export class LifeCycleModule {}
