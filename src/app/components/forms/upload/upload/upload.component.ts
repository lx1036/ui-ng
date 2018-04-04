import {AfterViewInit, Component, ContentChild, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {HeaderComponent} from '../../../common/share';

@Component({
  selector: 'ui-upload',
  template: `
    <div class="ui-upload-box" [ngClass]="styleClass">
      <div class="ui-upload" (dragenter)="onDragEnter($event)" (dragleave)="onDragLeave($event)" (drop)="onDrop($event)" #container>
        <div class="ui-upload-toolbar">
          <div class="ui-upload-text" *ngIf="header;else con">
            <ng-content select="f-header"></ng-content>
            <div class="ui-upload-inner">
              <input type="file" name="uploadFile" [multiple]="multiple" [accept]="accept" (change)="onFileSelect($event)" #input>
            </div>
          </div>
          <ng-template #con>
            <div class="ui-upload-text">
              <button uiButton [theme]="'primary'" [icon]="'plus'" [disabled]="isUploading">{{_title}}</button>
              <div class="ui-upload-inner">
                <input type="file" name="uploadFile" [multiple]="multiple" [accept]="accept" (change)="onFileSelect($event)" #input>
              </div>
            </div>
            <div class="ui-upload-advanced" *ngIf="isAdvanced()">
              <button uiButton [theme]="'warning'" [icon]="'upload'" [disabled]="isUploading || !uploadProgress || isCompleted" (click)="upload()">Upload</button>
              <button uiButton [theme]="'danger'" [icon]="'trash'" [disabled]="isUploading || files.length <= 0" (click)="clear()">Delete All</button>
            </div>
          </ng-template>
        </div>
      </div>
      <div class="ui-upload-progress" *ngIf="showProgress && isAdvanced()">
        <!--<ui-progress [value]="progress"></ui-progress>-->
      </div>
      <div class="ui-upload-invalid" *ngIf="invalidMessage">
        {{invalidMessage}}
      </div>
      <div class="ui-upload-preview" *ngIf="preview && isAdvanced()">
        <ul>
          <li *ngFor="let file of files; index as i;" class="ui-upload-item">
            <img *ngIf="isImage(file)" [src]="file['dateURL']" alt="{{file.name}}" />
            {{file.name}}
            <span class="ui-file-size">{{formatSize(file['size'])}}</span>
            <span class="ui-file-delete" (click)="onDelete(i)"><i class="fa fa-close"></i></span>
          </li>
        </ul>
      </div>
    </div>
  `,
  styleUrls: ['./upload.component.scss']
})
export class UploadComponent implements AfterViewInit {
  // IO
  @Input() styleClass: any;
  @Input() showProgress: boolean;
  @Input() multiple: boolean;
  @Input() accept: string;
  @Input() preview: boolean;
  @Input() title: string;
  @Input() mode: string;
  
  // Dom Query
  @ContentChild(HeaderComponent, {read: ElementRef}) header: ElementRef;
  @ViewChild('container', {read: ElementRef}) container: ElementRef;
  @ViewChild('input', {read: ElementRef}) input: ElementRef;
  
  isUploading: boolean;
  uploadProgress: number;
  isCompleted: boolean;
  progress: number;
  invalidMessage: string;
  _title: string;
  files: File[];
  uploadElement: HTMLDivElement;
  
  constructor() { }

  ngAfterViewInit() {
    this._title = this.title;
    this.uploadElement = this.container.nativeElement;
    
    if ('advanced' === this.mode) {
    
    }
  }
  
  onFileSelect($event): any {}
  
  upload() {}
  
  clear() {}
  
  isAdvanced(): boolean {
    return 'advanced' === this.mode;
  }
  
  isImage(file: File): boolean {
    return true;
  }
  
  formatSize(bytes) {}
  
  onDelete(index: number) {}
  
  onDragEnter($event) {}
  
  onDragLeave($event) {}
  
  onDrop($event) {}
}
