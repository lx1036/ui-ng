import { fromEvent } from 'rxjs/observable/fromEvent';

fromEvent(document, 'mousemove').subscribe((point: MouseEvent) => {
  console.log([point.x, point.y]);
});