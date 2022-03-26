import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie';
import { UserService } from '../user.service';

@Injectable({
  providedIn: 'root'
})
export class UphsGuardService {
  constructor(
    private router:Router,
    private cookieService:CookieService
  ) { }


  canActivate():boolean {
    if(JSON.parse(localStorage.getItem('User')!).role === 'uphs'){
      return true
    }
    else{
      this.router.navigate(['/'])
      return false
    }
  }
}
