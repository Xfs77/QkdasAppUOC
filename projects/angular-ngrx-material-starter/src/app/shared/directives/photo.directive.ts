import {Directive, ViewContainerRef} from '@angular/core';

@Directive({
  selector: '[appPhotoHost]'
})
export class PhotoDirective {

  constructor(public viewContainerRef: ViewContainerRef) { }

}

