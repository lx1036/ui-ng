import {Component, NgModule, OnInit} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ComponentsModule} from '../../components/components.module';
import {ExpressionChangedModule} from '../cd/expression-changed.component';
import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
import {MatToolbarModule} from '@angular/material/toolbar';
import {DemoButtonsModule} from '../packages/demo/button/button';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styles: []
})
export class IndexComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}


const childrenRoutes: Routes = [
  {path: 'button', loadChildren: '../button/button.component#ExampleButtonModule'},
  {path: 'checkbox', loadChildren: '../forms/checkbox/checkbox.component#ExampleCheckboxModule'},
  {path: 'code', loadChildren: '../code/code.module#ExampleCodeModule'},
  {path: 'dialog', loadChildren: '../dialog/dialog.component#DialogModule'},
  {path: 'tel_input', loadChildren: '../forms/custom-form-field/tel-input/tel-input.component#ExampleTelInputModule'},
  {path: 'file_input', loadChildren: '../forms/custom-form-field/file-input/file-input.component#ExampleFileInputModule'},
  {path: 'life_cycle', loadChildren: '../life-cycle/life-cycle.component#LifeCycleModule'},
  {path: 'tabs', loadChildren: '../layout/tabs/tabs.module#ExampleTabModule'},
  {path: 'cdk_portal', loadChildren: '../cdk/portal/portal.component#ExamplePortalModule'},
  {path: 'cdk_overlay', loadChildren: '../cdk/overlay/overlay.component#ExampleOverlayModule'},
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
    IndexRoutingModule,
    
    MatCardModule,
    MatButtonModule,
    MatToolbarModule,
    
    ExpressionChangedModule,
    
    ComponentsModule,

    DemoButtonsModule,
  ],
  declarations: [IndexComponent]
})
export class IndexModule {
  constructor() {}
}
