import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GoogleLoginProvider, SocialAuthService } from 'angularx-social-login';
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
    private userService:UserService
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
        
        this.router.navigate(['/signup'])
      }
      );
  }

}
