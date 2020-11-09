import { NgModule } from '@angular/core';
import { CatalogueWrapperComponent } from './catalogue-wrapper.component';
import { SharedModule } from '../../shared/shared.module';
import { CatalogueWrapperRoutingModule } from './catalogue-wrapper-routing.module';
import { CatalogueComponent } from './catalogue/catalogue.component';
import { ImageViewerComponent } from './image-viewer/image-viewer.component';
import { ProductsFilterWrapperModule } from '../products-filter-wrapper/products-filter-wrapper.module';
import { AgrupationsWrapperModule } from '../agrupations-wrapper/agrupations-wrapper.module';
import { CatalogueItemComponent } from './catalogue/catalogue-item/catalogue-item.component';
import { IndicatorComponent } from './image-viewer/indicator/indicator.component';
import {
  MAT_DIALOG_DATA,
  MAT_DIALOG_DEFAULT_OPTIONS,
  MatDialogRef
} from '@angular/material/dialog';



@NgModule({
  declarations: [
    CatalogueWrapperComponent,
    CatalogueComponent,
    ImageViewerComponent,
    CatalogueItemComponent,
    IndicatorComponent
  ],
  exports: [
    CatalogueWrapperComponent
  ],
  imports: [
    SharedModule,
    CatalogueWrapperRoutingModule,
    ProductsFilterWrapperModule,
    AgrupationsWrapperModule,
  ],
  providers: [
    { provide: MAT_DIALOG_DATA, useValue: {} },
    {provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: {hasBackdrop: false}}
  ]
})
export class CatalogueWrapperModule { }
