import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})
export class HomepageComponent implements OnInit {
  userToken: any;

  constructor(
    private cookieService:CookieService,
  ) { }

  ngOnInit(): void {
    this.userToken = this.cookieService.get('Token');
  }

}
