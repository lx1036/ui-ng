import {NgModule} from '@angular/core';
import {TabGroupModule} from '../../../components/layout/tabs/tabs.component';
import {CommonModule} from '@angular/common';
import {ExampleTabsComponent} from './tabs.component';


@NgModule({
  imports: [
    CommonModule,
    TabGroupModule,
  ],
  declarations: [ExampleTabsComponent]
})
export class ExampleTabModule {}
