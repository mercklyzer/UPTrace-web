import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { User } from 'src/app/models/user.model';

import { CookieService } from 'ngx-cookie';
import * as moment from 'moment';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  user!: User;

  constructor(
    private cookieService:CookieService,
    private router:Router
  ) { }

  ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem('User')!);
    console.log(this.user);
  }

  convertContactTime(contactTime: any): any {
    return moment(contactTime, "HH:mm").format("hh:mm A");
  }

  onLogOut():void{
    localStorage.clear();
    this.router.navigate(['/']);
  }

}
