import {Component, NgModule, OnInit} from '@angular/core';
import {RouterModule} from '@angular/router';
import {ButtonModule} from '../../components/button/button.directive';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.css']
})
export class ExampleButtonComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}

@NgModule({
  imports: [
    RouterModule.forChild([
      {path: '', component: ExampleButtonComponent}
    ])
  ],
  exports: [RouterModule]
})
export class ExampleButtonRoutingModule {}

@NgModule({
  imports: [
    ExampleButtonRoutingModule,
    ButtonModule,
  ],
  declarations: [
    ExampleButtonComponent
  ]
})
export class ExampleButtonModule {}
