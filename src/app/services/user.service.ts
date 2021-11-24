import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
 
  constructor(
    private http: HttpClient
  ) { }

  private url = 'http://localhost:3000'

  generateOtp(formData:any): Observable<any>{
    return this.http.post<any>(`${this.url}/users/generate-otp`,formData)
  }

  signupUser(formData:any): Observable<any>{
    return this.http.post<any>(`${this.url}/users`,formData)
  }

  loginUser(formData:any): Observable<{token: any, user:User}>{
    return this.http.post<{token: any, user:User}>(`${this.url}/users/login`,formData)
  }

}
