import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
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
  @ViewChild('collapseBtn') collapse!:ElementRef;


  user!:User
  url = ''

  constructor(
    private userService:UserService,
    private cookieService:CookieService,
    private router:Router
  ) { }

  toggleCollapse(){
    this.collapse.nativeElement.click()
  }

  ngOnInit(): void {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd))
      .subscribe((receivedEvent) => {
        if(receivedEvent instanceof NavigationEnd){
          this.url = receivedEvent.url;
          this.user = this.cookieService.get('User')? JSON.parse(this.cookieService.get('User')) : ''
        }
      });
  }

  redirectTo(url:string):void{
    this.router.navigateByUrl('/dummy', {skipLocationChange: true}).then(() => {
      this.router.navigate([url])
    })
  }

  onLogOut():void{
    this.collapse.nativeElement.click()
    this.cookieService.removeAll()

    if(this.url === '/'){
      this.redirectTo('/')
    }
    else{
      this.router.navigate(['/']);
    }

  }

}
