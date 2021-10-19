import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GoogleLoginProvider, SocialAuthService } from 'angularx-social-login';
import { GoogleService } from '../services/google.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  constructor(
    private socialAuthService: SocialAuthService,
    private router:Router,
    private userService:UserService,
    private googleService:GoogleService
  ) { }

  ngOnInit(): void {
  }

  loginWithGoogle(){
    this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID)
      .then((socialUser) => {
        this.userService.firstName = socialUser.firstName
        this.userService.lastName = socialUser.lastName
        this.userService.name = socialUser.name
        this.userService.email = socialUser.email
        
        this.googleService.idToken = socialUser.idToken
        this.googleService.verifyUser({token: this.googleService.idToken})
        .subscribe((res) => {
          if(res.message === 'signup'){
            console.log(res);
            this.router.navigate(['/signup'])
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
