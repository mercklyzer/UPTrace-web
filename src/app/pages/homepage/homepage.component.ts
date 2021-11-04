import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { PatientService } from 'src/app/services/patient.service';
import * as moment from 'moment';
import { User } from 'src/app/models/user.model';
import { UserService } from 'src/app/services/user.service';
import { Subscription } from 'rxjs';
import { CookieService } from 'ngx-cookie';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})
export class HomepageComponent implements OnInit, OnDestroy {
  user!:User
  contactNum: string = "";

  reportForm!: FormGroup;

  isUserPositive: boolean = false;
  isReportFormSubmitted: boolean = false;

  buttonClicked: string = "";

  private subscriptions = new Subscription();
  
  constructor(
    private cookieService:CookieService,
    private fb:FormBuilder,
    private patientService:PatientService
  ) { }

  ngOnInit(): void {
    this.user = this.cookieService.get('User')? JSON.parse(this.cookieService.get('User')) : ''

    this.reportForm = this.fb.group({
      condition: ['', [Validators.required]],
      onset_date: ['', [Validators.required]],
      disclosure_date: ['', [Validators.required]],
      status: ['', [Validators.required]]
    });
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  datePickerConfig = {
    format: "YYYY-MM-DD",
    max: moment().format("YYYY-MM-DD")
  };

  onClickButton(status: string): void {
    this.reportForm.controls['status'].setValue(status);
    
    if(status === "suspected") {
      this.buttonClicked = "I suspect to be positive";
    } else if(status === "disclosed positive") {
      this.buttonClicked = "I tested positive";
    }
  }

  resetOnsetDate(): void {
    this.reportForm.controls['onset_date'].setValue('');
  }

  onSubmit(): void {
    this.isReportFormSubmitted = true;

    this.reportForm.controls['disclosure_date'].setValue(moment().unix());

    if(this.reportForm.value.condition == "asymptomatic") {
      this.reportForm.controls['onset_date'].setValue(moment().format("YYYY-MM-DD"));
    }

    if(this.reportForm.valid) {
      console.log("valid form");
      this.subscriptions.add(this.patientService.addPatient(this.reportForm.value)
      .subscribe((response) => {
        console.log(response);
        location.reload();
      }, (err) => {
        console.error(err);
      }));
    } else {
      console.log("invalid form");
    }

    console.log(this.reportForm.value);
  }

  checkIfUserIsNegative(contactNum: string): void {
    this.subscriptions.add(this.patientService.checkIfUserIsNegative(contactNum)
    .subscribe((patientRecords) => {
      if(patientRecords.length > 0) {
        this.isUserPositive = true;
      }
    }, (err) => {
      console.error(err);
    }));
  }

}
