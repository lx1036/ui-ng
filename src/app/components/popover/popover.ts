import {Component, Input, NgModule, TemplateRef} from "@angular/core";
import {CommonModule} from "@angular/common";




@Component({
  selector: 'ng-popover',
  template: `
  
  `
})
export class NgPopover {
  @Input() ngPopover;
  @Input() placement: 'top'|'right'|'bottom'|'left';
  @Input() popoverTitle: string|TemplateRef<any>;
}



@Component({
  selector: 'demo-bootstrap-popover',
  template: `
    <button type="button" class="btn btn-outline-secondary mr-2" placement="top"
            ngPopover="Vivamus sagittis lacus vel augue laoreet rutrum faucibus." popoverTitle="Popover on top">
      Popover on top
    </button>

    <button type="button" class="btn btn-outline-secondary mr-2" placement="right"
            ngPopover="Vivamus sagittis lacus vel augue laoreet rutrum faucibus." popoverTitle="Popover on right">
      Popover on right
    </button>

    <button type="button" class="btn btn-outline-secondary mr-2" placement="bottom"
            ngPopover="Vivamus sagittis lacus vel augue laoreet rutrum faucibus." popoverTitle="Popover on bottom">
      Popover on bottom
    </button>

    <button type="button" class="btn btn-outline-secondary mr-2" placement="left"
            ngPopover="Vivamus sagittis lacus vel augue laoreet rutrum faucibus." popoverTitle="Popover on left">
      Popover on left
    </button>

    <ng-template #popContent>Hello, <b>{{name}}</b>!</ng-template>
    <ng-template #popTitle>Fancy <b>content!!</b></ng-template>
    <button type="button" class="btn btn-outline-secondary" [ngbPopover]="popContent" [popoverTitle]="popTitle">
      I've got markup and bindings in my popover!
    </button>
  `
})
export class DemoBootstrapPopover {
  name = 'world';
}



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
  ],
  exports: [],
})
export class DemoBootstrapPopoverModule {

}
