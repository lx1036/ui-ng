import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {IndexComponent} from './index.component';

const childrenRoutes: Routes = [
  {path: 'tabs', loadChildren: '../layout/tabs/tabs.module#ExampleTabModule'},
];

const routes: Routes = [
  {path: '', component: IndexComponent, children: childrenRoutes}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IndexRoutingModule {}
