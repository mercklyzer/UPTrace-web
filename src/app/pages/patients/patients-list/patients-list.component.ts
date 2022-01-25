import { Component, OnInit, OnDestroy, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { PatientService } from 'src/app/services/patient.service';
import { Patient } from 'src/app/models/patient.model';
import { User } from 'src/app/models/user.model';

import * as moment from 'moment';
import { Subscription } from 'rxjs';
import { CookieService } from 'ngx-cookie';

@Component({
  selector: 'app-patients-list',
  templateUrl: './patients-list.component.html',
  styleUrls: ['./patients-list.component.css']
})
export class PatientsListComponent implements OnInit, OnDestroy {
  @Input() patients: Patient[] = [];
  @Input() searchedPatient!: Patient | null;
  @Input() tabSelected!: string;
  @Input() isLoading: boolean = false;
  @Output() getPatients: EventEmitter<any> = new EventEmitter();
  @ViewChild('closeConfirmModal') closeConfirmModal!: ElementRef;
  
  reportForm!: FormGroup;

  user!: User;

  patientContacted!: Patient;
  patientClicked!: Patient;
  contactTracer: string = "";
  errorMessage: string = "";
  datePlaceholder: string = moment().format("YYYY-MM-DD");
  
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

  onChangeStatus(event: any, patient: Patient) {
    let formData = {
      status: event.target.value
    };

    this.editPatient(patient, formData);
  }

  onClickCheckbox() {
    console.log("checkbox is clicked");
    let closeConfirmModal: HTMLElement = this.closeConfirmModal.nativeElement;
    closeConfirmModal.click();
  }

  onChangeContactTracer(event: any) {
    console.log("on change contact tracer clicked");
    const formData = {
      // contactTracer: event.target.value
      contactTracer: this.contactTracer
    };

    this.editPatient(this.patientClicked, formData);
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
    console.log("inside edit patient");
    console.log("formData:", formData);

    this.subscriptions.add(this.patientService.editPatient(patient.contact_num, patient.disclosure_date, formData)
    .subscribe((response) => {
      console.log(response);
      this.closeModalAndRefresh();
    }, (err) => {
      this.errorMessage = err.error.error.message;
      setTimeout(() => {
        this.closeModalAndRefresh();
      }, 5000);
    }));
  }

  convertDateTime(unixTime: number): any {
    return moment.unix(unixTime).format("MM/DD/YYYY HH:mm");
  }

  convertDate(unixTime: number): any {
    return moment.unix(unixTime).format("MM/DD/YYYY");
  }

  setPatientClicked(patient: Patient): any {
    this.patientClicked = patient;
    console.log("set patient clicked to:", this.patientClicked);
  }

  closeModalAndRefresh(): any {
    console.log("inside close modal and refresh");
    let closeConfirmModal: HTMLElement = this.closeConfirmModal.nativeElement;
    closeConfirmModal.click();
    this.errorMessage = "";
    // location.reload(); // Do not refresh whole page, just update the table using the event emitter below
    this.getPatients.emit();
  }
}
