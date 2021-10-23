import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Building } from '../models/building.model';
import { Room } from '../models/room.model';

@Injectable({
  providedIn: 'root'
})
export class BuildingService {

  constructor(
    private http: HttpClient
  ) { }

  private url = "http://localhost:3000";

  getBuildings():Observable<Building[]>{
    return this.http.get<Building[]>(`${this.url}/buildings`);
  }

  addBuilding(formData: any): Observable<any>{
    return this.http.post<any>(`${this.url}/buildings`, formData)
  }

  getRooms(buildingId: number):Observable<Room[]>{
    return this.http.get<Room[]>(`${this.url}/buildings/${buildingId}/rooms`);
  }

  getRoomsPdf(buildingId: number):Observable<any>{
    return this.http.get<any>(`${this.url}/buildings/${buildingId}/rooms-pdf`);
  }

  addRoom(formData: any, buildingId: number): Observable<any>{
    return this.http.post<any>(`${this.url}/buildings/${buildingId}/rooms`, formData)
  }
}
