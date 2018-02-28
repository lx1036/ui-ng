import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { AppComponent } from './app.component';
import {CheckboxModule} from './components/forms/checkbox/checkbox.module';
import {FormsModule} from '@angular/forms';
import { RadioComponent } from './components/forms/radio/radio.component';
import { CheckboxComponent } from './examples/forms/checkbox/checkbox.component';
import { TabsComponent } from './component/layout/tabs/tabs.component';
import { IndexComponent } from './examples/index/index.component';


@NgModule({
  declarations: [
    AppComponent,
    RadioComponent,
    CheckboxComponent,
    TabsComponent,
    IndexComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    CheckboxModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
