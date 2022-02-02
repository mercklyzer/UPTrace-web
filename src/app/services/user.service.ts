import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
 
  constructor(
    private http: HttpClient
  ) { }

  private url = environment.apiUrl

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
