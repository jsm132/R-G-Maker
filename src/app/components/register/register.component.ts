import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../servicios/auth.service';
import { RouterModule, Router } from '@angular/router';
import * as firebase from 'firebase/app';
declare const reg: any;

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  public email: string;
  public pass: string;
  public confirmPass: string;

  constructor(
    public AuthService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  addUser(){
    
    if (this.confirmPass === this.pass && this.pass !== undefined)
    {
      this.AuthService.registerUser(this.email, this.pass);
      // almacenamos usando sessionStorage, el nombre del usuario para poder usarlo en la aplicación
      sessionStorage.setItem('id', this.email);
      this.router.navigate(['/main']);

      const db = firebase.firestore();
      reg(db, this.email);

    }
    else{
      if(this.confirmPass !== this.pass){
        window.alert('Las contraseñas no coinciden');
      }
      else{
        window.alert('Escriba una contraseña');
      }
    }
  }

}
