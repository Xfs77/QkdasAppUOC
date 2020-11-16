import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { AppSettings } from '../../app/app.settings';
import { CartLine } from './cart.models';
import {firestore} from 'firebase';
import { Product } from '../product-form/product.models';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  constructor(
    private afFirestore: AngularFirestore,
  ) {
  }

  getCart(idUser: string): AngularFirestoreCollection<any> {
    const query = this.afFirestore.collection(AppSettings.API_USERS).doc(idUser).collection(AppSettings.API_CART);
    return query;
  }

  addCart(idUser: string, cartLine: CartLine) {
    const timestamp: firestore.FieldValue = firestore.FieldValue.serverTimestamp();
    cartLine = {...cartLine };
    const query = this.afFirestore.collection(AppSettings.API_USERS).doc(idUser).collection(AppSettings.API_CART).doc(cartLine.id);
    return query.set({
        ...cartLine,
        timestamp
      });
  }

  checkStock(product: Product, quantity: number): Observable<boolean> {
    return this.afFirestore.collection(AppSettings.API_PRODUCT).doc(product.reference).get().pipe(
      map(res => {
        const p = res.data() as Product;
        if (p.quantity >= quantity) {
          return true;
        } else {
          return false;
        }
      }));
  }

  async updateCart(idUser: string, cartLine: CartLine): Promise<void> {
    const query = this.afFirestore.collection(AppSettings.API_USERS).doc(idUser).collection(AppSettings.API_CART);
    const cartLines = await query.get().toPromise();
    console.log(cartLines);
    return query.doc(cartLine.id).update({
      quantity: cartLine.quantity
    });
  }

  removeCart(idUser: string, cartLine: CartLine): Promise<void> {
    const query = this.afFirestore.collection(AppSettings.API_USERS).doc(idUser).collection(AppSettings.API_CART);
    return query.doc(cartLine.id).delete();
  }
}

