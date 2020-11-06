import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ViewChild,
  ComponentFactoryResolver, ElementRef, ViewContainerRef
} from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { emptyProduct, ImageData, Product } from '../../../core/product-form/product.models';
import { Agrupation } from '../../../core/agrupation/agrupation.models';
import { PhotoDirective } from '../../../shared/directives/photo.directive';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import {
  selectProductImages,
  selectProductProductForm
} from '../../../core/product-form/product-form.selectors';
import { map, take } from 'rxjs/operators';
import { selectProductsFilter } from '../../../core/products-filter/products-filter.selector';
import { productsFilterIsLoading } from '../../../core/products-filter/products-filter.action';
import {
  productFormSave,
  productImageRemove, productImageRemoveSuccess,
  productImagesGet, productImageUpdateSuccess
} from '../../../core/product-form/product-form.action';
import { ImageFormComponent } from '../image-form/image-form.component';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { AgrupationsComponent } from '../../agrupations-wrapper/agrupations/agrupations.component';

@Component({
  selector: 'anms-product-form-wrapper',
  templateUrl: './product-form-wrapper.component.html',
  styleUrls: ['./product-form-wrapper.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductFormWrapperComponent implements OnInit {
  dialogRefAgrup: MatDialogRef<AgrupationsComponent, any>;
  product$: Observable<Product>;
  private selectedAgrupSource = new BehaviorSubject<Agrupation>(null);
  selectedAgrup$ = this.selectedAgrupSource.asObservable();
  currentSelectedAgrup: Agrupation;
  images$: Observable<ImageData[]>;
  images: ImageData[];
  imagesToUpload = {} as { id: ImageData };
  imagesToRemove = {} as { id: ImageData };
  imageToUpdateIsMain: ImageData;
  index = 0;

  edit: boolean;

  @ViewChild(PhotoDirective, {static: true}) photoHost: PhotoDirective;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private store$: Store,
    private dialog: MatDialog,
    private componentFactoryResolver: ComponentFactoryResolver,

  ) {

  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      const reference = params.reference;
      if (reference) {
        this.product$ = this.store$.select(selectProductProductForm);
        this.edit = true;
      } else {
        this.product$ = of(emptyProduct());
        this.edit = false;
      }
    });

    this.product$.pipe(
      take(1),
      map(res => {
        if (res && res.reference) {
          this.currentSelectedAgrup = res.agrupation;
          this.selectedAgrupSource.next(res.agrupation);
        } else {
          this.store$.select(selectProductsFilter).subscribe(filter => {
            if (filter && filter.agrupation) {
              this.currentSelectedAgrup = filter.agrupation;
              this.selectedAgrupSource.next(filter.agrupation);
            }
          });
        }
      })).subscribe();
  }

  saveProduct($event) {
    this.store$.dispatch(
      productFormSave({
        payload: {
          product:  $event.product,
          imagesToRemove: Object.values(this.imagesToRemove),
          imagesToUpload: Object.values(this.imagesToUpload),
          imageToUpdateIsMain: this.imageToUpdateIsMain,
          edit: this.edit
        }
      }));
  }

  cancelProduct() {
    this.router.navigate(['products']);
  }

  onAgrupations() {
    if (window.innerWidth < 960) {
      const dialogConfig = new MatDialogConfig();
      dialogConfig.autoFocus = true;
      dialogConfig.closeOnNavigation = true;
      dialogConfig.width = '90vw';
      dialogConfig.maxWidth = '500px';

      this.dialogRefAgrup = this.dialog.open(AgrupationsComponent, dialogConfig );
      this.dialogRefAgrup.afterClosed().subscribe(result => {
        this.selectedAgrupSource.next(result);
      });
    }
  }

  getImages($event: Product) {
    if ($event) {
      this.store$.dispatch(productImagesGet({payload: {product: $event}}));
      this.images$ = this.store$.select(selectProductImages);
      this.store$.select(selectProductImages).pipe(take(2)).subscribe(
      res => {
        console.log(res)
        if (res.length > 0 && this.index === 0) {

            this.index = res.length;
            this.images = res;
            this.addNewImage(null);
          }
        });
    } else {
      this.addNewImage(null);
    }
  }

  addNewImage(image: ImageData) {
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(ImageFormComponent);
    const viewContainerRef: ViewContainerRef = this.photoHost.viewContainerRef;
    const componentRef = viewContainerRef.createComponent(componentFactory);
    (componentRef.instance as ImageFormComponent).component = componentRef;
    (componentRef.instance as ImageFormComponent).id = this.index;
    if (image) {
      (componentRef.instance as ImageFormComponent).image = image;

    }
    (componentRef.instance as ImageFormComponent).eventNewImage.subscribe(res => {
      this.onAddImage(res);
    });
    (componentRef.instance as ImageFormComponent).eventRemoveImage.subscribe(res => {
      this.onRemoveImage(res);
    });
    this.index++;
  }

  onAddImage(e) {
    if (e.id === (this.index - 1).toString()) {
      this.addNewImage(null);
    }
    if (e.image) {
      this.imagesToUpload = {
        ...this.imagesToUpload,
        [e.image.id]: e.image
      };
      if (e.image.isMain) {
        this.imageToUpdateIsMain = e.image;
      }
    }
  }

  onRemoveImage(image: ImageData) {


    if (image != null) {
      delete this.imagesToUpload[image.id];
    }

    if (image && image.urls.imgXL) {

      this.imagesToRemove = {
        ...this.imagesToRemove,
        [image.id]: image
      };
    }
  }


  onSelectAgrup($event: Agrupation) {
    this.selectedAgrupSource.next($event);
  }

  onRemoveComponent($event: ImageData) {
    this.onRemoveImage($event);
    this.store$.dispatch(productImageRemoveSuccess({payload: {product: null, imageKey: $event.id}}));
  }
}
