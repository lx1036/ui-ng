import {CommonModule} from '@angular/common';
import {AfterViewInit, Component, ElementRef, Input, NgModule, ViewChild} from '@angular/core';
import * as highlight from 'highlight.js';

@Component({
  selector: 'ui-code',
  template: `
    <div class="ui-code" [lang]="lang">
      <pre>
        <code [ngClass]="lang" class="hljs" #code>
          <ng-content></ng-content>
        </code>
      </pre>
      <button *ngIf="copy" class="code-clone" (click)="onCopy()">
        <i class="fa fa-copy"></i>
      </button>
    </div>
  `,
  styleUrls: ['./code.component.scss']
})
export class CodeComponent implements AfterViewInit {
  @Input() lang: string;
  @Input() copy: boolean = true;
  @ViewChild('code') codeRef: ElementRef;
  
  code: HTMLElement;
  constructor() { }

  ngAfterViewInit(): void {
    this.code = this.codeRef.nativeElement;
    highlight.highlightBlock(this.code);
  }
  
  onCopy() {
    // clear Selection
    this.clearSelection();
    this.code.appendChild(document.createTextNode(''));
    const range = document.createRange();
    range.setStart(this.code, 0);
    range.setEnd(this.code.lastChild, 0);
    window.getSelection().addRange(range);
    
    // Copy
    document.execCommand('copy');
  }
  
  clearSelection() {
    const selection = window.getSelection();
    selection.removeAllRanges();
  }
}

@NgModule({
  imports: [CommonModule],
  declarations: [CodeComponent],
  exports: [CodeComponent]
})
export class CodeModule {}