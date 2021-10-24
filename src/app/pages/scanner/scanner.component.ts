import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { LogService } from 'src/app/services/log.service';
import { Camera } from 'src/app/models/camera.model';

import { CookieService } from 'ngx-cookie';
import jwt_decode from 'jwt-decode';
import * as moment from 'moment';
import { ZXingScannerComponent } from '@zxing/ngx-scanner';

@Component({
  selector: 'app-scanner',
  templateUrl: './scanner.component.html',
  styleUrls: ['./scanner.component.css']
})
export class ScannerComponent implements OnInit {
  @ViewChild('scanner', { static: false }) scanner!: ZXingScannerComponent;
  @ViewChild('openModal') openModal!: ElementRef;
  @ViewChild('closeModal') closeModal!: ElementRef;

  isScannerEnabled: boolean = false;
  isQRCodeValid: boolean = true;
  scannedRoomId: string = "";
  userToken: any;
  decodedToken: any;
  email: string = "";
  camerasFound: Camera[] = [];
  desiredCamera: any;

  constructor(
    private cookieService:CookieService,
    private logService:LogService,
    private router:Router,
  ) { }

  ngOnInit(): void {
    this.userToken = this.cookieService.get('Token');
    if(this.userToken) {
      this.decodedToken = jwt_decode(this.userToken);
      this.email = this.decodedToken.sub;
    }
  }

  camerasFoundHandler(cameras: any) {
    this.camerasFound = cameras;
  }

  changeCamera(event: any) {
    this.desiredCamera = event.target.value;
    this.scanner.device = this.desiredCamera;
  }

  scanSuccessHandler(result: string) {
    this.scannedRoomId = result;
    
    let log = {
      email: this.email,
      scan_date: moment().format("YYYY-MM-DD HH:mm:ss"),
      room_id: this.scannedRoomId
    };

    this.logService.addLog(log)
    .subscribe((response) => {
      console.log(response);
      this.isQRCodeValid = true;
      
      let openScanSuccessModal: HTMLElement = this.openModal.nativeElement;
      let closeScanSuccessModal: HTMLElement = this.closeModal.nativeElement;
      openScanSuccessModal.click();

      setTimeout(() => {
        this.router.navigate(['/']);
        closeScanSuccessModal.click();
      }, 5000);
    }, (err) => {
      console.error(err);
      this.isQRCodeValid = false;
    });
  }

}
