import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  firstName:string = ''
  lastName:string = ''
  name:string = ''
  email:string = ''


  constructor() { }


}
