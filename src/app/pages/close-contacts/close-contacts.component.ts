import { Component, OnInit } from '@angular/core';
import { ExcelService } from 'src/app/services/excel.service';

@Component({
  selector: 'app-close-contacts',
  templateUrl: './close-contacts.component.html',
  styleUrls: ['./close-contacts.component.css']
})
export class CloseContactsComponent implements OnInit {
  title = 'exportExcelInAngular';
  dataOfFootballers: any = [{
    playerName: 'Cristiano Ronaldo',
    playerCountry: 'Pourtgal',
    playerClub: 'Juventus'
  },
  {
    playerName: 'Lionel Messi',
    playerCountry: 'Argentina',
    playerClub: 'Barcelona'
  },
  {
    playerName: 'Neymar Junior',
    playerCountry: 'Brazil',
    playerClub: 'PSG'
  },
  {
  playerName: 'Tonni Kroos',
  playerCountry: 'Germany',
  playerClub: 'Real Madrid'
  },
  {
    playerName: 'Paul Pogba',
    playerCountry: 'France',
    playerClub: 'Manchester United'
  }];

  constructor(
    private excelService:ExcelService
  ) { }

  ngOnInit(): void {
  }

  exportAsXLSX():void {
    this.excelService.exportAsExcelFile(this.dataOfFootballers, 'footballer_data');
  }

}
