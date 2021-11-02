import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import {
  GoogleLoginProvider,
  SocialLoginModule
} from 'angularx-social-login';

import { ZXingScannerModule } from '@zxing/ngx-scanner';
import { DpDatePickerModule } from 'ng2-date-picker';

import { CookieModule } from 'ngx-cookie';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { HomepageComponent } from './pages/homepage/homepage.component';
import { SignupComponent } from './pages/signup/signup.component';
import { Interceptor } from './interceptor';
import { RoomsComponent } from './pages/rooms/rooms.component';
import { ScannerComponent } from './pages/scanner/scanner.component';
import { PatientsComponent } from './pages/patients/patients.component';
import { CloseContactsComponent } from './pages/close-contacts/close-contacts.component';
import { WhereaboutsComponent } from './pages/whereabouts/whereabouts.component';
import { ExcelService } from './services/excel.service';
import { GoogleComponent } from './google/google.component';
import { LoginComponent } from './pages/login/login.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    HomepageComponent,
    SignupComponent,
    RoomsComponent,
    ScannerComponent,
    PatientsComponent,
    CloseContactsComponent,
    WhereaboutsComponent,
    GoogleComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SocialLoginModule,
    ReactiveFormsModule,
    HttpClientModule,
    CookieModule.forRoot(),
    ZXingScannerModule,
    DpDatePickerModule,
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
  }, {
    provide: HTTP_INTERCEPTORS,
    useClass: Interceptor,
    multi: true
  },
  ExcelService],
  bootstrap: [AppComponent]
})
export class AppModule { }
