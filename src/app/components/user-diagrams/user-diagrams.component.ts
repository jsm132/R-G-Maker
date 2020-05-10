import { Component, OnInit } from '@angular/core';
import * as firebase from 'firebase/app';
declare const load: any;

@Component({
  selector: 'app-user-diagrams',
  templateUrl: './user-diagrams.component.html',
  styleUrls: ['./user-diagrams.component.css']
})
export class UserDiagramsComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    const db = firebase.firestore();
    const username = sessionStorage.getItem('id');
    load(db, username);
  }

}
