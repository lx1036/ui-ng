import {
  AfterContentChecked,
  Component,
  ContentChildren,
  Directive, Input,
  NgModule,
  QueryList,
  TemplateRef
} from "@angular/core";
import {CommonModule} from "@angular/common";


let nextId = 0;

@Directive({
  selector: 'ng-template[ngSlide]'
})
export class NgSlide {
  id = `slide-${nextId++}`;

  constructor(public templateRef: TemplateRef<any>) {}
}



@Component({
  selector: 'ng-carousel',
  template: `
    <ol class="carousel-indicators">
      <li *ngFor="let slide of slides" [id]="slide.id"
          [class.active]="slide.id === activeId" (click)="select(slide.id)"></li>
    </ol>
    <div class="carousel-inner">
      <div *ngFor="let slide of slides" [id]="slide.id" class="carousel-item" [class.active]="slide.id === activeId">
        <ng-template [ngTemplateOutlet]="slide.templateRef"></ng-template>
      </div>
    </div>
    <a *ngIf="showArrows" class="carousel-control-prev" role="button" data-slide="prev" (click)="previous()">
      <span class="carousel-control-prev-icon"></span>
      <span class="sr-only">Previous</span>
    </a>
    <a *ngIf="showArrows" class="carousel-control-next" role="button" data-slide="next" (click)="next()">
      <span class="carousel-control-next-icon"></span>
      <span class="sr-only">Next</span>
    </a>
  `,
  host: {
    'class': 'carousel',
    '[style.display]': '"block"',
  },
  styleUrls: ['./carousel.scss']
})
export class NgCarousel implements AfterContentChecked {
  @ContentChildren(NgSlide) slides: QueryList<NgSlide>;

  @Input() activeId;

  showArrows: boolean;

  select(id) {

  }

  previous() {

  }

  next() {

  }

  ngAfterContentChecked() {
    if (this.activeId) {

    } else {
      this.activeId = this.slides.first.id;
    }
  }
}


@Component({
  selector: 'demo-bootstrap-carousel',
  template: `
    <ng-carousel *ngIf="images">
      <ng-template ngSlide>
        <img [src]="images[0]" alt="Random first slide">
        <div class="carousel-caption">
          <h3>First slide label</h3>
          <p>Nulla vitae elit libero, a pharetra augue mollis interdum.</p>
        </div>
      </ng-template>
      <ng-template ngSlide>
        <img [src]="images[1]" alt="Random second slide">
        <div class="carousel-caption">
          <h3>Second slide label</h3>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
        </div>
      </ng-template>
      <ng-template ngSlide>
        <img [src]="images[2]" alt="Random third slide">
        <div class="carousel-caption">
          <h3>Third slide label</h3>
          <p>Praesent commodo cursus magna, vel scelerisque nisl consectetur.</p>
        </div>
      </ng-template>
    </ng-carousel>
  `
})
export class DemoBootstrapCarousel {
  images = ['assets/carousel/1.jpeg', 'assets/carousel/2.jpeg', 'assets/carousel/3.jpeg']
}


@NgModule({
  declarations: [
    DemoBootstrapCarousel,
    NgCarousel,
    NgSlide,
  ],
  imports: [
    CommonModule,
  ],
  exports: [
    DemoBootstrapCarousel
  ],
})
export class DemoBootstrapCarouselModule {

}