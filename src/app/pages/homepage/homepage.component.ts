import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { CookieService } from 'ngx-cookie';
import * as moment from 'moment';
import jwt_decode from 'jwt-decode';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})
export class HomepageComponent implements OnInit {
  userToken: any;
  decodedToken: any;
  contactNumber: string = "";

  reportForm!: FormGroup;

  isReportFormSubmitted: boolean = false;

  buttonClicked: string = "";

  constructor(
    private cookieService:CookieService,
    private fb:FormBuilder,
  ) { }

  ngOnInit(): void {
    this.userToken = this.cookieService.get('Token');
    if(this.userToken) {
      this.decodedToken = jwt_decode(this.userToken);
      // this.contactNumber = this.decodedToken.sub;
    }

    this.reportForm = this.fb.group({
      symptomatic: ['', [Validators.required]],
      onset_date: ['', [Validators.required]],
      disclosure_date: ['', [Validators.required]],
      status: ['', [Validators.required]]
    });
  }

  datePickerConfig = {
    format: "YYYY-MM-DD",
    max: moment().format("YYYY-MM-DD")
  };

  onClickButton(status: string): void {
    this.reportForm.controls['status'].setValue(status);
    
    if(status === "SUSPECTED") {
      this.buttonClicked = "I suspect to be positive";
    } else if(status === "DISCLOSED POSITIVE") {
      this.buttonClicked = "I tested positive";
    }
  }

  resetOnsetDate(): void {
    this.reportForm.controls['onset_date'].setValue('');
  }

  onSubmit(): void {
    this.isReportFormSubmitted = true;

    this.reportForm.controls['disclosure_date'].setValue(moment().format("YYYY-MM-DD"));

    if(this.reportForm.value.symptomatic == "0") {
      this.reportForm.controls['onset_date'].setValue(moment().format("YYYY-MM-DD"));
    }

    if(this.reportForm.valid) {
      console.log("valid form");
    } else {
      console.log("invalid form");
    }

    console.log(this.reportForm.value);
  }

}
