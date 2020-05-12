import { Component, OnInit } from '@angular/core';
import * as go from 'gojs';
import * as firebase from 'firebase/app';
import { AuthService } from '../../servicios/auth.service';
import { RouterModule, Router } from '@angular/router';

declare const init: any;
declare const store: any;
declare const load: any;
declare const edit: any;

@Component({
  selector: 'app-diagram-creator',
  templateUrl: './diagram-creator.component.html',
  styleUrls: ['./diagram-creator.component.css']
})
export class DiagramCreatorComponent implements OnInit {

  public myDiagram: any;
  public tree;
  public activity = 1;
  public sentence = 1;
  public forLoop = 1;
  public ifCond = 1;
  public functionNumber = 1;
  public code = '';

  constructor(public AuthService: AuthService, private router: Router) { }

  ngOnInit(): void {
    const username = sessionStorage.getItem('id');
    const db = firebase.firestore();
    init(null, false);
    if (this.router.url !== '/createDiagram'){
      edit(db, this.router.url.split("/", 4)[3], username);
      let button = document.getElementById("storeDiagramButton"); 
      button.innerHTML = "Editar Diagrama";
    }
  }

  storeDiagram(): void{
    const username = sessionStorage.getItem('id');
    const db = firebase.firestore();
    store(db, username, this.router.url.split("/", 4));
  }

  loadDiagram(): void{
    const db = firebase.firestore();
    load(db);
  }

}
