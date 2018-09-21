import {Component, ComponentRef, Directive, ElementRef, Input, OnInit, Renderer2, TemplateRef} from "@angular/core";

/**
 * @link https://ng-bootstrap.github.io/#/components/tooltip/examples
 * @link http://getbootstrap.com/docs/4.1/components/tooltips/
 */

export type Placement = 'auto' | 'top' | 'bottom' | 'left' | 'right' | 'top-left' | 'top-right' | 'bottom-left' |
  'bottom-right' | 'left-top' | 'left-bottom' | 'right-top' | 'right-bottom';


@Component({

})
export class NgTooltipWindow {

}


export class PopupService<T> {

  open(_ngTooltip: string | TemplateRef<any>) {
    return undefined;
  }
}

@Directive({
  selector: '[ngTooltip]',
  host: {
    '(hover)': 'handleHover()'
  }
})
export class NgTooltip implements OnInit {
  @Input() placement: Placement | Array<Placement>;

  private _popupService: PopupService<NgTooltipWindow>;
  _windowRef: ComponentRef<NgTooltipWindow>;
  _ngTooltip: string|TemplateRef<any>;
  @Input()
  set ngTooltip(value: string|TemplateRef<any>) {
    this._ngTooltip = value;

    if (! value && this._windowRef) {
      this.close();
    }
  }

  get ngTooltip() {
    return this._ngTooltip;
  }

  close() {

  }

  open() {
    if (this._ngTooltip) {
      this._windowRef = this._popupService.open(this._ngTooltip);
    }
  }

  constructor(private elementRef: ElementRef, private _renderer: Renderer2) {}

  ngOnInit() {
    // this._renderer.listen(this.elementRef)
  }


  handleHover() {
    this.open();
  }
}


@Component({
  selector: 'demo-bootstrap-tooltip',
  template: `
    <button type="button" class="btn btn-outline-secondary mr-2" placement="top" ngTooltip="Tooltip on top">
      Tooltip on top
    </button>
    <button type="button" class="btn btn-outline-secondary mr-2" placement="right" ngTooltip="Tooltip on right">
      Tooltip on right
    </button>
    <button type="button" class="btn btn-outline-secondary mr-2" placement="bottom" ngTooltip="Tooltip on bottom">
      Tooltip on bottom
    </button>
    <button type="button" class="btn btn-outline-secondary mr-2" placement="left" ngTooltip="Tooltip on left">
      Tooltip on left
    </button>
  `,
  styleUrls: ['./tooltip.scss']
})
export class DemoBootstrapTooltip {

}