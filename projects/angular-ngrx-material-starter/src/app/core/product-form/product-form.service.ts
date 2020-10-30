import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { ImageData, Product } from './product.models';
import { AppSettings, imageSizes, ORIGINAL_IMAGE } from '../../app/app.settings';
import { forkJoin, Observable } from 'rxjs';
import { last, mergeMap } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class ProductFormService {

  constructor(
    private afFirestore: AngularFirestore,
    private afStorage: AngularFireStorage
  ) {
  }


  addProduct(product: Product, imageIsMain: ImageData, edit: boolean) {
    console.log('addserv', product.reference
    )

    const batch = this.afFirestore.firestore.batch();
    const operation = (refItem) => {
      console.log('addserv')

      if (edit) {
        console.log('addserv')
        return batch.update(refItem, product);
      } else {
        console.log('addserv')
        return batch.set(refItem, product);
      }
  }
    const productAgrupOperation = (agrup, agrupId) => {
      agr = agr.doc(agrupId);
      const prod = agr.collection(AppSettings.API_PRODUCT).doc(product.reference);
      operation( prod.ref);
      agr = agr.collection(AppSettings.API_AGRUP);
      return agr;
    }

    const ref = this.afFirestore.collection(AppSettings.API_PRODUCT).doc(product.reference);
    console.log('addserv')
    operation(ref.ref);

    let agr: any = this.afFirestore.collection(AppSettings.API_AGRUP);

    for (const agrupId of product.agrupation.path) {
      agr = productAgrupOperation(agr, agrupId);
    }
    productAgrupOperation(agr, product.agrupation.id);

    return batch.commit();
  }

  async removeProduct(product: Product) {
    const batch = this.afFirestore.firestore.batch();

    const removeProduct = async (ref, storage: boolean) => {
      const images = await ref.collection(AppSettings.API_IMAGES).get();
      images.forEach(async item => {
        if (storage) {
          await this.removeStorageImage(product, item.data() as ImageData);
        }
        batch.delete(item.ref);
      });
      batch.delete(ref);
    };
    const removeProductAgr = async (agrup, agrupId, storage: boolean) => {
      agrup = agrup.doc(agrupId);
      prod = agrup.collection(AppSettings.API_PRODUCT).doc(product.reference).ref;
      await removeProduct(prod, false);
      agrup = agrup.collection(AppSettings.API_AGRUP);
      return agrup;
    }

    const refProd = this.afFirestore.collection(AppSettings.API_PRODUCT).doc(product.reference).ref;
    await removeProduct(refProd, true);

    let agr: any = this.afFirestore.collection(AppSettings.API_AGRUP);
    let prod;

    for (const agrupId of product.agrupation.path) {
      agr = await removeProductAgr(agr, agrupId, false);
    }
    await removeProductAgr(agr, product.agrupation.id, false);
    return batch.commit();
  }


  getProductImages(product: Product): AngularFirestoreCollection<ImageData> {
    return this.afFirestore.collection(AppSettings.API_PRODUCT).doc(product.reference)
      .collection(AppSettings.API_IMAGES,
        ref => ref
          .orderBy('isMain', 'desc'));
  }

  removeProductImage(product: Product, id: string): Promise<void> {
    const batch = this.afFirestore.firestore.batch();

    const removeProductAgrupImage = (agrup, agrupId) => {
      agrup = agrup.doc(agrupId);
      prod = agrup.collection(AppSettings.API_PRODUCT).doc(product.reference).collection(AppSettings.API_IMAGES).doc(id);
      batch.delete(prod.ref);
      agrup = agrup.collection(AppSettings.API_AGRUP);
      return agrup;
    } ;

    const ref = this.afFirestore.collection(AppSettings.API_PRODUCT).doc(product.reference).collection(AppSettings.API_IMAGES).doc(id).ref;
    batch.delete(ref);

    let agr: any = this.afFirestore.collection(AppSettings.API_AGRUP);
    let prod;

    for (const agrupId of product.agrupation.path) {
      agr = removeProductAgrupImage(agr, agrupId);
    }
    removeProductAgrupImage(agr, product.agrupation.id);

    return batch.commit();
  }

  addStorageImage(product: Product, image: ImageData): Observable<string> {
    const filePath = `${product.reference}/${image.id}/${ORIGINAL_IMAGE}.jpeg`;
    const ref = this.afStorage.ref(filePath);
    return this.afStorage.upload(filePath, image.file).snapshotChanges().pipe(
      last(),
      mergeMap(() => ref.getDownloadURL()));
  }

  removeStorageImage(product: Product, image: ImageData): Observable<any[]> {
    const images = [];
    const imageNames = Object.values(imageSizes);

    for (const size of imageNames) {
      const filePath = `${product.reference}/${image.id}/${size}`;
      const ref = this.afStorage.ref(filePath);
      images.push(ref.delete());
    }
    return forkJoin(images);
  }

  async addProductImage(product: Product, image: ImageData) {
    image = {...image};
    const isMain = image.isMain;
    delete image.file;

    const batch = this.afFirestore.firestore.batch();
    const addProductImage = async (reference) => {
      if (isMain) {
        batch.update(reference.ref, {mainImage: image});
        const images = await reference.collection(AppSettings.API_IMAGES).get().toPromise();
        images.forEach(item => {
          if (item.data().isMain) {
            batch.update(item.ref, {isMain: false});
          }
        });
      }
      reference = reference.collection(AppSettings.API_IMAGES).doc(image.id);
      batch.set(reference.ref, {...image});
    };
    const addProductAgrupImage =  async (agrup, agrupId) => {
      agrup = agrup.doc(agrupId);
      const img = agrup.collection('products').doc(product.reference);
      await addProductImage(img);
      agrup = agrup.collection(AppSettings.API_AGRUP);
      return agrup;
    };

    const ref = this.afFirestore.collection(AppSettings.API_PRODUCT).doc(product.reference);
    await addProductImage(ref);
    let agr: AngularFirestoreCollection<any> = this.afFirestore.collection(AppSettings.API_AGRUP);
    for (const agrupId of product.agrupation.path) {
      agr = await addProductAgrupImage(agr, agrupId);
    }
    await addProductAgrupImage(agr, product.agrupation.id);
    return batch.commit();
  }

}
