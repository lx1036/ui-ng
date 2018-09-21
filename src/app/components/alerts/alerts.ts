import {Component, ElementRef, Input, NgModule, OnChanges, OnInit, Renderer2, SimpleChanges} from "@angular/core";
import {CommonModule} from "@angular/common";


/**
 * @link https://ng-bootstrap.github.io/#/components/alert/examples
 * @link http://getbootstrap.com/docs/4.1/components/alerts/
 */

@Component({
  selector: 'ng-alert',
  template: `
    <ng-content></ng-content>
  `,
  host: {
    'role': 'alert',
    'class': 'alert',
    '[class.alert-dismissible]': 'dismissible'
  },
  styles: [
    `
      :host {
        display: block;
      }
    `
  ]
})
export class NgAlert implements OnChanges, OnInit {
  @Input() dismissible: boolean;
  @Input() type: string;

  constructor(private _renderer: Renderer2, private _elementRef: ElementRef) {
    this.type = 'warning';
  }

  ngOnInit() {
    this._renderer.addClass(this._elementRef.nativeElement, `alert-${this.type}`);
  }

  ngOnChanges(changes: SimpleChanges) {
    const type = changes['type'];

    console.log(type);


    if (type) {
      console.log(type);

      this._renderer.removeClass(this._elementRef.nativeElement, `alert-${type.previousValue}`);
      this._renderer.addClass(this._elementRef.nativeElement, `alert-${type.currentValue}`);
    }
  }
}


@Component({
  selector: 'demo-bootstrap-alerts',
  template: `
    <div>
      <p>
        <ng-alert [dismissible]="false">
          <strong>Warning!</strong> Better check yourself, you're not looking too good.
        </ng-alert>
      </p>
    </div>
    
    <div class="alert alert-primary" role="alert">
      A simple primary alert—check it out!
    </div>
    <div class="alert alert-secondary" role="alert">
      A simple secondary alert—check it out!
    </div>
    <div class="alert alert-success" role="alert">
      A simple success alert—check it out!
    </div>
    <div class="alert alert-danger" role="alert">
      A simple danger alert—check it out!
    </div>
    <div class="alert alert-warning" role="alert">
      A simple warning alert—check it out!
    </div>
    <div class="alert alert-info" role="alert">
      A simple info alert—check it out!
    </div>
    <div class="alert alert-light" role="alert">
      A simple light alert—check it out!
    </div>
    <div class="alert alert-dark" role="alert">
      A simple dark alert—check it out!
    </div>

    <div class="alert alert-primary" role="alert">
      A simple primary alert with <a href="#" class="alert-link">an example link</a>. Give it a click if you like.
    </div>
    <div class="alert alert-secondary" role="alert">
      A simple secondary alert with <a href="#" class="alert-link">an example link</a>. Give it a click if you like.
    </div>
    <div class="alert alert-success" role="alert">
      A simple success alert with <a href="#" class="alert-link">an example link</a>. Give it a click if you like.
    </div>
    <div class="alert alert-danger" role="alert">
      A simple danger alert with <a href="#" class="alert-link">an example link</a>. Give it a click if you like.
    </div>
    <div class="alert alert-warning" role="alert">
      A simple warning alert with <a href="#" class="alert-link">an example link</a>. Give it a click if you like.
    </div>
    <div class="alert alert-info" role="alert">
      A simple info alert with <a href="#" class="alert-link">an example link</a>. Give it a click if you like.
    </div>
    <div class="alert alert-light" role="alert">
      A simple light alert with <a href="#" class="alert-link">an example link</a>. Give it a click if you like.
    </div>
    <div class="alert alert-dark" role="alert">
      A simple dark alert with <a href="#" class="alert-link">an example link</a>. Give it a click if you like.
    </div>

    <div class="alert alert-success" role="alert">
      <h4 class="alert-heading">Well done!</h4>
      <p>Aww yeah, you successfully read this important alert message. This example text is going to run a bit longer so that you can see how spacing within an alert works with this kind of content.</p>
      <hr>
      <p class="mb-0">Whenever you need to, be sure to use margin utilities to keep things nice and tidy.</p>
    </div>

    <div class="alert alert-warning alert-dismissible fade show" role="alert">
      <strong>Holy guacamole!</strong> You should check in on some of those fields below.
      <button type="button" class="close" data-dismiss="alert" aria-label="Close">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
  `,
  styleUrls: ['./alerts.scss']
})
export class DemoBootstrapAlerts {

}




@NgModule({
  imports: [
    CommonModule,
  ],
  declarations: [
    DemoBootstrapAlerts,

    NgAlert,
  ],
  exports: [
    DemoBootstrapAlerts
  ]
})
export class DemoBootstrapAlertsModule {

}