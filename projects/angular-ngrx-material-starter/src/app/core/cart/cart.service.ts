import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { AppSettings } from '../../app/app.settings';
import { Cart, CartLine } from './cart.models';
import { firestore } from 'firebase';
import { Product } from '../product-form/product.models';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from '../user/user.models';
import { AbstractControl, AsyncValidatorFn, ValidationErrors } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  constructor(
    private afFirestore: AngularFirestore
  ) {
  }

  stockValidator(reference: string): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      return this.checkStock(reference, control.value).pipe(
         map(res => {
           if (res) {
             return null;
           } else {
             return { stock: true };
           }
         })
       );
      return null;
    }
  }

  getCart(idUser: string): AngularFirestoreCollection<any> {
    const query = this.afFirestore.collection(AppSettings.API_USERS).doc(idUser).collection(AppSettings.API_CART);
    return query;
  }

  addCart(idUser: string, cartLine: CartLine) {
    const timestamp: firestore.FieldValue = firestore.FieldValue.serverTimestamp();
    cartLine = { ...cartLine };
    const query = this.afFirestore.collection(AppSettings.API_USERS).doc(idUser).collection(AppSettings.API_CART).doc(cartLine.id);
    return query.set({
      ...cartLine,
      timestamp
    });
  }

  checkStock(reference: string, quantity: number): Observable<boolean> {
    return this.afFirestore.collection(AppSettings.API_PRODUCT).doc(reference).get().pipe(
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
    return query.doc(cartLine.id).update({
      quantity: cartLine.quantity
    });
  }

  removeCart(idUser: string, cartLine: CartLine): Promise<void> {
    const query = this.afFirestore.collection(AppSettings.API_USERS).doc(idUser).collection(AppSettings.API_CART);
    return query.doc(cartLine.id).delete();
  }

  async resetCart(user: User): Promise<firebase.firestore.WriteBatch> {
    const lines = await this.afFirestore.collection(AppSettings.API_USERS).doc(user.id).collection(AppSettings.API_CART).get().pipe(
      map(res => {
        const cart = [];
        res.forEach(item => {
          cart.push(item.data() as CartLine);
        });
        return cart;
      })).toPromise();

    const batch = this.afFirestore.firestore.batch();
    for (const line of lines as CartLine[]) {
      const ref =  this.afFirestore.collection(AppSettings.API_USERS).doc(user.id).collection(AppSettings.API_CART).doc(line.id).ref;
      batch.delete(ref);
    }
    return batch;
  }
}

