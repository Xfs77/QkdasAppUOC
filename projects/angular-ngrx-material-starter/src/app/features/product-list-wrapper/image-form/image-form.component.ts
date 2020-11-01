import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter, ComponentRef
} from '@angular/core';
import { emptyImageData, ImageData } from '../../../core/product-form/product.models';
import {v1 as uuidv1} from 'uuid';


@Component({
  selector: 'anms-image-form',
  templateUrl: './image-form.component.html',
  styleUrls: ['./image-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ImageFormComponent implements OnInit {

  @Input() image: ImageData;
  @Input() id: number;
  @Output() eventNewImage: EventEmitter<{ image: ImageData, id: string }> = new EventEmitter();
  @Output() eventRemoveImage: EventEmitter<ImageData> = new EventEmitter();

  component: ComponentRef<ImageFormComponent>;
  currentImage: ImageData;

  constructor() {}

  ngOnInit() {
    if (!this.image) {
      this.image = emptyImageData();
    }
    this.currentImage = {
      ...this.image,
      urls: {...this.image.urls}
    };
    if (this.id === 0  ) {
      this.currentImage.isMain = true;
    }
  }

  onUpload($event) {
    if (this.currentImage.urls.imgXL) {
      this.eventRemoveImage.emit({...this.currentImage});
    }
    this.currentImage.id = uuidv1();
    this.currentImage.file = $event.target.files[0];
    console.log(this.currentImage)
    this.eventNewImage.emit({image: this.currentImage, id: this.id.toString()});
  }

  onRemove() {
    if (this.currentImage.urls.imgXL) {
      this.eventRemoveImage.emit(this.currentImage);
    }
    this.component.destroy();
  }
}
