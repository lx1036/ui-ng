import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {PreloadAllModules, RouterModule, Routes} from '@angular/router';
import { AppComponent } from './app.component';
import {NewMergeModuleProvidersModule} from './merge-module-providers/merge-module-providers.module';

const routes: Routes = [
  {path: '', loadChildren: './index/index.module#IndexModule'}
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      // enableTracing: true, // <-- debugging purposes only
      // preloadingStrategy: PreloadAllModules
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
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
