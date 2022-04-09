import { Component, HostListener, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  @HostListener('window:resize', ['$event'])
  onResize(event:any) {
    const doc = document.documentElement
    doc.style.setProperty('--app-height', `${window.innerHeight}px`)
    console.log(event.target.innerHeight); 
  }

  title = 'web';
  width:Number = 0;

  ngOnInit(){
    const doc = document.documentElement
    doc.style.setProperty('--app-height', `${window.innerHeight}px`)
  }
}
