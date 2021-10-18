import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GoogleService {

  idToken:any

  constructor(
    private http: HttpClient
  ) { }

  private url = 'http://localhost:3000'

  verifyUser(formData:any): Observable<any>{
    return this.http.post<any>(`${this.url}/google-verify`,formData)
  }
}
