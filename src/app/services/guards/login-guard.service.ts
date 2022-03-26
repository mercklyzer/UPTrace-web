import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie';
import { UserService } from '../user.service';

@Injectable({
  providedIn: 'root'
})
export class LoginGuardService {
  constructor(
    private router:Router,
    private cookieService:CookieService
  ) { }

  canActivate():boolean {
    if(localStorage.getItem('User')){
      return true
    }
    else{
      this.router.navigate(['/'])
      return false
    }
  }
}
