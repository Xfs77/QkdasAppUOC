import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  Output,
  ViewChild, EventEmitter
} from '@angular/core';
import { Observable, of } from 'rxjs';
import { emptyProduct, Product } from '../../../../core/product-form/product.models';
import { Agrupation } from '../../../../core/agrupation/agrupation.models';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { map, take } from 'rxjs/operators';
import { PhotoDirective } from '../../../../shared/directives/photo.directive';
import { ProductFormService } from '../../../../core/product-form/product-form.service';

@Component({
  selector: 'anms-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductFormComponent implements OnInit {

  @Input() product$: Observable<Product> = of(emptyProduct() as Product);
  @Input() selectedAgrup$: Observable<Agrupation>;
  @Output() saveProductEvent: EventEmitter<any> = new EventEmitter<any>();
  @Output() onAgrupationEvent: EventEmitter<any> = new EventEmitter<any>();
  @Output() cancelProductEvent: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() getImagesEvent: EventEmitter<Product> = new EventEmitter<Product>();

  @ViewChild(PhotoDirective, {static: true}) photoHost: PhotoDirective;

  private product = {} as Product;
  private selectedAgrup: Agrupation;
  edit = false;

  imageToUpdateIsMain: ImageData;
  productForm: FormGroup;

  descrMaxLength = 150;
  refMaxLength = 13;

  validationMessages = {
    active: [
    ],
    agrupation: [
      {type: 'required', message: 'El producto debe pertenecer a una agrupación'},
      {type: 'productAgrupation', message: 'La agrupación no puede contener otras agrupaciones'}

    ],
    reference: [
      {type: 'required', message: 'La referencia debe informarse'},
      {type: 'referenceExists', message: 'La referencia ya existe'},
      {type: 'maxlength', message: `La referencia como máximo puede tener ${this.refMaxLength} carácteres`}
    ],
    descr: [
      {type: 'required', message: 'La descripción debe informarse'},
      {type: 'maxlength', message: `La descripción como máximo puede tener ${this.descrMaxLength} carácteres`}
    ],
    quantity: [
      {type: 'required', message: 'La cantidad debe informarse'},
      {type: 'minlength', message: 'La cantidad  debe ser un número positivo'}
    ],
    price: [
      {type: 'required', message: 'El precio debe informarse'},
      {type: 'minlength', message: 'La cantidad  debe ser un número positivo'}
    ],
  };

  constructor(
    private fb: FormBuilder,
    private productFormService: ProductFormService
  ) {
  }

  ngOnInit() {
    this.createForm();
    this.agrupationDataSubscription();
    this.productDataSubscription();
    this.product$.pipe(
      take(1),
      map(product => {
        if (product && product.reference) {
          this.edit = true;
          this.getImagesEvent.emit(product);
        } else {
          this.getImagesEvent.emit(null);
        }
      })).subscribe();
  }

  private agrupationDataSubscription() {
    this.selectedAgrup$.subscribe(
      res => {
        if (res && !this.edit) {
          this.selectedAgrup = res;
          this.agrupation.setValue(res.pathDescription);
          if (res.hasChildren) {
            this.agrupation.setErrors({productAgrupation: 'hasItems'})
            console.log(this.productForm)
          }
        }
      });
  }

  private productDataSubscription() {
    this.product$.pipe(take(1)).subscribe(res => {
      if (res && res.reference !== null) {
        this.product = res;
        this.setFormData(res);
      }
    });
  }

  private createForm() {
    this.productForm = this.fb.group({
      active: [true],
      agrupation: [null, [Validators.required]],
      reference: [null,
        {
          validators: [Validators.required, Validators.maxLength(13)],
          asyncValidators: [this.productFormService.referenceValidator()],
          updateOn: 'blur'
        }
        ],
      descr: [null, [Validators.required, Validators.maxLength(150)]],
      quantity: [null, [Validators.required, Validators.min(0)]],
      price: [null, [Validators.required, Validators.min(0)]]
    },
      );
  }

  get active() {
    return this.productForm.get('active');
  }

  get agrupation() {
    return this.productForm.get('agrupation');
  }

  get reference() {
    return this.productForm.get('reference');
  }

  get descr() {
    return this.productForm.get('descr');
  }

  get quantity() {
    return this.productForm.get('quantity');
  }

  get price() {
    return this.productForm.get('price');
  }

  onSave() {
    console.log('sdsd')
    console.log(this.productForm)
    const product = {
            ...this.getFormData()};
    if (this.productForm.valid)
    this.saveProductEvent.emit({
        product
      },
    );
  }
  onCancel() {
    this.cancelProductEvent.emit(true);
  }

  getFormData(): Product {
    const product = {
      ...this.product
    };
    product.active = this.active.value;
    product.agrupation = this.selectedAgrup;
    product.reference = this.reference.value;
    product.descr = this.descr.value;
    product.quantity = this.quantity.value;
    product.price = this.price.value;

    if (this.imageToUpdateIsMain && this.product.mainImage) {
      product.mainImage = null;
    }
    return product;
  }

  setFormData(product: Product) {
    this.active.setValue(product.active);
    this.agrupation.setValue(product.agrupation.pathDescription);
    this.reference.setValue(product.reference);
    this.descr.setValue(product.descr);
    this.quantity.setValue(product.quantity);
    this.price.setValue(product.price);

    if (this.imageToUpdateIsMain && product.mainImage) {
      delete product.mainImage;
    }

  }

  onAgrupation() {
    if (!this.edit) {
      this.onAgrupationEvent.emit(true);
    }
  }
}
