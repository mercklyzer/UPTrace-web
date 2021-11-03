import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../user.service';

@Injectable({
  providedIn: 'root'
})
export class HeloGuardService {
  constructor(
    private router:Router,
    private userService:UserService
  ) { }

  canActivate():boolean {
    if(this.userService.user.role === 'helo'){
      return true
    }
    else{
      this.router.navigate(['/'])
      return false
    }
  }
}
