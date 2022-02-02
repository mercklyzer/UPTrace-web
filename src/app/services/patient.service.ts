import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PatientService {

  constructor(
    private http: HttpClient
  ) { }

  private url = environment.apiUrl

  addPatient(formData: any): Observable<any>{
    return this.http.post<any>(`${this.url}/patients`,formData);
  }

  getPatients(formData: any): Observable<any>{
    return this.http.get<any>(`${this.url}/patients?date=${formData.date_filter}&status=${formData.status_filter}&showAssignedPatients=${formData.show_assigned_patients_filter}`);
  }

  getPatientByContactNum(contactNum: string): Observable<any>{
    return this.http.get<any>(`${this.url}/patients/${contactNum}`);
  }

  getPatientByContactNumAndDisclosureDate(contactNum: string, disclosureDate: string): Observable<any>{
    return this.http.get<any>(`${this.url}/patients/${contactNum}/dates/${disclosureDate}`);
  }

  editPatient(contactNum: string, disclosureDate: any, formData: any): Observable<any>{
    return this.http.put<any>(`${this.url}/patients/${contactNum}/dates/${disclosureDate}`, formData);
  }

  getWhereabouts(contactNum: string, disclosureDate: any): Observable<any>{
    return this.http.get<any>(`${this.url}/patients/${contactNum}/dates/${disclosureDate}/whereabouts`);
  }

  getCloseContacts(contactNum: string, disclosureDate: any): Observable<any>{
    return this.http.get<any>(`${this.url}/patients/${contactNum}/dates/${disclosureDate}/close-contacts`);
  }

  checkIfUserIsNegative(contactNum: string): Observable<any>{
    return this.http.get<any>(`${this.url}/patients/${contactNum}/status`);
  }
  
}
