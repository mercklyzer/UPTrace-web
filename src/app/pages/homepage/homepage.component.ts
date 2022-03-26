import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
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
  @ViewChild('closeReportModal') closeReportModal!: ElementRef;

  user!:User
  contactNum: string = "";

  reportForm!: FormGroup;

  isUserPositive: boolean = false;
  isReportFormSubmitted: boolean = false;
  isLoading: boolean = false; // Used to determine whether response from addPatient is gotten or not
  showSuccessfulDiscloseMessage: boolean = false; // This will only be true if a user has just disclosed their status

  buttonClicked: string = "";
  errorMessage: string = "";

  private subscriptions = new Subscription();
  
  constructor(
    private cookieService:CookieService,
    private fb:FormBuilder,
    private patientService:PatientService
  ) { }

  ngOnInit(): void {
    this.user = localStorage.getItem('User')? JSON.parse(localStorage.getItem('User')!) : ''

    if(this.user) {
      this.checkIfUserIsNegative(this.user.contact_num);
    }

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
      this.isLoading = true;
      this.subscriptions.add(this.patientService.addPatient(this.reportForm.value)
      .subscribe((response) => {
        console.log(response);
        this.closeModalAndRefresh();
        this.isLoading = false;
      }, (err) => {
        console.error(err.error);
        this.errorMessage = err.error.error.message;
        this.closeModalAndRefresh();
        this.isLoading = false;
      }));
    } else {
      console.log("invalid form");
    }

    console.log(this.reportForm.value);
  }

  checkIfUserIsNegative(contactNum: string): void {
    this.subscriptions.add(this.patientService.checkIfUserIsNegative(contactNum)
    .subscribe((patientRecords) => {
      console.log("patientRecords:", patientRecords);
      if(patientRecords.length > 0) {
        this.isUserPositive = true;
      }
    }, (err) => {
      console.error(err);
    }));
  }

  closeModalAndRefresh(): any {
    console.log("inside close modal and refresh");
    let closeReportModal: HTMLElement = this.closeReportModal.nativeElement;
    closeReportModal.click();
    this.showSuccessfulDiscloseMessage = true;
    this.errorMessage = "";
    this.checkIfUserIsNegative(this.user.contact_num);
  }

}
