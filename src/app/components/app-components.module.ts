import {ModuleWithProviders, NgModule} from '@angular/core';
import { CodeComponent } from './code/code.component';


@NgModule({
  imports: [],
  declarations: [CodeComponent],
})
export class AppComponentsModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: AppComponentsModule,
      providers: [],
    }
  }
}