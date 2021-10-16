import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SocialAuthService } from 'angularx-social-login';
import { Barangay } from 'src/app/models/barangay.model';
import { City } from 'src/app/models/city.model';
import { Province } from 'src/app/models/province.model';
import { Region } from 'src/app/models/region.model';
import { AddressService } from 'src/app/services/address.service';
import { UserService } from 'src/app/services/user.service';


@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  name:string = ''
  firstName:string = ''
  lastName:string = ''
  email:string = ''

  signupForm!:FormGroup

  regions:Region[] = []

  allProvinces:Province[] = []
  allCities:City[] = []
  allBarangays:Barangay[] = []

  provinces:Province[] = []
  cities:City[] = []
  barangays:Barangay[] = []

  constructor(
    private userService:UserService,
    private fb:FormBuilder,
    private addressService:AddressService
  ) { }

  ngOnInit(): void {
    this.name = this.userService.name
    this.firstName = this.userService.firstName
    this.lastName = this.userService.lastName
    this.email = this.userService.email

    this.signupForm = this.fb.group({
      firstName: [this.firstName],
      lastName: [this.lastName],
      email: [this.email],
      
      department: [''],

      address: this.fb.group({
        region: [''],
        province: [''],
        city: [''],
        barangay: [''],
        street: ['']
      })
    })

    this.getAllRegions()
    this.getAllProvinces()
    this.getAllCities()
    this.getAllBarangays()

  }

  getAllRegions(){
    this.addressService.getRegions()
    .subscribe(data => {
      this.regions = data
    })
  }

  getAllProvinces(){
    this.addressService.getProvinces()
    .subscribe(data => {
      this.allProvinces = data
    })
  }

  getAllCities(){
    this.addressService.getCities()
    .subscribe(data => {
      this.allCities = data
    })
  }

  getAllBarangays(){
    this.addressService.getBarangays()
    .subscribe(data => {
      this.allBarangays = data
    })
  }

  getRegionCode(regionName:string){
    return this.regions.filter((region) => region.region_name === regionName)[0].region_code
  }

  getProvinceCode(provinceName:string){
    return this.provinces.filter((province) => province.province_name === provinceName)[0].province_code
  }

  getCityCode(cityName:string){
    return this.cities.filter((city) => city.city_name === cityName)[0].city_code
  }

  filterProvinces(input:any){
    let regionCode = this.getRegionCode(input.target.value)
    this.provinces = this.allProvinces.filter(province => province.region_code === regionCode)

    this.cities = []
    this.barangays = []

    this.signupForm.get('address')?.patchValue({
        province: '',
        city: '',
        barangay: '',
        street: ''
    })

    console.log(this.signupForm.value);
  }

  filterCities(input:any){
    let provinceCode = this.getProvinceCode(input.target.value)
    this.cities = this.allCities.filter(city => city.province_code === provinceCode)

    this.barangays = []

    this.signupForm.get('address')?.patchValue({
      city: '',
      barangay: '',
      street: ''
    })
  }

  filterBarangays(input:any){
    let cityCode = this.getCityCode(input.target.value)
    this.barangays = this.allBarangays.filter(barangay => barangay.city_code === cityCode)

    this.signupForm.get('address')?.patchValue({
      barangay: '',
      street: ''
    })
  }

  onSubmit(){
    console.log(this.signupForm.value);
  }




}
