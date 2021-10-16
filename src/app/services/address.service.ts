import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Barangay } from '../models/barangay.model';
import { City } from '../models/city.model';
import { Province } from '../models/province.model';
import { Region } from '../models/region.model';

@Injectable({
  providedIn: 'root'
})
export class AddressService {

  constructor(
    private http: HttpClient
  ) { }

  private url = 'https://isaacdarcilla.github.io/philippine-addresses'

  getRegions():Observable<Region[]>{
    return this.http.get<Region[]>(`${this.url}/region.json`)
  }

  getProvinces():Observable<Province[]>{
    return this.http.get<Province[]>(`${this.url}/province.json`)
  }

  getCities():Observable<City[]>{
    return this.http.get<City[]>(`${this.url}/city.json`)
  }

  getBarangays():Observable<Barangay[]>{
    return this.http.get<Barangay[]>(`${this.url}/barangay.json`)
  }
}
