import {
  Component,
  OnInit,
  Input,
  ViewChild,
  Inject
} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ImageData } from '../../../core/product-form/product.models';
import 'hammerjs';

@Component({
  selector: 'anms-image-viewer',
  templateUrl: './image-viewer.component.html',
  styleUrls: ['./image-viewer.component.scss'],
})
export class ImageViewerComponent implements OnInit {


  @Input() images: ImageData[];
  @Input() description: string;
  @ViewChild('image_container') imageContainer;

  index = 0;
  active = false;

  constructor( private dialogRef: MatDialogRef<ImageViewerComponent>,
               @Inject(MAT_DIALOG_DATA) data) {

    this.images = data.images;
    this.description = data.description;
  }

  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }

  onRight(event?) {
    if (this.index < this.images.length - 1) {
      this.desactivate();
      setTimeout(() => {
        this.index++;
      }, 500);
    }
  }

  onLeft(event?) {
    if (this.index > 0) {
      this.desactivate();
      setTimeout(() => {
        this.index--;
      }, 500);
    }
  }

  onClose() {
    this.dialogRef.close();
  }

  activate() {
    this.active = true;
  }

  desactivate() {
    this.active = false;
  }

}
