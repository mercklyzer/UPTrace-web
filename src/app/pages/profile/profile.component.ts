import { Component, OnInit } from '@angular/core';

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
  ) { }

  ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem('User')!);
    console.log(this.user);
  }

  convertContactTime(contactTime: any): any {
    return moment(contactTime, "HH:mm").format("hh:mm A");
  }

}
