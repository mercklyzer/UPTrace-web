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
  buildingForm!:FormGroup;
  roomForm!:FormGroup;

  buildings:Building[] = [];
  rooms:Room[] = [];

  selectedBuildingId: number = 0;
  selectedBuildingName: string = "";

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
      // building_name: this.buildingForm.value.selectedBuilding,
      building_name: this.selectedBuildingName,
      room_name: "",
      department: ""
    });
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
      // console.log("rooms:", this.rooms);
    });
  }

  setBuildingName(buildingId: number) {
    let index = this.buildings.findIndex(x => x.building_id == buildingId);
    // console.log("index:", index);
    this.selectedBuildingName = this.buildings[index].building_name;
  }

  addRoom() {
    this.newRooms().push(this.newRoom());
  }

  removeRoom(i: number) {
    this.newRooms().removeAt(i);
  }

  onSelectBuilding(event: any) {
    this.selectedBuildingId = event.target.value;
    // console.log(this.selectedBuildingId);
    this.getAllRooms(this.selectedBuildingId);
    this.setBuildingName(this.selectedBuildingId);
  }

  onSubmitBuilding() {
    let addBuildingRequestBody = {
      building_name: this.buildingForm.value.newBuilding
    };
    // console.log(addBuildingRequestBody);

    this.buildingService.addBuilding(addBuildingRequestBody)
    .subscribe((response) => {
      console.log(response);
    }, (err) => {
      console.log(err);
    });
  }

  onSubmitRooms() {
    console.log(this.roomForm.value.newRooms);
    this.buildingService.addRoom(this.roomForm.value.newRooms, this.selectedBuildingId)
    .subscribe((response) => {
      console.log(response);
    }, (err) => {
      console.log(err);
    });
  }

}
