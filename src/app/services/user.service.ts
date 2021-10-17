import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  firstName:string = ''
  lastName:string = ''
  name:string = ''
  email:string = ''
  
  constructor(
    private http: HttpClient
  ) { }

  private url = 'http://localhost:3000'

  signupUser(formData:any): Observable<any>{
    return this.http.post<any>(`${this.url}/users`,formData)
  }


}
