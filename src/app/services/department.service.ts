import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DepartmentService {

  constructor(
    private http: HttpClient
  ) { }

  private url = 'http://localhost:3000'

  getDepartments(): Observable<string[]>{
    return this.http.get<string[]>(`${this.url}/establishments/departments`)
  }
}
