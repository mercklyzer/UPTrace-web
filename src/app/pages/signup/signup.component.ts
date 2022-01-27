import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SocialAuthService } from 'angularx-social-login';
import { CookieService } from 'ngx-cookie';
import { User } from 'src/app/models/user.model';
import { Subscription } from 'rxjs';
import { DepartmentService } from 'src/app/services/department.service';
import { UserService } from 'src/app/services/user.service';
import { getFormValidationErrors } from 'src/app/utils/errorhandling';
import * as moment from 'moment-timezone'

declare var bootstrap: any;

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit, OnDestroy {
  @ViewChild('triggerModal') triggerModal!: ElementRef;

  otpErrorMessages:string[] = ['OTP does not match.', 'OTP already expired.']
  errorMessages:string[] = []
  showOtpForm:boolean = false
  timeLeft:number = 0
  countdownInterval:any


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

      contact_num: ['', [Validators.required, regexValidator(/^(09)\d{9}$/)]],
      password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(20), regexValidator(/^([a-zA-Z0-9!@#$%^&*()_+\-=\[\]\\;:'",./?]{8,20})$/)]],
      confirm_password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(20), regexValidator(/^([a-zA-Z0-9!@#$%^&*()_+\-=\[\]\\;:'",./?]{8,20})$/)]],
      start_time: ['', [Validators.required]],
      end_time: ['', [Validators.required]],
      way_of_interview: ['One at a time', [Validators.required]],

      otp: ['', []]
    })

    // Bootstrap tooltip initialization
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
      return new bootstrap.Tooltip(tooltipTriggerEl)
    })
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
    clearInterval(this.countdownInterval);
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

  countdownOtp(res:any, err:any){
    clearInterval(this.countdownInterval)
    this.showOtpForm = true
    this.timeLeft = 0
    let otpExpiresIn:any 

      this.countdownInterval = setInterval(() => {
        let timeNow = moment().tz('Asia/Manila').unix()
        if(res){
          otpExpiresIn = res.expiresIn
        }
        else if(err){
          otpExpiresIn = err.error.error.message.expiresIn
        }

        this.timeLeft = otpExpiresIn - timeNow

        if(this.timeLeft <= 0){
            clearInterval(this.countdownInterval)
            return
        }        
        console.log("counting down");
      }, 1000)
  }

  generateOtp(){
    if(this.errorMessages.length !== 0){
      console.log(this.errorMessages);
    }

    if(this.errorMessages.length === 0 || (this.errorMessages.length === 1 && this.otpErrorMessages.includes(this.errorMessages[0]))){
      this.userService.generateOtp(this.signupForm.value)
      .subscribe(res => {
        this.showOtpForm = true
        this.countdownOtp(res,null)
        console.log(res);
      }, err => {
        console.log(err.error.error.message.message);
        if(err.error.error.message.message === 'You can request again after 5 minutes.'){
          this.countdownOtp(null, err)
        }
        else{
          this.errorMessages.push(err.error.error.message.message)
          window.scroll({ 
            top: 0, 
            left: 0, 
            behavior: 'smooth' 
          });
        }
      })
    }

  }

  onSubmit(){
    this.errorMessages = getFormValidationErrors(this.signupForm)
    this.verifyPassword()? this.errorMessages.push(this.verifyPassword()) : ''
    this.verifyTime()? this.errorMessages.push(this.verifyTime()) : ''
    
    if(this.errorMessages.length !== 0){
      console.log(this.errorMessages);
      window.scroll({ 
        top: 0, 
        left: 0, 
        behavior: 'smooth' 
      });
    }
    if(this.errorMessages.length === 0){

      console.log(this.signupForm.get('otp')?.value);

        if(this.signupForm.get('otp')?.value === ''){
          this.generateOtp()
        }
        else{
          let signupModal: HTMLElement = this.triggerModal.nativeElement;
          signupModal.click();
        }
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

function regexValidator(nameRe: RegExp): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const reject = !nameRe.test(control.value);
    return reject ? {pattern: {value: control.value}} : null;
  };
}