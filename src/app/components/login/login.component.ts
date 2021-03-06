import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../servicios/auth.service';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public email: string;
  public pass: string;

  constructor(
    public AuthService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  check(){
    return this.AuthService.check();
  }

   delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
}

  async doLogin(){
    var loguedIn;
    this.AuthService.login(this.email, this.pass);
    await this.delay(1500);
    loguedIn = this.check();
    if (loguedIn != null){
      // almacenamos usando sessionStorage, el nombre del usuario para poder usarlo en la aplicación
      sessionStorage.setItem('id', this.email);
      this.router.navigate(['/main']);
    }
    else
    {
      window.alert('correo o contraseña incorrecta');
    }
  }

}