import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import {
  GoogleLoginProvider,
  SocialLoginModule
} from 'angularx-social-login';

import { CookieModule } from 'ngx-cookie';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { HomepageComponent } from './pages/homepage/homepage.component';
import { SignupComponent } from './pages/signup/signup.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    HomepageComponent,
    SignupComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SocialLoginModule,
    ReactiveFormsModule,
    HttpClientModule,
    CookieModule.forRoot(),
  ],
  providers: [{
    provide: 'SocialAuthServiceConfig',
    useValue: {
      autoLogin: true, //keeps the user signed in
      providers: [
        {
          id: GoogleLoginProvider.PROVIDER_ID,
          provider: new GoogleLoginProvider('14528913880-6kiq2nc8n5us1bt820ed1srtsk569oj1.apps.googleusercontent.com')
        }
      ]
    }
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
