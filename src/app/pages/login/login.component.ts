import { Component, OnInit, OnDestroy } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie';
import { Subscription } from 'rxjs';
import { UserService } from 'src/app/services/user.service';
import { getFormValidationErrors } from 'src/app/utils/errorhandling';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {
  private subscriptions = new Subscription();

  constructor(
    private userService:UserService,
    private fb:FormBuilder,
    private cookieService:CookieService,
    private router: Router
  ) { }

  loginForm!:FormGroup

  errorMessages:string[] = []

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      contact_num: ['', [Validators.required, regexValidator(/^(09)\d{9}$/)]],
      password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(20), regexValidator(/^([a-zA-Z0-9!@#$%^&*()_+\-=\[\]\\;:'",./?]{8,20})$/)]],
    })
  }

  updateGoogleError(error:string){
    this.errorMessages.push(error)
  }
  
  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  onSubmit(){
    this.errorMessages = getFormValidationErrors(this.loginForm)
    
    if(this.errorMessages.length != 0){
      console.log(this.errorMessages);
    }
    else{
      this.subscriptions.add(this.userService.loginUser(this.loginForm.value)
      .subscribe((userResponse) => {
        console.log(userResponse);
        this.cookieService.put('Token', userResponse.token);
        this.cookieService.put('User', JSON.stringify(userResponse.user))
        this.router.navigate(['/']);
      }, (err) => {
        this.errorMessages.push(err.error.error.message)
        window.scroll({ 
          top: 0, 
          left: 0, 
          behavior: 'smooth' 
        });
        console.log(err);
      }))
    }
  }
}

function regexValidator(nameRe: RegExp): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const reject = !nameRe.test(control.value);
    return reject ? {pattern: {value: control.value}} : null;
  };
}