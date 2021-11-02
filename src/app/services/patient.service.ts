import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PatientService {

  constructor(
    private http: HttpClient
  ) { }

  private url = 'http://localhost:3000';

  addPatient(formData: any): Observable<any>{
    return this.http.post<any>(`${this.url}/patients`,formData);
  }

  getPatients(formData: any): Observable<any>{
    return this.http.get<any>(`${this.url}/patients?date=${formData.date_filter}&status=${formData.status_filter}`);
  }

  getPatient(contactNum: string): Observable<any>{
    return this.http.get<any>(`${this.url}/patients/${contactNum}`);
  }

  editPatient(contactNum: string, disclosureDate: any, formData: any): Observable<any>{
    return this.http.put<any>(`${this.url}/patients/${contactNum}/dates/${disclosureDate}`, formData);
  }

  getWhereabouts(contactNum: string): Observable<any>{
    return this.http.get<any>(`${this.url}/patients/${contactNum}/whereabouts`);
  }
  
}
