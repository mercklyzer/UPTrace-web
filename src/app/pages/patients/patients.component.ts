import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { PatientService } from 'src/app/services/patient.service';
import { Patient } from 'src/app/models/patient.model';
import * as moment from 'moment';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/models/user.model';
import { Subscription } from 'rxjs';
import { CookieService } from 'ngx-cookie';

@Component({
  selector: 'app-patients',
  templateUrl: './patients.component.html',
  styleUrls: ['./patients.component.css']
})
export class PatientsComponent implements OnInit, OnDestroy {
  filterForm!: FormGroup;
  searchForm!: FormGroup;
  reportForm!: FormGroup;

  datePlaceholder: string = moment().format("YYYY-MM-DD");
  patients: Patient[] = [];
  searchedPatient!: Patient | null;

  user!: User;
  contactTracer: string = "";
  
  filterTabSelected: boolean = false;
  isSearchFormSubmitted: boolean = false;
  isReportFormSubmitted: boolean = false;

  private subscriptions = new Subscription();

  constructor(
    private fb:FormBuilder,
    private patientService:PatientService,
    private cookieService:CookieService,
  ) { }

  ngOnInit(): void {
    this.user = JSON.parse(this.cookieService.get('User'));
    console.log(this.user);
    this.contactTracer = this.user.name;
    
    this.filterForm = this.fb.group({
      status_filter: ["all", [Validators.required]],
      date_filter: [this.datePlaceholder, [Validators.required]]
    });

    this.searchForm = this.fb.group({
      contact_num: ["", [Validators.required]]
    });

    this.reportForm = this.fb.group({
      contact_num: ['', [Validators.required]],
      contact_start_time: ['', [Validators.required]],
      contact_end_time: ['', [Validators.required]],
      way_of_interview: ['', [Validators.required]],
      condition: ['', [Validators.required]],
      onset_date: ['', [Validators.required]],
      disclosure_date: ['', [Validators.required]],
      status: ['', [Validators.required]]
    });

    this.getPatients();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  datePickerConfig = {
    format: "YYYY-MM-DD",
    max: moment().format("YYYY-MM-DD")
  };

  resetOnsetDate(): void {
    this.reportForm.controls['onset_date'].setValue('');
  }

  getPatients(): void {
    if(this.filterForm.valid) {
      console.log("valid filter form");
      this.subscriptions.add(this.patientService.getPatients(this.filterForm.value)
      .subscribe((patients) => {
        console.log(patients);
        this.patients = patients;
      }, (err) => {
        console.error(err);
      }));
    } else {
      console.log("invalid filter form");
    }
  }

  searchUser(): void {
    this.isSearchFormSubmitted = true;
    console.log("is search form valid?", this.searchForm.valid);
    console.log(this.searchForm.value.contact_num);

    if(this.searchForm.valid) {
      this.searchedPatient = null;
      this.subscriptions.add(this.patientService.getPatientByContactNum(this.searchForm.value.contact_num)
      .subscribe((patient) => {
        console.log("patient:", patient);
        if(patient === null) {
          // this.patientExists = false;
          console.log("patient doesn't exist");
        } else {
          console.log("patient exists");
          this.searchedPatient = patient;
        }
      }, (err) => {
        console.error(err);
        // this.patientExists = false;
        console.log("patient doesn't exist");
      }));
    }
  }

  onChangeStatus(event: any, patient: Patient) {
    let formData = {
      status: event.target.value
    };

    this.editPatient(patient, formData);
  }

  onChangeContactTracer(event: any, patient: Patient) {
    const formData = {
      contactTracer: event.target.value
    }

    this.editPatient(patient, formData);
  }

  addPatient() {
    this.isReportFormSubmitted = true;

    this.reportForm.patchValue({
      contact_num: this.searchedPatient?.contact_num,
      contact_start_time: this.searchedPatient?.contact_start_time,
      contact_end_time: this.searchedPatient?.contact_end_time,
      way_of_interview: this.searchedPatient?.way_of_interview,
      disclosure_date: moment().unix(),
      status: "confirmed positive"
    });

    if(this.reportForm.value.condition == "asymptomatic") {
      this.reportForm.controls['onset_date'].setValue(moment().format("YYYY-MM-DD"));
    }

    if(this.reportForm.valid) {
      console.log("valid form");
      console.log("report form:", this.reportForm.value);

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

    // console.log(this.reportForm.value);
  }

  editPatient(patient: Patient, formData: any) {
    this.subscriptions.add(this.patientService.editPatient(patient.contact_num, patient.disclosure_date, formData)
    .subscribe((response) => {
      console.log(response);
      location.reload();
    }, (err) => {
      console.error(err);
    }));
  }

  onChangeTab(state: boolean): void {
    this.filterTabSelected = state;
  }

  convertDateTime(unixTime: number): any {
    return moment.unix(unixTime).format("MM/DD/YYYY HH:mm");
  }

}
