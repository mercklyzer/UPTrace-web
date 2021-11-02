import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { PatientService } from 'src/app/services/patient.service';
import { Whereabout } from 'src/app/models/whereabout.model';
import * as moment from 'moment';

@Component({
  selector: 'app-whereabouts',
  templateUrl: './whereabouts.component.html',
  styleUrls: ['./whereabouts.component.css']
})
export class WhereaboutsComponent implements OnInit {
  patientContactNum: string = "";
  patientExists: boolean = true;
  whereabouts: Whereabout[] = [];

  constructor(
    private route: ActivatedRoute,
    private patientService:PatientService
  ) { }

  ngOnInit(): void {
    this.patientContactNum = this.route.snapshot.params.patientContactNum;
    console.log("patientContactNum:", this.patientContactNum);

    this.checkIfPatientExists();
  }

  checkIfPatientExists(): void {
    this.patientService.getPatient(this.patientContactNum)
    .subscribe((patient) => {
      if(patient === null) {
        this.patientExists = false;
        console.log("patient doesn't exist");
      } else {
        this.getWhereabouts();
      }
    }, (err) => {
      console.error(err);
      this.patientExists = false;
    });
  }

  getWhereabouts(): void {
    this.patientService.getWhereabouts(this.patientContactNum)
    .subscribe((whereabouts) => {
      this.whereabouts = whereabouts;
      console.log("whereabouts:", this.whereabouts);
    }, (err) => {
      console.error(err);
      this.patientExists = false;
    });
  }

  convertDateTime(unixTime: number): any {
    return moment.unix(unixTime).format("MM/DD/YYYY HH:mm");
  }

}
