import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DepartmentService {

  constructor(
    private http: HttpClient
  ) { }

  private url = environment.apiUrl

  getDepartments(): Observable<string[]>{
    return this.http.get<string[]>(`${this.url}/buildings/departments`)
  }
}
