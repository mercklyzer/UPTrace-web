import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import {filter} from 'rxjs/operators';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.css']
})
export class TabsComponent implements OnInit {

  constructor(private router:Router ) {
  }

  url:string = ''

  ngOnInit(): void {
    this.router.events.pipe(
    filter(event => event instanceof NavigationEnd))
    .subscribe((receivedEvent) => {
      if(receivedEvent instanceof NavigationEnd){
        this.url = receivedEvent.url;
        console.log(this.url);
      }
    });
  }
  
}
