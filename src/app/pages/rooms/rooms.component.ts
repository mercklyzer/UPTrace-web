import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Building } from 'src/app/models/building.model';
import { Room } from 'src/app/models/room.model';
import { BuildingService } from 'src/app/services/building.service';

@Component({
  selector: 'app-rooms',
  templateUrl: './rooms.component.html',
  styleUrls: ['./rooms.component.css']
})
export class RoomsComponent implements OnInit {
  errorMessages:string[] = [];

  buildingForm!:FormGroup;
  roomForm!:FormGroup;

  buildings:Building[] = [];
  rooms:Room[] = [];

  selectedBuildingId: number = 0;
  selectedBuildingName: string = "";
  isRoomFormSubmitted: boolean = false;

  addBuildingMessage: string = "";
  addRoomMessage: string = "";

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

  newRooms(): FormArray {
    return this.roomForm.get("newRooms") as FormArray;
  }

  newRoom(): FormGroup {
    return this.fb.group({
      // building_name: [this.selectedBuildingName, [Validators.required]],
      room_name: ['', [Validators.required]]
    });
  }

  addRoom() {
    this.newRooms().push(this.newRoom());
  }

  removeRoom(i: number) {
    this.newRooms().removeAt(i);
  }

  getAllBuildings() {
    this.buildingService.getBuildings()
    .subscribe((buildings) => {
      this.buildings = buildings;
    });
  }

  getAllRooms(buildingId: number) {
    this.buildingService.getRooms(buildingId)
    .subscribe((rooms) => {
      this.rooms = rooms;
    });
  }

  setBuildingName(buildingId: number) {
    let index = this.buildings.findIndex(x => x.building_id == buildingId);
    this.selectedBuildingName = this.buildings[index].building_name;
  }

  downloadAllQRCodes(buildingId:number){
    window.open(`http://localhost:3000/buildings/${buildingId}/rooms-pdf`)

    // this.buildingService.getRoomsPdf(buildingId)
    // .subscribe((res) => {
    //   console.log(res);
    // }, (err) => {
    //   console.log(err);
    // })
  }

  onSelectBuilding(event: any) {
    this.selectedBuildingId = event.target.value;
    this.getAllRooms(this.selectedBuildingId);
    this.setBuildingName(this.selectedBuildingId);
  }

  onSubmitBuilding() {
    let addBuildingRequestBody = {
      building_name: this.buildingForm.value.newBuilding
    };

    this.buildingService.addBuilding(addBuildingRequestBody)
    .subscribe((response) => {
      console.log(response);
      this.addBuildingMessage = "Successfully added building.";
    }, (err) => {
      console.error(err);
      this.addBuildingMessage = `ERROR: ${err.error.error.message}`;
    });
  }

  onSubmitRooms() {
    this.isRoomFormSubmitted = true;
    // console.log("rooms to add:", this.roomForm.value.newRooms);

    if(this.roomForm.valid) {
      this.buildingService.addRoom(this.roomForm.value.newRooms, this.selectedBuildingId)
      .subscribe((response) => {
        console.log(response);
        this.addRoomMessage = response;
      }, (err) => {
        console.error(err);
      this.addRoomMessage = `ERROR: ${err.error.error.message}`;
      });
    }
  }

  refreshPage() {
    location.reload();
  }
}
