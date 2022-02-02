import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GoogleService {

  idToken:any

  constructor(
    private http: HttpClient
  ) { }

  private url = environment.apiUrl

  verifyUser(formData:any): Observable<any>{
    return this.http.post<any>(`${this.url}/google-verify`,formData)
  }
}
