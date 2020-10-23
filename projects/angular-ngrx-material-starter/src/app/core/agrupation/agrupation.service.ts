import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Agrupation } from './agrupation.models';
import { AppSettings } from '../../app/app.settings';

@Injectable({
  providedIn: 'root'
})
export class AgrupationService {

  constructor(
    private afFirestore: AngularFirestore,
  ) {
  }

  getAgrupations(agrup: Agrupation): AngularFirestoreCollection<any> {
    let query = this.afFirestore.collection(AppSettings.API_AGRUP);

    for (const element of agrup.path) {
      query = query.doc(element).collection(AppSettings.API_AGRUP);
    }
    // If not root
    if (agrup.id !== 'root') {
      query = query.doc(agrup.id).collection(AppSettings.API_AGRUP);
    }

    return query;
  }

  addAgrupation(agrup: Agrupation, edit: boolean): Promise<void> {
    let query = this.afFirestore.collection(AppSettings.API_AGRUP);
    // Root agrupation
    if (!agrup.path) {
      agrup = {
        ...agrup,
        path: []
      };
    }
    for (const element of agrup.path) {
      if (element !== '') {
        query = query.doc(element).collection(AppSettings.API_AGRUP);
      }
    }
    if (edit) {
      return query.doc(agrup.id).update({description: agrup.description, pathDescription: agrup.pathDescription});
    } else {
      return query.doc(agrup.id).set(agrup);
    }
  }

  removeAgrupation(agrup: Agrupation): Promise<void> {
    let query = this.afFirestore.collection(AppSettings.API_AGRUP);

    for (const element of agrup.path) {
      query = query.doc(element).collection(AppSettings.API_AGRUP);
    }
    return query.doc(agrup.id).delete();
  }


}
