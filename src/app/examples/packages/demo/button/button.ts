
/**
 * https://ithelp.ithome.com.tw/articles/10193055
 *
 * Button Types: mat-button;
 */

import {Component, NgModule} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';

@Component({
  selector: 'demo-button',
  template: `
    <h1>Angular Material Buttons</h1>
    <button mat-button>MatButton</button>
    <button mat-button color="warn">MatButton</button>
    <button mat-button disabled>MatButton</button>
  `
})
export class DemoButtons {

}


@NgModule({
  imports: [
    MatButtonModule,
  ],
  declarations: [
    DemoButtons,
  ],
  exports: [
    DemoButtons,
  ]
})
export class DemoButtonsModule {}