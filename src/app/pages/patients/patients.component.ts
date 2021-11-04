import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { PatientService } from 'src/app/services/patient.service';
import { Patient } from 'src/app/models/patient.model';
import * as moment from 'moment';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/models/user.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-patients',
  templateUrl: './patients.component.html',
  styleUrls: ['./patients.component.css']
})
export class PatientsComponent implements OnInit, OnDestroy {
  filterForm!: FormGroup;
  datePlaceholder: string = moment().format("YYYY-MM-DD");
  patients: Patient[] = [];
  user!: User;
  contactTracer: string = "";

  private subscriptions = new Subscription();

  constructor(
    private fb:FormBuilder,
    private patientService:PatientService,
    private userService:UserService,
  ) { }

  ngOnInit(): void {
    this.user = this.userService.user;
    console.log(this.user);
    this.contactTracer = this.userService.user.name;
    console.log(this.contactTracer);
    this.filterForm = this.fb.group({
      status_filter: ["all", [Validators.required]],
      date_filter: [this.datePlaceholder, [Validators.required]]
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

  getPatients(): void {
    if(this.filterForm.valid) {
      console.log("valid form");
      this.subscriptions.add(this.patientService.getPatients(this.filterForm.value)
      .subscribe((patients) => {
        console.log(patients);
        this.patients = patients;
      }, (err) => {
        console.error(err);
      }));
    } else {
      console.log("invalid form");
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

  editPatient(patient: Patient, formData: any) {
    this.subscriptions.add(this.patientService.editPatient(patient.contact_num, patient.disclosure_date, formData)
    .subscribe((response) => {
      console.log(response);
      location.reload();
    }, (err) => {
      console.error(err);
    }));
  }
}
