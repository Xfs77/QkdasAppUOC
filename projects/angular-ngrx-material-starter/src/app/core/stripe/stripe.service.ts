import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StripeService {

  constructor(
    private afFirestore: AngularFirestore,
    private afStorage: AngularFireStorage,
    private http: HttpClient,
  ) {
  }

  getCheckOut(userId: string): Observable<any> {
    const header = new HttpHeaders({'Content-Type':  'application/json'});
    return this.http.post<any>('https://us-central1-qkdasartuoc.cloudfunctions.net/checkout', {userId}, { headers: header});
  }
}
