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
  @Output() googleError = new EventEmitter<any>()


  constructor(
    private socialAuthService: SocialAuthService,
    private router:Router,
    private googleService:GoogleService,
    private cookieService:CookieService
  ) { }

  ngOnInit(): void {
  }

  loginWithGoogle(){
    
    this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID)
      .then((socialUser) => {
       
        this.googleService.idToken = socialUser.idToken
        this.googleService.verifyUser({token: this.googleService.idToken})
        .subscribe((res) => {
          console.log(res);
          if(res.message === 'signup'){

            let unregisteredUser = {
              role: res.role,
              email: res.email,
              name: socialUser.firstName + ' ' + socialUser.lastName
            }

            localStorage.setItem('Unregistered User', JSON.stringify(unregisteredUser))

            console.log(res);
            this.googleEmit.emit();
            this.router.navigate(['/signup']);
          }

          else if(res.message === 'login'){
            console.log("GO TO LOGIN PAGE")
            localStorage.setItem('Token', res.token);
            localStorage.setItem('User', JSON.stringify(res.user))

            this.router.navigate(['/']);
          }
        }, (err) => {
          this.googleError.emit(err.error.error)
          console.error(err.error)
        })
      }
      );
  }

}
