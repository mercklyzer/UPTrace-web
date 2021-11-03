import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomepageComponent } from './pages/homepage/homepage.component';
import { SignupComponent } from './pages/signup/signup.component';
import { RoomsComponent } from './pages/rooms/rooms.component';
import { ScannerComponent } from './pages/scanner/scanner.component';
import { PatientsComponent } from './pages/patients/patients.component';
import { CloseContactsComponent } from './pages/close-contacts/close-contacts.component';
import { WhereaboutsComponent } from './pages/whereabouts/whereabouts.component';
import { LoginComponent } from './pages/login/login.component';
import { LogoutGuardService } from './services/guards/logout-guard.service';
import { DummyComponent } from './dummy/dummy.component';
import { HeloGuardService } from './services/guards/helo-guard.service';
import { UphsGuardService } from './services/guards/uphs-guard.service';
import { LoginGuardService } from './services/guards/login-guard.service';

const routes: Routes = [
  {path: '', component: HomepageComponent, pathMatch:'full'},
  {path: 'dummy', component: DummyComponent, pathMatch:'full'},
  {path: 'signup', component:SignupComponent, canActivate: [LogoutGuardService], pathMatch: 'full'},
  {path: 'login', component:LoginComponent, canActivate: [LogoutGuardService], pathMatch: 'full'},
  {path: 'rooms', component:RoomsComponent, canActivate:[HeloGuardService], pathMatch: 'full'},
  {path: 'scanner', component:ScannerComponent, canActivate:[LoginGuardService], pathMatch: 'full'},
  {path: 'patients', component:PatientsComponent, canActivate:[UphsGuardService], pathMatch: 'full'},
  {path: 'patients/:patientContactNum/dates/:disclosureDate/whereabouts', canActivate:[UphsGuardService], component:WhereaboutsComponent},
  {path: 'patients/:patientContactNum/dates/:disclosureDate/close-contacts', canActivate:[UphsGuardService], component:CloseContactsComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
