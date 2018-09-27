import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {CommonModule} from '@angular/common';
import {CodeModule} from '../../../components/code/code.component';
import {ShareModule} from '../../../components/common/share';
import {TabGroupModule} from '../../../components/tabs/tabs.component';
import {ExampleTabsComponent} from './tabs.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: ExampleTabsComponent
      }
    ]),
  ],
  exports: [RouterModule]
})
export class ExampleTabRoutingModule {
  constructor() {
  }
}

@NgModule({
  imports: [
    CommonModule,
    ExampleTabRoutingModule,
    
    TabGroupModule,
    CodeModule,
    ShareModule,
  ],
  declarations: [ExampleTabsComponent]
})
export class ExampleTabModule {
  constructor() {
  }
}
