import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Order, OrdersFilterInterface } from './order.models';
import { AppSettings } from '../../app/app.settings';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(
    private afFirestore: AngularFirestore
  ) {
  }


  addOrder(order: Order) {
    const orderDataRef = this.afFirestore.collection(AppSettings.API_ORDER).doc(AppSettings.DOC_ORDER_INFO).ref;
    return this.afFirestore.firestore.runTransaction(transaction => {
      return transaction.get(orderDataRef).then(orderDataDoc => {
        const nextId = (orderDataDoc.data().id++ + 1).toString();
        console.log(nextId)
        order.id = nextId;
        transaction.update(orderDataRef, {id: nextId});
        const newOrderRef = this.afFirestore.collection(AppSettings.API_ORDER).doc(nextId).ref;
        const newOrderUserRef = this.afFirestore.collection(AppSettings.API_USERS).doc(order.user.id).collection(AppSettings.API_ORDER).doc(nextId).ref;
        transaction.set(newOrderUserRef, order);
        transaction.set(newOrderRef, order);
      });
    })
  }

  ordersGet(filter: OrdersFilterInterface): AngularFirestoreCollection<any> {
    if (filter.userId) {
      const query = this.afFirestore.collection(AppSettings.API_USERS).doc(filter.userId).collection(AppSettings.API_ORDER);
      return query;
    } else {
      const query = this.afFirestore.collection(AppSettings.API_ORDER);
      return query;
    }
  }
}
