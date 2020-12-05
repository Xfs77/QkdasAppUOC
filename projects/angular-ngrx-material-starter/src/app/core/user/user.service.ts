import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Address, User } from './user.models';
import { AppSettings } from '../../app/app.settings';
import { map } from 'rxjs/operators';
import { from, Observable, ObservedValueOf } from 'rxjs';
import * as firebase from 'firebase';
import { AbstractControl, AsyncValidatorFn, ValidationErrors } from '@angular/forms';


@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private afAuth: AngularFireAuth,
    private afFirestore: AngularFirestore
  ) {
  }

  updateAuth(user: User): Promise<firebase.auth.UserCredential> {
    if (!user.id) {
      return this.afAuth.createUserWithEmailAndPassword(user.email, user.password);
    }
  }

  checkIfEmailExists(email: string): Observable<ObservedValueOf<Promise<firebase.firestore.QuerySnapshot<firebase.firestore.DocumentData>>>> {
    return from(this.afFirestore.collection(AppSettings.API_USERS).ref.where('email', '==', email).get());
  }

  emailValidator(edit: boolean): AsyncValidatorFn {
    if (edit) {
      return null;
    } else {
      return (control: AbstractControl): Observable<ValidationErrors | null> => {
        return this.checkIfEmailExists(control.value).pipe(
          map(res => {
            console.log(res)
            if (res.docs.length > 0) {
              return { emailExists: true }
            } else {
              return null;
            }
          })
        );
      };
    }
  }

  async changePassword(password: string) {
    const user = await this.afAuth.currentUser;
    return user.updatePassword(password);
  }

  async userUpdate(user: User) {
    if (!user.id) {
      const auth = await this.updateAuth(user);
      if (auth) {
        const userNew = {} as User;
        Object.assign(userNew, user);
        userNew.id = auth.user.uid;
        return this.afFirestore.collection(AppSettings.API_USERS).doc(userNew.id).set(userNew);
      }
    }
    return this.afFirestore.collection(AppSettings.API_USERS).doc(user.id).set(user);
  }

  userGet(id: string): Observable<firebase.firestore.DocumentSnapshot> {
    return this.afFirestore.collection(AppSettings.API_USERS).doc(id).get();
  }

  userCheckEmail(email: string): Observable<boolean> {
    return this.afFirestore.collection(AppSettings.API_USERS, ref => ref.where('email', '==', email)).get().pipe(
      map(res => res.docs.length === 0 ? false : true));
  }

  userAddressGet(user: User): Observable<firebase.firestore.QuerySnapshot>  {
    return this.afFirestore.collection(AppSettings.API_USERS).doc(user.id).collection(AppSettings.API_ADDRESS).get();
  }

  userAddressUpdate(user: User, address: Address, edit: boolean) {
    if (!edit) {
      return this.afFirestore.collection(AppSettings.API_USERS).doc(user.id)
        .collection(AppSettings.API_ADDRESS).doc(address.id).set(address);
    } else {
      return this.afFirestore.collection(AppSettings.API_USERS).doc(user.id)
        .collection(AppSettings.API_ADDRESS).doc(address.id).update(address);
    }
  }

  userAddressRemove(user: User, address: Address) {
    return this.afFirestore.collection(AppSettings.API_USERS).doc(user.id)
      .collection(AppSettings.API_ADDRESS).doc(address.id).delete();
  }

  async userAddressDefault(user: User, address: Address) {
    const addresses = await this.afFirestore.collection(AppSettings.API_USERS).doc(user.id)
      .collection(AppSettings.API_ADDRESS).get().pipe(
        map(addressDocsArray => addressDocsArray.docs.map(doc => doc.data()))).toPromise();

    const batch = this.afFirestore.firestore.batch();
    for (const item of addresses) {
      if (item.id === address.id ) {
        const ref = this.afFirestore.collection(AppSettings.API_USERS).doc(user.id)
          .collection(AppSettings.API_ADDRESS).doc(item.id).ref;
        batch.update(ref, {default: true});
      } else {
        if (item.default) {
          const ref = this.afFirestore.collection(AppSettings.API_USERS).doc(user.id)
            .collection(AppSettings.API_ADDRESS).doc(item.id).ref;
          batch.update(ref, {default: false});
        }
      }
    }
    return batch.commit();

  }
}
