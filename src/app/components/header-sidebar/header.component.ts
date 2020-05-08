import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../servicios/auth.service';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor(
    public AuthService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  logOut(){
    this.AuthService.logout();
    this.router.navigate(['/']);
  }

}
