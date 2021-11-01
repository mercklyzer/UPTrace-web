import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import * as moment from 'moment';

@Component({
  selector: 'app-patients',
  templateUrl: './patients.component.html',
  styleUrls: ['./patients.component.css']
})
export class PatientsComponent implements OnInit {
  filterForm!: FormGroup;
  datePlaceholder: string = moment().format("YYYY-MM-DD");

  constructor(
    private fb:FormBuilder,
  ) { }

  ngOnInit(): void {
    this.filterForm = this.fb.group({
      status_filter: ["All", [Validators.required]],
      date_filter: [this.datePlaceholder, [Validators.required]]
    });
  }

  datePickerConfig = {
    format: "YYYY-MM-DD",
    max: moment().format("YYYY-MM-DD")
  };

  onSubmit(): void {
    console.log(this.filterForm.value);
  }

}
