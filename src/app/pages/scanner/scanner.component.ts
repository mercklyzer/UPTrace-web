// https://github.com/zxing-js/ngx-scanner/blob/master/projects/zxing-scanner-demo/src/app/app.component.html

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

  // start of debug
  availableDevices: MediaDeviceInfo[] = [];
  deviceCurrent?: MediaDeviceInfo;
  deviceSelected:string = ''

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

  onCamerasFound(devices: MediaDeviceInfo[]) {
    this.availableDevices = devices
  }

  onDeviceSelectChange(selected: any) {
    const selectedStr = selected.target.value || '';
    if (this.deviceSelected === selectedStr) { return; }
    this.deviceSelected = selectedStr;
    const device = this.availableDevices.find(x => x.deviceId === selected.target.value);
    this.deviceCurrent = device || undefined;
  }

  onDeviceChange(device: MediaDeviceInfo) {
    const selectedStr = device?.deviceId || '';
    if (this.deviceSelected === selectedStr) { return; }
    this.deviceSelected = selectedStr;
    this.deviceCurrent = device || undefined;
  }

  changeCamera(event: any) {
    console.log(event.target.value);
    this.desiredCamera = event.target.value;
    // this.selectedDevice = this.scanner.getDeviceById(selectedValue)

    // this.scanner.device = this.desiredCamera;
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
