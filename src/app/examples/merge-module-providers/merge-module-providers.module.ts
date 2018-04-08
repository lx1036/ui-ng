import {Component, Injectable, NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';

@Injectable()
export class AService {
  log() {
  }
}

@Injectable()
export class BService {

}

@Component({
  selector: 'merge-module-providers',
  template: `
    <p>merge-module-providers</p>
  `
})
export class AComponent {
  constructor(private aService: AService, private bService: BService) {
    aService.log();
  }
}


@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [],
  providers: [AService],
})
export class MergeModuleProvidersModule { }

@NgModule({
  imports: [
    CommonModule,
    
    MergeModuleProvidersModule,
  ],
  declarations: [
    AComponent,
  ],
  providers: [BService],
  exports: [
    AComponent,
  ]
})
export class NewMergeModuleProvidersModule { }