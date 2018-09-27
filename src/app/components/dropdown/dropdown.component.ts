import {Component, Directive, ElementRef, NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {DemoTabs, Tab, TabContent, TabSet, TabTitle} from "../tabset/tabs.component";






@Directive({
  selector: '[dropdownMenu]',
  host: {
    '[class.dropdown-menu]': 'true',
    // '[class.show]': 'dropdown.isOpen()'
  }
})
export class DropdownMenu {
  constructor(public elementRef: ElementRef) {}
}

@Directive({
  selector: '[dropdownAnchor]'
})
export class DropdownAnchor {

}

@Directive({
  selector: '[dropdownToggle]'
})
export class DropdownToggle {

}


@Directive({
  selector: '[dropdown]'
})
export class Dropdown {

  isOpen(): boolean {
    return true;
  }
}










@Component({
  selector: 'demo-bootstrap-dropdown',
  template: `
    <div class="dropdown">
      <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
        Dropdown button
      </button>
      <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
        <a class="dropdown-item" href="#">Action</a>
        <a class="dropdown-item" href="#">Another action</a>
        <a class="dropdown-item" href="#">Something else here</a>
      </div>
    </div>
  `,
  styleUrls: ['./dropdown.component.scss']
})
export class DemoBootstrapDropdown {

}



@NgModule({
  declarations: [
    DemoBootstrapDropdown,

    DropdownMenu,
    DropdownAnchor,
    DropdownToggle,
    Dropdown,
  ],
  imports: [
    CommonModule,
  ],
  exports: [
    DemoBootstrapDropdown,
  ]
})
export class DemoBootstrapDropdownModule {

}