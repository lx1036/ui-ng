import {CommonModule} from '@angular/common';
import {ModuleWithProviders, NgModule} from '@angular/core';
import {ButtonModule} from './button/button.directive';
import { CodeComponent } from './code/code.component';
import {ShareModule} from './common/share';
import {RadioComponent} from './forms/radio/radio.component';
import { UploadComponent } from './forms/upload/upload/upload.component';


@NgModule({
  imports: [
    CommonModule,
    ShareModule,
    
    ButtonModule,
  ],
  declarations: [RadioComponent, UploadComponent],
  exports: [
    ButtonModule
  ]
})
export class ComponentsModule {}
