import {Component, Directive, ElementRef, forwardRef, Inject, Injectable, Input, NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";


@Injectable({providedIn: 'root'})
export class AService {

}





/**
 * Basic buttons:
 * @link https://v4.bootcss.com/docs/4.0/components/buttons/
 *
 * Interactive Buttons:
 * Checkbox and radio buttons
 */


/** Coerces a data-bound value (typically a string) to a boolean. */
export function coerceBooleanProperty(value: any): boolean {
  return value != null && `${value}` !== 'false';
}

@Directive({
  selector: 'input[type=checkbox][ng-button]',
  host: {
    '(change)': 'onInputChange($event.target.checked)',
    '(focus)': 'focused = true',
    '(blur)': 'focused = false',
    '[disabled]': '_disabled'
  }
})
export class NgButton {
  checked;

  set focused(focused: boolean) {
    this._ngButtonLabel.focused = focused;
  }

  _disabled;

  @Input()
  set disabled(disabled) {
    this._disabled = coerceBooleanProperty(disabled);
    console.log(this._disabled, disabled);
    this._ngButtonLabel.disabled = this._disabled;
  }

  constructor(@Inject(forwardRef(() => NgButtonLabel)) private _ngButtonLabel: NgButtonLabel) {}

  onInputChange(checked: boolean) {
    this.checked = checked;

    this._ngButtonLabel.active = this.checked;

    console.log(this._ngButtonLabel.elementRef.nativeElement);
  }
}


@Directive({
  selector: '[ng-button-label]',
  host: {
    '[class.disabled]': 'disabled',
    '[class.active]': 'active',
    '[class.focused]': 'focused',
  }
})
export class NgButtonLabel {
  disabled;
  active;
  focused;

  constructor(public elementRef: ElementRef) {}
}


/**
 * The .btn classes are designed to be used with the <button> element.
 * However, you can also use these classes on <a> or <input> elements (though some browsers may apply a slightly different rendering).
 */
@Component({
  selector: 'demo-bootstrap-buttons',
  template: `
    <h2>Basic Buttons</h2>
    <button type="button" class="btn btn-primary focus">Primary</button>
    <button type="button" class="btn btn-secondary">Secondary</button>
    <button type="button" class="btn btn-success">Success</button>
    <button type="button" class="btn btn-danger">Danger</button>
    <button type="button" class="btn btn-warning">Warning</button>
    <button type="button" class="btn btn-info">Info</button>
    <button type="button" class="btn btn-light">Light</button>
    <button type="button" class="btn btn-dark">Dark</button>
    <button type="button" class="btn btn-link">Link</button>

    <h2>Button Tags</h2>
    <a class="btn btn-primary" href="#" role="button">Link</a>
    <button class="btn btn-primary" type="submit">Button</button>
    <input class="btn btn-primary" type="button" value="Input">
    <input class="btn btn-primary" type="submit" value="Submit">
    <input class="btn btn-primary" type="reset" value="Reset">
    
    <h2>Outline Buttons</h2>
    <button type="button" class="btn btn-outline-primary">Primary</button>
    <button type="button" class="btn btn-outline-secondary">Secondary</button>
    <button type="button" class="btn btn-outline-success">Success</button>
    <button type="button" class="btn btn-outline-danger">Danger</button>
    <button type="button" class="btn btn-outline-warning">Warning</button>
    <button type="button" class="btn btn-outline-info">Info</button>
    <button type="button" class="btn btn-outline-light">Light</button>
    <button type="button" class="btn btn-outline-dark">Dark</button>

    <h2>Sizes</h2>
    <button type="button" class="btn btn-primary btn-lg">Large button</button>
    <button type="button" class="btn btn-secondary btn-lg">Large button</button>
    <button type="button" class="btn btn-primary btn-sm">Small button</button>
    <button type="button" class="btn btn-secondary btn-sm">Small button</button>
    <button type="button" class="btn btn-primary btn-lg btn-block">Block level button</button>
    <button type="button" class="btn btn-secondary btn-lg btn-block">Block level button</button>
    
    <h2>Active/Disable State</h2>
    <a href="#" class="btn btn-primary btn-lg active" role="button" aria-pressed="true">Primary link</a>
    <a href="#" class="btn btn-secondary btn-lg active" role="button" aria-pressed="true">Link</a>
    <button type="button" class="btn btn-lg btn-primary" disabled>Primary button</button>
    <button type="button" class="btn btn-secondary btn-lg" disabled>Button</button>
    <a href="#" class="btn btn-primary btn-lg disabled" role="button" aria-disabled="true">Primary link</a>
    <a href="#" class="btn btn-secondary btn-lg disabled" role="button" aria-disabled="true">Link</a>
    
    <h2>Toggle States</h2>
    <button type="button" class="btn btn-primary" data-toggle="button" aria-pressed="false" autocomplete="off">
      Single toggle
    </button>
    
    <h2>Checkbox and Radio Buttons</h2>
    <div class="btn-group-toggle" data-toggle="buttons">
      <label class="btn btn-secondary active">
        <input type="checkbox" checked autocomplete="off"> Checked
      </label>
    </div>
    
    <h3>Angular Checkbox</h3>
    <div class="btn-group btn-group-toggle">
      <label class="btn btn-primary" ng-button-label>
        <input type="checkbox" ng-button disabled [(ngModel)]="checkbox.left"> Left (pre-checked)
      </label>
      <label class="btn btn-primary" ng-button-label>
        <input type="checkbox" ng-button [disabled]="false" [(ngModel)]="checkbox.middle"> Middle
      </label>
      <label class="btn btn-primary" ng-button-label>
        <input type="checkbox" ng-button [(ngModel)]="checkbox.right"> Right
      </label>
    </div>
    <pre>{{model | json}}</pre>
    

    <div class="btn-group btn-group-toggle" data-toggle="buttons">
      <label class="btn btn-secondary active">
        <input type="radio" name="options" id="option1" autocomplete="off" checked> Active
      </label>
      <label class="btn btn-secondary">
        <input type="radio" name="options" id="option2" autocomplete="off"> Radio
      </label>
      <label class="btn btn-secondary">
        <input type="radio" name="options" id="option3" autocomplete="off"> Radio
      </label>
    </div>
  `,
  styleUrls: ['./button.scss']
})
export class BasicButtons {
  checkbox = {
    left: false,
    middle: true,
    right: false,
  };
}


@NgModule({
  declarations: [
    BasicButtons,
    NgButton,
    NgButtonLabel,
  ],
  imports: [
    CommonModule,
    FormsModule,
  ],
  exports: [
    BasicButtons,
  ],
})
export class DemoBootstrapButtonsModule {

}