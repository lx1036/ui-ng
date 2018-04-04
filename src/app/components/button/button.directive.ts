import {AfterViewInit, Directive, ElementRef, Input, NgModule, Renderer2} from '@angular/core';

@Directive({
  selector: '[uiButton]',
  providers: []
})
export class ButtonDirective implements AfterViewInit {
  @Input() theme: string = 'default';
  @Input() size: string;
  @Input() icon: string;
  @Input() round: string;
  @Input() roundRadius: number;
  @Input() flat: boolean;
  @Input() circle: boolean;
  @Input() direction: string;
  
  button: HTMLButtonElement;
  
  constructor(private elementRef: ElementRef, private renderer: Renderer2) {
    console.log(this.elementRef.nativeElement);
  }
  
  ngAfterViewInit() {
    this.button = this.elementRef.nativeElement;
    this.renderer.addClass(this.button, 'btn');
    this.renderer.addClass(this.button, `btn-${this.theme}`);
    
    if (this.size) {
      this.renderer.addClass(this.button, `btn-${this.size}`);
    }
    
    if (this.icon) {
      const icon = this.renderer.createElement('i');
      this.renderer.addClass(icon, 'fa');
      this.renderer.addClass(icon, `fa-${this.icon}`);
      
      if ('left' === this.direction) {
        this.renderer.insertBefore(this.button, icon, this.button.firstChild);
      } else {
        this.renderer.appendChild(this.button, icon);
      }
      
      if (this.button.lastChild !== icon) {
        this.renderer.addClass(icon, `ui-btn-${this.direction}`);
      }
    }
    
    if (this.round) {
      this.renderer.addClass(this.button, 'btn-round');
    }
    
    if (this.roundRadius) {
      this.renderer.setStyle(this.button, 'borderRadius', this.roundRadius);
    }
    
    if (this.flat) {
      this.renderer.addClass(this.button, 'btn-flat');
    }
    
    if (this.circle) {
      this.renderer.addClass(this.button, 'btn-circle');
    }
  }
}

@NgModule({
  declarations: [ButtonDirective],
  exports: [ButtonDirective]
})
export class ButtonModule {}
