import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <div>
      <merge-module-providers></merge-module-providers>
      <router-outlet></router-outlet>
    </div>
  `,
  styleUrls: ['./app.component.css']
})
export class AppComponent {
}
