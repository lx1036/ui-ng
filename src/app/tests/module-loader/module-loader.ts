

import {
  Component,
  Injector, NgModule,
  NgModuleFactoryLoader,
  SystemJsNgModuleLoader,
  ViewContainerRef
} from '@angular/core';
import {BrowserModule} from "@angular/platform-browser";
import {CommonModule} from "@angular/common";


@Component({
  selector: 'demo-module-loader',
  template: `
    <p>
      Start editing to see some magic happen :)
    </p>
    <button (click)="loadComponent()">Load element</button>
  `,
  styleUrls: [],
  providers: []
})
export class DemoModuleLoader  {
  constructor(
    private readonly loader: NgModuleFactoryLoader,
    private readonly injector: Injector,
    private readonly vcr: ViewContainerRef,
  ) {}

  loadComponent() {
    this.loader.load('src/app/tests/module-loader/hero.module#HeroModule')
      .then(factory => {
        const moduleRef = factory.create(this.injector);
        const anyComponentType = moduleRef.injector.get('ProvidedBitkanHero');
        const componentFactory = moduleRef.componentFactoryResolver.resolveComponentFactory(anyComponentType);
        this.vcr.createComponent(componentFactory);
      });
  }
}

@NgModule({
  imports: [
    CommonModule,
  ],
  declarations: [
    DemoModuleLoader
  ],
  bootstrap: [
  ],
  providers: [
    {
      provide: NgModuleFactoryLoader,
      useClass: SystemJsNgModuleLoader
    }
  ],
  exports: [
    DemoModuleLoader
  ]
})
export class DemoModuleLoaderModule {

}