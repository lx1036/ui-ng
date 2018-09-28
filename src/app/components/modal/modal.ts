import {Component, Injectable, TemplateRef} from "@angular/core";
import {Type} from "@angular/core/src/type";


interface ModalOptions {
  
}


@Injectable()
export class NgModalService {
  open(component: Type<any>|TemplateRef<any>, config?: ModalOptions) {

  }
}


@Component({
  selector: 'ng-modal',
  template: ``
})
export class NgModal {
  
}

