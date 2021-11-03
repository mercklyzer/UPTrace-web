import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { UserService } from '../user.service';

@Injectable({
  providedIn: 'root'
})
export class LogoutGuardService implements CanActivate {
  constructor(
    private router:Router,
    private userService:UserService
  ) { }

  canActivate():boolean {
    if(this.userService.user.role === ''){
      return true
    }
    else{
      this.router.navigate(['/'])
      return false
    }
  }
}
