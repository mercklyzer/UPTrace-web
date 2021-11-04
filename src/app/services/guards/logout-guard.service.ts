import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie';
import { UserService } from '../user.service';

@Injectable({
  providedIn: 'root'
})
export class LogoutGuardService implements CanActivate {
  constructor(
    private router:Router,
    private cookieService:CookieService
  ) { }

  canActivate():boolean {
    if(!this.cookieService.get('User')){
      return true
    }
    else{
      this.router.navigate(['/'])
      return false
    }
  }
}
