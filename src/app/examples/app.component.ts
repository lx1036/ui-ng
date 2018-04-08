import {Component, NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {PreloadAllModules, RouterModule, Routes} from '@angular/router';
import {SimpleFormControlModule} from './forms/simple-form-control/simple-form-control.component';
import {NewMergeModuleProvidersModule} from './merge-module-providers/merge-module-providers.module';



@Component({
  selector: 'app-root',
  template: `
    <div>
      <!--<merge-module-providers></merge-module-providers>-->
      <router-outlet></router-outlet>
      <!--<simple-form-control></simple-form-control>-->
    </div>
  `,
  styles: []
})
export class AppComponent {
}




const routes: Routes = [
  {path: '', loadChildren: './index/index.component#IndexModule'}
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      // enableTracing: true, // <-- debugging purposes only
      preloadingStrategy: PreloadAllModules
    })
  ],
  exports: [RouterModule],
  declarations: []
})
export class AppRoutingModule {}


@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    // Angular
    BrowserModule,
    BrowserAnimationsModule,
    
    // Application
    AppRoutingModule,
    
    NewMergeModuleProvidersModule,
    SimpleFormControlModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
