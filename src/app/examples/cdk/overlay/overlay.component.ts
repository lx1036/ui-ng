import {Component, NgModule, QueryList, ViewChild, ViewChildren, ViewContainerRef} from '@angular/core';
import {CdkOverlayOrigin, Overlay, OverlayConfig, OverlayModule} from '@angular/cdk/overlay';
import {CdkPortal, ComponentPortal, Portal, PortalModule} from '@angular/cdk/portal';
import {RouterModule} from '@angular/router';
import {tap, filter} from 'rxjs/operators';


@Component({
  selector: '[test-comp]',
  template: `
    <div><ng-content></ng-content></div>
    <p>test-comp</p>
  `
})
export class TestNgContentComponent {
  name = 'lx1036';
}


@Component({
  selector: 'app-overlay',
  template: `
    <button (click)="openAPanel()">button1</button>
    <button (click)="openBPanel()">button2</button>
    <button cdkOverlayOrigin (click)="openCPanel()">button3</button>
    <button cdkOverlayOrigin (click)="openDPanel()">button4</button>
    <button (click)="openPanelWithBackdrop()">Backdrop panel</button>
    <button (click)="openKeyboardTracking()">Keyboard tracking</button>
    
    <button test-comp #test>Normal</button>
    {{test.name}}
    
    <ng-template cdk-portal>
      <p>cdkPortal1</p>
    </ng-template>
    <ng-template cdkPortal>
      <p>cdkPortal2</p>
    </ng-template>
    <p *cdkPortal>cdkPortal3</p>
    <ng-template #cdkPortal4="cdkPortal" cdkPortal>
      <p>cdkPortal4</p>
    </ng-template>
  `
})
export class ExampleOverlay {
  @ViewChildren(CdkPortal, {read: CdkPortal}) templatePortals: QueryList<Portal<any>>;
  @ViewChild(CdkOverlayOrigin, {read: CdkOverlayOrigin}) _overlayOrigin: CdkOverlayOrigin;
  @ViewChild('cdkPortal4') cdkPortal4: CdkPortal;

  nextPosition = 100;

  constructor(private overlay: Overlay, private viewContainerRef: ViewContainerRef) {}

  openAPanel() {
    let config = new OverlayConfig();

    config.positionStrategy = this.overlay.position().global().left(`${this.nextPosition}px`).top(`${this.nextPosition}px`);
    this.nextPosition += 30;
    this.overlay.create(config).attach(new ComponentPortal(APanel, this.viewContainerRef));
  }

  openBPanel() {
    let config = new OverlayConfig();

    config.positionStrategy = this.overlay.position()
    .global()
    .centerVertically()
    .top(`${this.nextPosition}px`);

    this.nextPosition += 30;

    //console.log(typeof this.templatePortals.first, this.templatePortals.length);
    this.overlay.create(config).attach(this.templatePortals.first);
  }

  openCPanel() {
    let positionStrategy = this.overlay.position().connectedTo(
      this._overlayOrigin.elementRef,
      {originX: 'start', originY: 'bottom'},
      {overlayX: 'start', overlayY: 'top'}
    );

    this.overlay.create(new OverlayConfig({positionStrategy: positionStrategy}))
    .attach(new ComponentPortal(APanel, this.viewContainerRef));
  }

  openDPanel() {
    let positionStrategy = this.overlay.position().connectedTo(
      this._overlayOrigin.elementRef,
      {originX: 'start', originY: 'bottom'},
      {overlayX: 'start', overlayY: 'top'}
    );

    this.overlay.create(new OverlayConfig({positionStrategy: positionStrategy}))
    .attach(this.cdkPortal4);
  }

  openPanelWithBackdrop() {
    let overlayRef = this.overlay.create(new OverlayConfig({
      hasBackdrop: true,
      backdropClass: 'cdk-overlay-transparent-backdrop',
      positionStrategy: this.overlay.position().global().centerHorizontally().centerVertically()
    }));
    overlayRef.attach(this.templatePortals.last);
    overlayRef.backdropClick().subscribe(()=> {overlayRef.detach()});
  }

  openKeyboardTracking() {
    let overlayRef = this.overlay.create(new OverlayConfig({
      positionStrategy: this.overlay.position().global().centerVertically().centerHorizontally()
    }));

    let componentRef = overlayRef.attach(new ComponentPortal(KeyboardTrackingPanel, this.viewContainerRef));
    overlayRef.keydownEvents().pipe(
      tap(e => componentRef.instance.lastKeydown = e.key),
      filter(e => e.key === 'Escape')
    ).subscribe(() => overlayRef.detach());
  }
}

@Component({
  template: `
    <p>A Panel</p>
  `
})
export class APanel {}


/** Simple component to load into an overlay */
@Component({
  selector: 'keyboard-panel',
  template: '<div class="demo-keyboard">Last Keydown: {{ lastKeydown }}</div>'
})
export class KeyboardTrackingPanel {
  lastKeydown = '';
}

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: ExampleOverlay
      }
    ]),
  ],
  exports: [RouterModule]
})
export class ExampleOverlayRoutingModule {
  constructor() {
  }
}


@NgModule({
  imports: [
    ExampleOverlayRoutingModule,
    OverlayModule,
    PortalModule,
  ],
  declarations: [
    ExampleOverlay,
    APanel,
    KeyboardTrackingPanel,
    TestNgContentComponent
  ],
  exports: [
    ExampleOverlay
  ],
  entryComponents: [
    APanel,
    KeyboardTrackingPanel,
  ]
})
export class ExampleOverlayModule {}
