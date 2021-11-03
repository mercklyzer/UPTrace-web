import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie';
import { User } from '../models/user.model';
import { UserService } from '../services/user.service';
import {filter} from 'rxjs/operators';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  user!:User
  url = ''

  constructor(
    private userService:UserService,
    private cookieService:CookieService,
    private router:Router
  ) { }

  ngOnInit(): void {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd))
      .subscribe((receivedEvent) => {
        if(receivedEvent instanceof NavigationEnd){
          this.url = receivedEvent.url;
          this.user = this.userService.user
        }
      });
  }

  redirectTo(url:string):void{
    this.router.navigateByUrl('/dummy', {skipLocationChange: true}).then(() => {
      this.router.navigate([url])
    })
  }

  onLogOut():void{
    this.cookieService.removeAll()
    this.userService.user = {
      name: '',
      contact_num: '',
      email: '',
      contact_start_time: '',
      contact_end_time: '',
      way_of_interview: '',
      role: ''
    }
    if(this.url === '/'){
      this.redirectTo('/')
    }
    else{
      this.router.navigate(['/']);
    }

  }

}
