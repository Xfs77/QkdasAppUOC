import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Order, OrdersFilterInterface } from './order.models';
import { AppSettings } from '../../app/app.settings';
import { Injectable } from '@angular/core';
import { ProductFormService } from '../product-form/product-form.service';
import { Product } from '../product-form/product.models';
import { Update } from '@ngrx/entity';
import { User } from '../user/user.models';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(
    private afFirestore: AngularFirestore,
    private productService: ProductFormService
  ) {
  }

  addOrder(order: Order) {
    const orderDataRef = this.afFirestore.collection(AppSettings.API_ORDER).doc(AppSettings.DOC_ORDER_INFO).ref;
    return this.afFirestore.firestore.runTransaction(transaction => {
      return transaction.get(orderDataRef).then(async orderDataDoc => {
        let trans = transaction;
        const nextId = (orderDataDoc.data().id++ + 1).toString();
        order.id = nextId;
        trans.update(orderDataRef, { id: nextId });

        for (const line of order.orderLines) {
          const productDoc = await this.afFirestore.collection(AppSettings.API_PRODUCT).doc(line.product.reference).get().toPromise();
          const product = productDoc.data();
          const newProduct = {
            ...product,
            quantity: (product.quantity - line.quantity)
          }
          trans = <firebase.firestore.Transaction>this.productService.addProduct(newProduct as Product, null, false, trans);
        }
        const checkoutRef = this.afFirestore.collection(AppSettings.API_CHECKOUT).doc(order.checkout).ref;
        trans.set(checkoutRef, {order: order.id});
        const newOrderRef = this.afFirestore.collection(AppSettings.API_ORDER).doc(nextId).ref;
        const newOrderUserRef = this.afFirestore.collection(AppSettings.API_USERS).doc(order.user.id).collection(AppSettings.API_ORDER).doc(nextId).ref;
        trans.set(newOrderUserRef, order);
        trans.set(newOrderRef, order);
      });
    })
  }

  async removeOrder(order: Order) {
    let batch = this.afFirestore.firestore.batch();
    const orderRef = this.afFirestore.collection(AppSettings.API_ORDER).doc(order.id).ref;
    const orderUserRef = this.afFirestore.collection(AppSettings.API_USERS).doc(order.user.id).collection(AppSettings.API_ORDER).doc(order.id).ref;
    for (const line of order.orderLines) {
      const productDoc = await this.afFirestore.collection(AppSettings.API_PRODUCT).doc(line.product.reference).get().toPromise();
      const product = productDoc.data();
      const newProduct = {
        ...product,
        quantity: (product.quantity + line.quantity)
      }
      batch = <firebase.firestore.WriteBatch>this.productService.addProduct(newProduct as Product, null, false, batch);
    }
    batch.delete(orderRef);
    batch.delete(orderUserRef);

    return batch;
  }

  updateOrder(user: User, order: Update<Order>): firebase.firestore.WriteBatch {
    const batch = this.afFirestore.firestore.batch();
    const newOrderRef = this.afFirestore.collection(AppSettings.API_ORDER).doc(order.id.toString()).ref;
    const newOrderUserRef = this.afFirestore.collection(AppSettings.API_USERS).doc(user.id)
      .collection(AppSettings.API_ORDER).doc(order.id.toString()).ref;
    batch.update(newOrderRef, order.changes);
    batch.update(newOrderUserRef, order.changes);
    return batch;
  }

  ordersGet(filter: OrdersFilterInterface): AngularFirestoreCollection<any> {
    if (filter.userId) {
      const query = this.afFirestore.collection(AppSettings.API_USERS)
        .doc(filter.userId).collection(AppSettings.API_ORDER, ref => ref.orderBy('date', 'desc'));
      return query;
    } else {
      const query = this.afFirestore.collection(AppSettings.API_ORDER, ref => ref.orderBy('date', 'desc'));
      return query;
    }
  }
}
