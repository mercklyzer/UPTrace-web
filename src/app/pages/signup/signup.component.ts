import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SocialAuthService } from 'angularx-social-login';
import { CookieService } from 'ngx-cookie';
import { User } from 'src/app/models/user.model';
import { Subscription } from 'rxjs';
import { DepartmentService } from 'src/app/services/department.service';
import { UserService } from 'src/app/services/user.service';
import { getFormValidationErrors } from 'src/app/utils/errorhandling';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit, OnDestroy {
  @ViewChild('triggerModal') triggerModal!: ElementRef;

  errorMessages:string[] = []

  signupForm!:FormGroup

  user!:User
  unregisteredUser!:User

  private subscriptions = new Subscription();

  constructor(
    private userService:UserService,
    private fb:FormBuilder,
    private cookieService:CookieService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.unregisteredUser = this.cookieService.get('Unregistered User')? JSON.parse(this.cookieService.get('Unregistered User')) : ''


    this.signupForm = this.fb.group({
      name: [this.unregisteredUser['name']],
      email: [this.unregisteredUser['email']],
      role: [this.unregisteredUser['role']? this.unregisteredUser['role'] : 'ordinary', Validators.required],

      contact_num: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(20)]],
      confirm_password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(20)]],
      start_time: ['', [Validators.required]],
      end_time: ['', [Validators.required]],
      way_of_interview: ['One at a time', [Validators.required]],
    })
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  verifyPassword():string{
    if(this.signupForm.get('password')?.value !== this.signupForm.get('confirm_password')?.value){
      return 'Passwords do not match'
    }
    return ''
  }

  updateFromService(){
    this.unregisteredUser = JSON.parse(this.cookieService.get('Unregistered User'))

    this.signupForm.patchValue({
      role: this.unregisteredUser['role'],
      name: this.unregisteredUser['name'],
      email: this.unregisteredUser['email']
    })
  }

  updateGoogleError(error:string){
    this.errorMessages.push(error)
  }

  verifyTime(){
    if (this.signupForm.get('start_time')?.value >= this.signupForm.get('end_time')?.value){
      console.log("time error");
      return 'Preferred contact start time should be earlier than preferred contact end time.'
    }
    return ''
  }

  generateOtp(){
    this.errorMessages = getFormValidationErrors(this.signupForm)
    this.verifyPassword()? this.errorMessages.push(this.verifyPassword()) : ''
    this.verifyTime()? this.errorMessages.push(this.verifyTime()) : ''

    if(this.errorMessages.length !== 0){
      console.log(this.errorMessages);
    }

    if(this.errorMessages.length === 0){
      this.userService.generateOtp(this.signupForm.value)
      .subscribe(res => {
          console.log(res);
      })
    }

  }

  onSubmit(){
    this.errorMessages = getFormValidationErrors(this.signupForm)
    this.verifyPassword()? this.errorMessages.push(this.verifyPassword()) : ''
    this.verifyTime()? this.errorMessages.push(this.verifyTime()) : ''
    
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
    this.subscriptions.add(this.userService.signupUser(this.signupForm.value)
    .subscribe((userResponse) => {
      console.log(userResponse);
      this.cookieService.put('Token', userResponse.token);
      this.cookieService.put('User', JSON.stringify(userResponse.user))
      this.cookieService.remove('Unregisterd User')

      this.router.navigate(['/']);
    }, (err) => {
      this.errorMessages.push(err.error.error.message)
      console.log(err);
    }))
  }
}
