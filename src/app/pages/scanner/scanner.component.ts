import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { LogService } from 'src/app/services/log.service';
import { Camera } from 'src/app/models/camera.model';

import * as moment from 'moment';
import { ZXingScannerComponent } from '@zxing/ngx-scanner';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-scanner',
  templateUrl: './scanner.component.html',
  styleUrls: ['./scanner.component.css']
})
export class ScannerComponent implements OnInit, OnDestroy {
  @ViewChild('scanner', { static: false }) scanner!: ZXingScannerComponent;
  @ViewChild('openModal') openModal!: ElementRef;
  @ViewChild('closeModal') closeModal!: ElementRef;

  isScannerEnabled: boolean = true;
  isQRCodeValid: boolean = true;
  scannedRoomId: string = "";
  camerasFound: Camera[] = [];
  desiredCamera: any;

  private subscriptions = new Subscription();

  constructor(
    private logService:LogService,
    private router:Router,
  ) { }

  ngOnInit(): void {
    // Stop scanning when the user goes to a different page
    this.router.events.subscribe((val) => {
      this.scanner.scanStop();
      this.scanner.enable = false;
    });
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
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
    
    // no need to add email since we will be using contact number which can be derived from the token once sent to the server
    let log = {
      scan_date: moment().unix(),
      room_id: this.scannedRoomId
    };

    this.subscriptions.add(this.logService.addLog(log)
    .subscribe((response) => {
      console.log(response);
      this.isQRCodeValid = true;
      this.isScannerEnabled = false;
      
      let openScanSuccessModal: HTMLElement = this.openModal.nativeElement;
      let closeScanSuccessModal: HTMLElement = this.closeModal.nativeElement;
      openScanSuccessModal.click();

      setTimeout(() => {
        this.router.navigate(['/']);
        closeScanSuccessModal.click();
      }, 3000);
    }, (err) => {
      console.error(err);
      this.isQRCodeValid = false;
    }));
  }

}
