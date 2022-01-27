import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { PatientService } from 'src/app/services/patient.service';
import { ExcelService } from 'src/app/services/excel.service';
import { Patient } from 'src/app/models/patient.model';
import { User } from 'src/app/models/user.model';

import * as moment from 'moment-timezone';
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

  datePlaceholder: string = moment().tz('Asia/Manila').format("YYYY-MM-DD");
  dateFiltered: string = "";
  patients: Patient[] = [];
  searchedPatient!: Patient | null;

  user!: User;
  contactTracer: string = "";
  
  isFilterTabSelected: boolean = true;
  isSearchFormSubmitted: boolean = false;
  isLoading: boolean = false;

  private subscriptions = new Subscription();

  constructor(
    private fb:FormBuilder,
    private patientService:PatientService,
    private cookieService:CookieService,
    private excelService:ExcelService
  ) { }

  ngOnInit(): void {
    this.user = JSON.parse(this.cookieService.get('User'));
    console.log(this.user);
    this.contactTracer = this.user.name;
    
    this.filterForm = this.fb.group({
      status_filter: ["all", [Validators.required]],
      date_filter: [this.datePlaceholder, [Validators.required]],
      show_assigned_patients_filter: [false, [Validators.required]]
    });

    this.searchForm = this.fb.group({
      contact_num: ["", [Validators.required]]
    });

    this.getPatients();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  datePickerConfig = {
    format: "YYYY-MM-DD",
    max: moment().tz('Asia/Manila').format("YYYY-MM-DD")
  };

  getPatients(): void {
    this.isLoading = true;
    console.log("filter form:", this.filterForm.value);
    this.dateFiltered = this.filterForm.value.date_filter;
    if(this.filterForm.valid) {
      console.log("valid filter form");
      this.subscriptions.add(this.patientService.getPatients(this.filterForm.value)
      .subscribe((patients) => {
        console.log("patients:", patients);
        this.patients = patients;
      }, (err) => {
        console.error(err);
      }));
    } else {
      console.log("invalid filter form");
    }
    this.isLoading = false;
  }

  searchUser(): void {
    this.isSearchFormSubmitted = true;
    console.log("is search form valid?", this.searchForm.valid);
    console.log(this.searchForm.value.contact_num);

    if(this.searchForm.valid) {
      this.isLoading = true;
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
      this.isLoading = false;
    }
  }

  onChangeTab(state: boolean): void {
    this.isFilterTabSelected = state;
  }

  convertDate(unixTime: number): any {
    return moment.unix(unixTime).format("MM/DD/YYYY");
  }

  convertDateTime(unixTime: number): any {
    return moment.unix(unixTime).format("MM/DD/YYYY HH:mm");
  }

  exportAsXLSX(): void {
    let patientsCopy = this.patients;
    
    // Convert disclosure_date and onset_date from bigint format to readable dates
    patientsCopy.filter((patient: Patient) => {
      patient.disclosure_date = this.convertDateTime(patient.disclosure_date);
      if(patient.onset_date) {
        patient.onset_date = this.convertDate(patient.onset_date);
      }
    });
    this.excelService.exportAsExcelFile(patientsCopy, `${this.dateFiltered}_patients`);
  }
}
