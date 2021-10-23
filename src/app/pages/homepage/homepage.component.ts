import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { LogService } from 'src/app/services/log.service';
import { Camera } from 'src/app/models/camera.model';

import { CookieService } from 'ngx-cookie';
import jwt_decode from 'jwt-decode';
import * as moment from 'moment';
import { ZXingScannerComponent } from '@zxing/ngx-scanner';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})
export class HomepageComponent implements OnInit {
  @ViewChild('scanner', { static: false }) scanner!: ZXingScannerComponent;
  @ViewChild('triggerModal') triggerModal!: ElementRef;

  isScannerEnabled: boolean = false;
  isQRCodeValid: boolean = true;
  scannedRoomId: string = "";
  userToken: any;
  decodedToken: any;
  email: string = "";
  scanQRMessage: string = "";
  camerasFound: Camera[] = [];
  desiredCamera: any;

  constructor(
    private cookieService:CookieService,
    private logService:LogService,
  ) { }

  ngOnInit(): void {
    this.userToken = this.cookieService.get('Token');
    if(this.userToken) {
      this.decodedToken = jwt_decode(this.userToken);
      this.email = this.decodedToken.sub;
    }
  }

  camerasFoundHandler(cameras: any) {
    console.log("cameras:", cameras);
    this.camerasFound = cameras;
  }

  changeCamera(event: any) {
    this.desiredCamera = event.target.value;
    console.log("event target value:", this.desiredCamera)
    this.scanner.device = this.desiredCamera;
  }

  enableScanner() {
    this.isScannerEnabled = true;
    this.desiredCamera = this.camerasFound[0];
    if(this.desiredCamera) {
      console.log(this.desiredCamera.label);
      this.scanner.device = this.desiredCamera;
    }
  }

  disableScanner() {
    this.isScannerEnabled = false;
    this.scannedRoomId = "";
    this.isQRCodeValid = true;
  }

  scanSuccessHandler(result: string) {
    this.scannedRoomId = result;
    this.isQRCodeValid = false;
    
    let log = {
      email: this.email,
      scan_date: moment().format("YYYY-MM-DD HH:mm:ss"),
      room_id: this.scannedRoomId
    };

    this.logService.addLog(log)
    .subscribe((response) => {
      console.log(response);
      this.scanQRMessage = response;
      let scanSuccessModal: HTMLElement = this.triggerModal.nativeElement;
      scanSuccessModal.click();
    }, (err) => {
      console.error(err);
    this.scanQRMessage = `ERROR: ${err.error.error.message}`;
    });
  }
}
