import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie';
import { UserService } from '../user.service';

@Injectable({
  providedIn: 'root'
})
export class HeloGuardService {
  constructor(
    private router:Router,
    private cookieService:CookieService
  ) { }

  canActivate():boolean {
    if((JSON.parse(this.cookieService.get('User')).role === 'helo')){
      return true
    }
    else{
      this.router.navigate(['/'])
      return false
    }
  }
}
