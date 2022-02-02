import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Building } from 'src/app/models/building.model';
import { Room } from 'src/app/models/room.model';
import { BuildingService } from 'src/app/services/building.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-rooms',
  templateUrl: './rooms.component.html',
  styleUrls: ['./rooms.component.css']
})
export class RoomsComponent implements OnInit, OnDestroy {
  errorMessages:string[] = [];

  buildingForm!:FormGroup;
  roomForm!:FormGroup;

  buildings:Building[] = [];
  rooms:Room[] = [];

  selectedBuildingId: number = 0;
  selectedBuildingName: string = "";
  isRoomFormSubmitted: boolean = false;
  isLoadingMessage: boolean = false;
  isLoadingRooms: boolean = false;

  addBuildingMessage: string = "";
  addRoomMessage: string = "";

  private subscriptions = new Subscription();

  constructor(
    private fb:FormBuilder,
    private buildingService:BuildingService,
  ) { }

  ngOnInit(): void {
    this.buildingForm = this.fb.group({
      selectedBuilding: [''],
      newBuilding: ['', [Validators.required]]
    });

    this.roomForm = this.fb.group({
      newRooms: this.fb.array([])
    });

    this.getAllBuildings();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  newRooms(): FormArray {
    return this.roomForm.get("newRooms") as FormArray;
  }

  newRoom(): FormGroup {
    return this.fb.group({
      room_name: ['', [Validators.required]],
      is_entrance: [false, [Validators.required]]
    });
  }

  addRoom() {
    this.newRooms().push(this.newRoom());
  }

  removeRoom(i: number) {
    this.newRooms().removeAt(i);
  }

  getAllBuildings() {
    this.subscriptions.add(this.buildingService.getBuildings()
    .subscribe((buildings) => {
      this.buildings = buildings;
    }));
  }

  getAllRooms(buildingId: number) {
    this.isLoadingRooms = true;
    this.subscriptions.add(this.buildingService.getRooms(buildingId)
    .subscribe((rooms) => {
      this.rooms = rooms;
      console.log("rooms:", rooms);
      this.isLoadingRooms = false;
    }));
  }

  setBuildingName(buildingId: number) {
    let index = this.buildings.findIndex(x => x.building_id == buildingId);
    this.selectedBuildingName = this.buildings[index].building_name;
  }

  downloadAllQRCodes(buildingId:number){
    window.open(`${environment.apiUrl}/buildings/${buildingId}/rooms-pdf`)

    // this.buildingService.getRoomsPdf(buildingId)
    // .subscribe((res) => {
    //   console.log(res);
    // }, (err) => {
    //   console.log(err);
    // })
  }

  downloadSpecificQRCode(buildingId:number, roomId:string){
    window.open(`${environment.apiUrl}/buildings/${buildingId}/${roomId}/pdf`)
  }

  onSelectBuilding(event: any) {
    this.selectedBuildingId = event.target.value;
    this.getAllRooms(this.selectedBuildingId);
    this.setBuildingName(this.selectedBuildingId);
  }

  onSubmitBuilding() {
    this.isLoadingMessage = true;
    let addBuildingRequestBody = {
      building_name: this.buildingForm.value.newBuilding
    };

    this.subscriptions.add(this.buildingService.addBuilding(addBuildingRequestBody)
    .subscribe((response) => {
      console.log(response);
      this.addBuildingMessage = "Successfully added building.";
      this.isLoadingMessage = false;

    }, (err) => {
      console.error(err);
      this.addBuildingMessage = `ERROR: ${err.error.error.message}`;
      this.isLoadingMessage = false;
    }));
  }

  onSubmitRooms() {
    this.isRoomFormSubmitted = true;
    console.log("rooms to add:", this.roomForm.value.newRooms);

    if(this.roomForm.valid) {
      this.isLoadingMessage = true;
      this.subscriptions.add(this.buildingService.addRoom(this.roomForm.value.newRooms, this.selectedBuildingId)
      .subscribe((response) => {
        console.log(response);
        this.addRoomMessage = response;
        this.isLoadingMessage = false;

      }, (err) => {
        console.error(err);
        this.addRoomMessage = `ERROR: ${err.error.error.message}`;
        this.isLoadingMessage = false;
      }));
      this.newRooms().clear();
      this.isRoomFormSubmitted = false;
    }
  }

  reloadBuildings() {
    // location.reload();
    this.getAllBuildings();
  }

  reloadRooms() {
    if(this.selectedBuildingId != 0) {
      this.getAllRooms(this.selectedBuildingId);
    }
  }
}
