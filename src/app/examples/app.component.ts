import {Component, NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {PreloadAllModules, RouterModule, Routes} from '@angular/router';
import {SimpleFormControlModule} from './forms/simple-form-control/simple-form-control.component';
import {NewMergeModuleProvidersModule} from './merge-module-providers/merge-module-providers.module';
import {OverlayModule} from "@angular/cdk/overlay";
import {PortalModule} from "@angular/cdk/portal";
import {DialogModule} from "./dialog/dialog.component";
import {A11yModule} from "@angular/cdk/a11y";
import {CdkTableModule} from "@angular/cdk/table";
import {MatButtonModule, MatCardModule, MatToolbarModule} from "@angular/material";



@Component({
  selector: 'app-root',
  template: `
    <div>
      <h1>App Root</h1>
      <!--<merge-module-providers></merge-module-providers>-->
      <!--<router-outlet></router-outlet>-->
      <!--<simple-form-control></simple-form-control>-->
    </div>
  `,
  styles: []
})
export class AppComponent {
}




const routes: Routes = [
  // {path: '', loadChildren: './index/index.component#IndexModule'}
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      // enableTracing: true, // <-- debugging purposes only
      preloadingStrategy: PreloadAllModules
    }),
    BrowserAnimationsModule
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
    
    OverlayModule,
    PortalModule,
    DialogModule,
    A11yModule,
    CdkTableModule,
    MatCardModule,
    MatToolbarModule,
    MatButtonModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
