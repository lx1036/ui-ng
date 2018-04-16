import {CommonModule} from '@angular/common';
import {ChangeDetectorRef, Component, enableProdMode, Input, NgModule} from '@angular/core';
import {BrowserModule, platformBrowser} from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/examples/app.component';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.log(err));

// platformBrowser().bootstrapModule(AppModule).then().catch();

/**
 * angular关闭ngzone测试
 * https://juejin.im/post/5acf5fd7f265da23945fe02f
 */

/*@Component({
  selector: 'app-page1',
  template: `
    <app-page2 [test]="index"></app-page2>
  `
})
class AppPage1 {
  index: number = 0;
  constructor(public cd: ChangeDetectorRef) {}
  
  ngOnInit() {
    setInterval(() => {
      this.index++;
      this.cd.detectChanges();
    }, 1000);
  }
}
@Component({
  selector: 'app-page2',
  template: `
    page2 works {{test}}
  `
})
class AppPage2 {
  @Input() test: any;
  constructor(
    public cd: ChangeDetectorRef
  ) {}
  
  ngOnInit() {
    console.log('ngOnInit');
  }
  
  ngOnChanges() {
    console.log('ngOnChanges');
  }
  
  ngOnDestroy() {
    console.log('ngOnDestroy');
  }
  
  ngAfterContentChecked() {
    console.log('ngAfterContentChecked');
    this.cd.detectChanges();
    console.log(this.test);
  }
  
  ngAfterContentInit() {
    console.log('ngAfterContentInit');
  }
  
  ngAfterViewInit() {
    console.log('ngAfterViewInit');
  }
}
@NgModule({
  imports: [
    BrowserModule,
  ],
  declarations: [
    AppPage1,
    AppPage2,
  ],
  bootstrap: [
    AppPage1
  ]
})
class BModule {}

platformBrowserDynamic()
  .bootstrapModule(BModule, {
    ngZone: 'noop'
  })
  .catch(err => console.log(err));
*/
