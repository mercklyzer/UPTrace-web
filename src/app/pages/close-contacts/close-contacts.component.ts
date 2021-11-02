import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { PatientService } from 'src/app/services/patient.service';
import { ExcelService } from 'src/app/services/excel.service';

@Component({
  selector: 'app-close-contacts',
  templateUrl: './close-contacts.component.html',
  styleUrls: ['./close-contacts.component.css']
})
export class CloseContactsComponent implements OnInit {
  patientContactNum: string = "";
  patientDisclosureDate: string = "";
  patientExists: boolean = true;
  closeContacts: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private patientService:PatientService,
    private excelService:ExcelService
  ) { }

  ngOnInit(): void {
    this.patientContactNum = this.route.snapshot.params.patientContactNum;
    this.patientDisclosureDate = this.route.snapshot.params.disclosureDate;

    this.checkIfPatientExists();
  }

  checkIfPatientExists(): void {
    this.patientService.getPatient(this.patientContactNum, this.patientDisclosureDate)
    .subscribe((patient) => {
      if(patient === null) {
        this.patientExists = false;
        console.log("patient doesn't exist");
      } else {
        this.getCloseContacts();
      }
    }, (err) => {
      console.error(err);
      this.patientExists = false;
    });
  }

  getCloseContacts(): void {
    this.patientService.getCloseContacts(this.patientContactNum, this.patientDisclosureDate)
    .subscribe((closeContacts) => {
      this.closeContacts = closeContacts;
      console.log("close contacts:", this.closeContacts);
    }, (err) => {
      console.error(err);
      this.patientExists = false;
    });
  }

  exportAsXLSX():void {
    this.excelService.exportAsExcelFile(this.closeContacts, `${this.patientContactNum}_close_contacts`);
  }

}
