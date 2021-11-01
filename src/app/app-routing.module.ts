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

const routes: Routes = [
  {path: '', component: HomepageComponent, pathMatch:'full'},
  {path: 'signup', component:SignupComponent, pathMatch: 'full'},
  {path: 'login', component:LoginComponent, pathMatch: 'full'},
  {path: 'rooms', component:RoomsComponent, pathMatch: 'full'},
  {path: 'scanner', component:ScannerComponent, pathMatch: 'full'},
  {path: 'patients', component:PatientsComponent, pathMatch: 'full'},
  {path: 'close-contacts', component:CloseContactsComponent, pathMatch: 'full'},
  {path: 'whereabouts', component:WhereaboutsComponent, pathMatch: 'full'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
