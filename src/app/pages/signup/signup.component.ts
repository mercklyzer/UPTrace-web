import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
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

  signupForm!:FormGroup


  constructor(
    private userService:UserService,
    private fb:FormBuilder,
    private cookieService:CookieService,
    private router: Router
  ) { }

  ngOnInit(): void {
    // this.name = this.userService.name
    // this.firstName = this.userService.firstName
    // this.lastName = this.userService.lastName
    // this.email = this.userService.email

    this.signupForm = this.fb.group({
      name: [''],
      email: [''],
      role: ['ordinary', Validators.required],

      contact_num: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(20)]],
      confirm_password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(20)]],
      start_time: ['', [Validators.required]],
      end_time: ['', [Validators.required]],
      way_of_interview: ['One at a time', [Validators.required]],
    })
  }

  verifyPassword():string{
    if(this.signupForm.get('password')?.value !== this.signupForm.get('confirm_password')?.value){
      return 'Passwords do not match'
    }
    return ''
  }

  updateFromCookie(){
    this.signupForm.patchValue({
      role: this.cookieService.get('Role'),
      name: this.cookieService.get('Name'),
      email: this.cookieService.get('Email')
    })
  }

  onSubmit(){
    this.errorMessages = getFormValidationErrors(this.signupForm)
    this.verifyPassword()? this.errorMessages.push(this.verifyPassword()) : ''
    
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
      this.cookieService.put('Token', userResponse.token);
      this.router.navigate(['/']);
    }, (err) => {
      console.log(err);
    })
  }
}
