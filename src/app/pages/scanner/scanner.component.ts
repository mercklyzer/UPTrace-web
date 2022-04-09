// https://github.com/zxing-js/ngx-scanner/blob/master/projects/zxing-scanner-demo/src/app/app.component.html

import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { LogService } from 'src/app/services/log.service';
import { Camera } from 'src/app/models/camera.model';

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

  errorMessage:string = ''

  // scanned room details
  room: string = ''
  building: string = ''

  // start of debug
  availableDevices: MediaDeviceInfo[] = [];
  deviceCurrent?: MediaDeviceInfo;
  deviceSelected:string = ''

  // Added to use back/rear camera by default
  scannerJustLoaded: boolean = true;
  backCamera?: MediaDeviceInfo;

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

    // Start of adding code to select back/rear camera by default if it exists
    console.log("available devices:", this.availableDevices);
    this.backCamera = this.availableDevices.find(device => device.label.toLowerCase().includes("source") || device.label.toLowerCase().includes("rear"));
    console.log("back camera:", this.backCamera);
  }

  onDeviceSelectChange(selected: any) {
    if(this.scannerJustLoaded && this.backCamera) {
      console.log("inside if scannerJustLoaded and backCamera is not undefined");
      this.deviceSelected = this.backCamera.deviceId;
      this.deviceCurrent = this.backCamera;
      this.scannerJustLoaded = false;
    } else {
      const selectedStr = selected.target.value || '';
      if (this.deviceSelected === selectedStr) { return; }
      this.deviceSelected = selectedStr;
      const device = this.availableDevices.find(x => x.deviceId === selected.target.value);
      this.deviceCurrent = device || undefined;
    }
  }

  onDeviceChange(device: MediaDeviceInfo) {
    if(this.scannerJustLoaded && this.backCamera) {
      console.log("inside if scannerJustLoaded and backCamera is not undefined");
      this.deviceSelected = this.backCamera.deviceId;
      this.deviceCurrent = this.backCamera;
      this.scannerJustLoaded = false;
    } else {
      const selectedStr = device?.deviceId || '';
      if (this.deviceSelected === selectedStr) { return; }
      this.deviceSelected = selectedStr;
      this.deviceCurrent = device || undefined;
      console.log("deviceSelected:", this.deviceSelected);
      console.log("deviceCurrent:", this.deviceCurrent);
    }
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
      room_id: this.scannedRoomId
    };

    this.subscriptions.add(this.logService.addLog(log)
    .subscribe((response) => {
      this.room = response.room_name
      this.building = response.building_name

      console.log(response);
      this.isQRCodeValid = true;
      this.isScannerEnabled = false;
      
      let openScanSuccessModal: HTMLElement = this.openModal.nativeElement;
      let closeScanSuccessModal: HTMLElement = this.closeModal.nativeElement;
      openScanSuccessModal.click();

      setTimeout(() => {
        this.router.navigate(['/']);
        closeScanSuccessModal.click();
      }, 4000);
    }, (err) => {
      console.error(err);
      this.errorMessage = err.error.error.message
      this.isQRCodeValid = false;
    }));
  }

}
