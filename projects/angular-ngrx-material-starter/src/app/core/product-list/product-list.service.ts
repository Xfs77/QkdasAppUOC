import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { ProductsFilterInterface } from '../products-filter/products-filter.models';
import { Product } from '../product-form/product.models';
import { AppSettings } from '../../app/app.settings';

@Injectable({
  providedIn: 'root'
})
export class ProductListService {

  constructor(
    private afFirestore: AngularFirestore,
    private afStorage: AngularFireStorage
  ) {
  }



  getProducts(filter: ProductsFilterInterface): AngularFirestoreCollection<Product> {
    console.log('getproducts')
    if (filter.agrupation) {
      let agr: any = this.afFirestore.collection(AppSettings.API_AGRUP);

      for (const agrupId of filter.agrupation.path) {
        agr = agr.doc(agrupId).collection(AppSettings.API_AGRUP);
      }

      agr = agr.doc(filter.agrupation.id).collection(AppSettings.API_PRODUCT,
        ref => ref
          .orderBy(filter.sort.field, filter.sort.direction)
          .startAfter(filter.offset)
          .limit(filter.batch)
      );
      agr.stateChanges().subscribe(res => console.log(res))
      return agr;
    } else {
      return this.afFirestore.collection(AppSettings.API_PRODUCT,
        ref => ref
          .orderBy(filter.sort.field, filter.sort.direction)
          .startAfter(filter.offset)
          .limit(filter.batch)
      );
    }
  }

}
