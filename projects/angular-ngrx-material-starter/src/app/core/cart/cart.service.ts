import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { AppSettings } from '../../app/app.settings';
import { CartLine } from './cart.models';
import {firestore} from 'firebase';

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
    console.log(cartLine)
    console.log(idUser, cartLine)
    const timestamp: firestore.FieldValue = firestore.FieldValue.serverTimestamp();
    cartLine = {...cartLine };
    const query = this.afFirestore.collection(AppSettings.API_USERS).doc(idUser).collection(AppSettings.API_CART).doc(cartLine.id);
    return query.set({
        ...cartLine,
        timestamp
      });
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

