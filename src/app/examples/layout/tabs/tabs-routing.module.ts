import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {ExampleTabsComponent} from './tabs.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: ExampleTabsComponent
      }
    ])
  ],
  exports: [RouterModule]
})
export class ExampleTabRoutingModule {}
