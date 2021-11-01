import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import * as moment from 'moment';
import { PatientService } from 'src/app/services/patient.service';

@Component({
  selector: 'app-patients',
  templateUrl: './patients.component.html',
  styleUrls: ['./patients.component.css']
})
export class PatientsComponent implements OnInit {
  filterForm!: FormGroup;
  datePlaceholder: string = moment().format("YYYY-MM-DD");
  patients: any[] = [];

  constructor(
    private fb:FormBuilder,
    private patientService:PatientService
  ) { }

  ngOnInit(): void {
    this.filterForm = this.fb.group({
      status_filter: ["all", [Validators.required]],
      date_filter: [this.datePlaceholder, [Validators.required]]
    });

    this.getPatients();
  }

  datePickerConfig = {
    format: "YYYY-MM-DD",
    max: moment().format("YYYY-MM-DD")
  };

  getPatients(): void {
    // console.log(this.filterForm.value);

    if(this.filterForm.valid) {
      console.log("valid form");
      this.patientService.getPatients(this.filterForm.value)
      .subscribe((patients) => {
        console.log(patients);
        this.patients = patients;
      }, (err) => {
        console.error(err);
      });
    } else {
      console.log("invalid form");
    }
  }

  onChangeStatus(event: any, patient: any) {
    let formData = {
      status: event.target.value
    };

    this.editPatient(patient, formData);
  }

  onChangeContactTracer(event: any, patient: any) {
    const formData = {
      contactTracer: event.target.value
    }

    console.log("formData:", formData);

    this.editPatient(patient, formData);
  }

  editPatient(patient: any, formData: any) {
    this.patientService.editPatient(patient.contact_num, patient.disclosure_date, formData)
    .subscribe((response) => {
      console.log(response);
      location.reload();
    }, (err) => {
      console.error(err);
    });
  }
}
