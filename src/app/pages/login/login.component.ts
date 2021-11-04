import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
      contact_num: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(20)]],
    })
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
        this.userService.user = {...this.userService.user, ...userResponse.user}
        console.log(this.userService.user);
        this.router.navigate(['/']);
      }, (err) => {
        this.errorMessages.push(err.error.error.message)
        console.log(err);
      }))
    }
  }
}
