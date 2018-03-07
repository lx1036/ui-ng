import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatButton, MatButtonModule, MatCardModule, MatToolbarModule} from '@angular/material';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {RouterModule, Routes} from '@angular/router';
import {IndexComponent} from './index.component';


const childrenRoutes: Routes = [
  {path: 'checkbox', loadChildren: '../forms/checkbox/checkbox.component#ExampleCheckboxModule'},
  {path: 'code', loadChildren: '../code/code.module#ExampleCodeModule'},
  {path: 'custom_form_field_control', loadChildren: '../forms/custom-form-field/tel-input/tel-input.component#ExampleTelInputModule'},
  {path: 'tabs', loadChildren: '../layout/tabs/tabs.module#ExampleTabModule'},
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
  
    // Application
    IndexRoutingModule,
    
    MatCardModule,
    MatButtonModule,
    MatToolbarModule,
  ],
  declarations: [IndexComponent]
})
export class IndexModule {
  constructor() {
    console.log(this.constructor.name);
  }
}
