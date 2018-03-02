import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {IndexComponent} from './index.component';


const childrenRoutes: Routes = [
  {path: 'tabs', loadChildren: '../layout/tabs/tabs.module#ExampleTabModule'},
  {path: 'code', loadChildren: '../code/code.module#ExampleCodeModule'},
];
const routes: Routes = [
  {path: '', component: IndexComponent, children: childrenRoutes},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IndexRoutingModule {}


@NgModule({
  imports: [
    // Angular
    CommonModule,
    
    // Application
    IndexRoutingModule,
  ],
  declarations: [IndexComponent]
})
export class IndexModule {
  constructor() {
    console.log(this.constructor.name);
  }
}
