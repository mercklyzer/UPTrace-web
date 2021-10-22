import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SocialAuthService } from 'angularx-social-login';
import { CookieService } from 'ngx-cookie';
import { Barangay } from 'src/app/models/barangay.model';
import { City } from 'src/app/models/city.model';
import { Province } from 'src/app/models/province.model';
import { Region } from 'src/app/models/region.model';
import { AddressService } from 'src/app/services/address.service';
import { DepartmentService } from 'src/app/services/department.service';
import { UserService } from 'src/app/services/user.service';
import { getFormValidationErrors } from 'src/app/utils/errorhandling';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  @ViewChild('triggerModal') triggerModal!: ElementRef;

  errorMessages:string[] = []

  name:string = ''
  firstName:string = ''
  lastName:string = ''
  email:string = ''

  signupForm!:FormGroup

  departments:string[] = []

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
    private addressService:AddressService,
    private deparmentService:DepartmentService,
    private cookieService:CookieService
  ) { }

  ngOnInit(): void {
    this.name = this.userService.name
    this.firstName = this.userService.firstName
    this.lastName = this.userService.lastName
    this.email = this.userService.email

    this.signupForm = this.fb.group({
      email: [this.email, [Validators.required]],
      contact_num: ['', [Validators.required]],
      
      department: ['', [Validators.required]],

      address: this.fb.group({
        region: ['', [Validators.required]],
        province: ['', [Validators.required]],
        city: ['', [Validators.required]],
        barangay: ['', [Validators.required]],
        street: ['', [Validators.required]]
      })
    })

    this.getAllDepartments()
    this.getAllRegions()
    this.getAllProvinces()
    this.getAllCities()
    this.getAllBarangays()
  }

  getAllDepartments(){
    this.deparmentService.getDepartments()
    .subscribe((departments) => {
      this.departments = departments
    })
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

  public get addressGroup():FormGroup{
    return this.signupForm.get('address') as FormGroup
  }

  onSubmit(){
    this.errorMessages = getFormValidationErrors(this.signupForm)
    this.errorMessages = this.errorMessages.concat(getFormValidationErrors(this.addressGroup))
    
    if(this.errorMessages.length != 0){
      console.log(this.errorMessages);
    }
    if(this.errorMessages.length === 0){
      let signupModal: HTMLElement = this.triggerModal.nativeElement;
      signupModal.click();

      console.log(this.signupForm.value);
    }
    else{
      console.log(this.errorMessages);
    }
  }

  onAgree() {
    this.userService.signupUser(this.signupForm.value)
    .subscribe((userResponse) => {
      console.log(userResponse);
      this.cookieService.put('Token', userResponse.token)
    }, (err) => {
      console.log(err);
    })
  }
}
