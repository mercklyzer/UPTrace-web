import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { GoogleLoginProvider, SocialAuthService } from 'angularx-social-login';
import { CookieService } from 'ngx-cookie';
import { GoogleService } from '../services/google.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-google',
  templateUrl: './google.component.html',
  styleUrls: ['./google.component.css']
})
export class GoogleComponent implements OnInit {
  @Output() googleEmit = new EventEmitter<any>()


  constructor(
    private socialAuthService: SocialAuthService,
    private router:Router,
    private userService:UserService,
    private googleService:GoogleService,
    private cookieService:CookieService
  ) { }

  ngOnInit(): void {
  }

  loginWithGoogle(){
    console.log("login");
    
    this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID)
      .then((socialUser) => {
        this.userService.firstName = socialUser.firstName
        this.userService.lastName = socialUser.lastName
        this.userService.name = socialUser.name
        this.userService.email = socialUser.email
        
        this.googleService.idToken = socialUser.idToken
        this.googleService.verifyUser({token: this.googleService.idToken})
        .subscribe((res) => {

          this.cookieService.put('Role', res.role)
          this.cookieService.put('Email', res.email)
          this.cookieService.put('Name', `${this.userService.firstName} ${this.userService.lastName}`)

          if(res.message === 'signup'){
            console.log(res);
            this.googleEmit.emit();
            // this.router.navigate(['/signup']);
          }
          else if(res.message === 'login'){
            console.log("GO TO LOGIN PAGE")
          }
        }, (err) => {
          console.error(err.error)
        })
      }
      );
  }

}
