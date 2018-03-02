import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule} from '@angular/router';
import {CodeModule} from '../../components/code/code.component';
import {ExampleCodeComponent} from './code.component';


@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: ExampleCodeComponent
      }
    ]),
  ],
  exports: [RouterModule]
})
export class ExampleCodeRoutingModule {
  constructor() {
    console.log(this.constructor.name);
  }
}


@NgModule({
  imports: [
    CommonModule,
    ExampleCodeRoutingModule,
    
    CodeModule,
  ],
  declarations: [
    ExampleCodeComponent,
  ]
})
export class ExampleCodeModule { }
