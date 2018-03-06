import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {PreloadAllModules, RouterModule, Routes} from '@angular/router';
import { AppComponent } from './app.component';
import {FormsModule} from '@angular/forms';
import {OverlayModule} from '@angular/cdk/overlay';
import { FilePreviewOverlayComponent } from './cdk/overlay/file-preview-overlay/file-preview-overlay.component';


const routes: Routes = [
  {path: '', loadChildren: './index/index.module#IndexModule'}
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      enableTracing: true, // <-- debugging purposes only
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
    FilePreviewOverlayComponent,
  ],
  imports: [
    // Angular
    BrowserModule,
    FormsModule,
    OverlayModule,

    // Application
    AppRoutingModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
  entryComponents: [
    FilePreviewOverlayComponent,
  ],
})
export class AppModule { }
