import { Component, OnInit } from '@angular/core';
import * as firebase from 'firebase/app';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../servicios/auth.service';

declare const initFromText: any;
declare const store: any;

@Component({
  selector: 'app-code-to-diagram',
  templateUrl: './code-to-diagram.component.html',
  styleUrls: ['./code-to-diagram.component.css']
})
export class CodeToDiagramComponent implements OnInit {

  constructor(public AuthService: AuthService, private router: Router) { }

  ngOnInit(): void {
    const username = sessionStorage.getItem('id');
    const db = firebase.firestore();
    initFromText();
  }

  storeDiagram(): void{
    const username = sessionStorage.getItem('id');
    const db = firebase.firestore();
    store(db, username, this.router.url.split("/", 4));
  }

}
