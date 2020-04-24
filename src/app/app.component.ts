import { Component } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
declare const init: any;


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  users: Observable<any[]>;
  constructor(firestore: AngularFirestore) {
    this.users = firestore.collection('users').valueChanges();
  }
  title = 'RG-methodology';
}