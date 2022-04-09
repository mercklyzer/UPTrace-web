import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import {filter} from 'rxjs/operators';
import { User } from '../models/user.model';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.css']
})
export class TabsComponent implements OnInit {

  constructor(
    private router:Router,
    private userService:UserService 
  ){}

  url:string = ''
  user!:User

  ngOnInit(): void {
    this.router.events.pipe(
    filter(event => event instanceof NavigationEnd))
    .subscribe((receivedEvent) => {
      if(receivedEvent instanceof NavigationEnd){
        this.url = receivedEvent.url;
        this.user = localStorage.getItem('User')? JSON.parse(localStorage.getItem('User')!) : ''
      }
    });
  }
  
}
