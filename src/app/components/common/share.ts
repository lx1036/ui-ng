import {CommonModule} from '@angular/common';
import {Component, Directive, Input, NgModule, OnDestroy, OnInit, TemplateRef, ViewContainerRef} from '@angular/core';


@Component({
  selector: 'ui-template',
  template: ``
})
export class TemplateComponent implements OnInit, OnDestroy {
  @Input() template: TemplateRef<any>;
  @Input() data: any;
  
  constructor(private viewContainerRef: ViewContainerRef) {
  }
  
  ngOnInit(): void {
    if (this.template) {
      this.viewContainerRef.createEmbeddedView(this.template, {
      
      });
    }
  }
  
  ngOnDestroy(): void {
  }
}


@Directive({
  selector: '[fTemplate]'
})
export class TemplateDirective {
  @Input('fTemplate') name: string;
  
  constructor(public template: TemplateRef<any>) {}
  
  getType(): string {
    return this.name;
  }
}

@Component({
  selector: 'f-header',
  template: '<ng-content></ng-content>'
})

export class HeaderComponent {
}

@NgModule({
  imports: [CommonModule],
  declarations: [
    TemplateComponent,
    TemplateDirective,
  
    HeaderComponent,
  ],
  exports: [
    TemplateComponent,
    TemplateDirective,
  
    HeaderComponent,
  ]
})
export class ShareModule {}
