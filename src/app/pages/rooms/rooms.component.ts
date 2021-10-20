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
  }

  newRooms(): FormArray {
    return this.roomForm.get("newRooms") as FormArray;
  }

  newRoom(): FormGroup {
    return this.fb.group({
      roomName: "",
      buildingName: this.buildingForm.value.selectedBuilding
    });
  }

  getAllBuildings() {
    this.buildingService.getBuildings()
    .subscribe((buildings) => {
      this.buildings = buildings;
    });
  }

  addRoom() {
    this.newRooms().push(this.newRoom());
  }

  removeRoom(i: number) {
    this.newRooms().removeAt(i);
  }

  onSubmitBuilding() {

  }

  onSubmitRooms() {
    console.log(this.roomForm.value);
    // console.log(this.buildingForm.value.selectedBuilding);
  }

}
