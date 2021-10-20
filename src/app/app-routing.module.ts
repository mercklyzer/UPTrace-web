import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomepageComponent } from './pages/homepage/homepage.component';
import { SignupComponent } from './pages/signup/signup.component';
import { RoomsComponent } from './pages/rooms/rooms.component';

const routes: Routes = [
  {path: '', component: HomepageComponent, pathMatch:'full'},
  {path: 'signup', component:SignupComponent, pathMatch: 'full'},
  {path: 'rooms', component:RoomsComponent, pathMatch: 'full'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
