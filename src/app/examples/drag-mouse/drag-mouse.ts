import { fromEvent } from 'rxjs';

fromEvent(document, 'mousemove').subscribe((point: MouseEvent) => {
  // console.log([point.x, point.y]);
});