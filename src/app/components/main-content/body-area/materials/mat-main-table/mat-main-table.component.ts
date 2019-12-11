import { Component, OnInit } from '@angular/core';
import { clsMaterial } from 'src/app/models/materials/material'
import { MaterialService } from 'src/app/services/material.service'
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-mat-main-table',
  templateUrl: './mat-main-table.component.html',
  styleUrls: ['./mat-main-table.component.scss','../materials.component.scss']
})
export class MatMainTableComponent implements OnInit {

  dtOptions: DataTables.Settings = {};
  materialsResult:clsMaterial[]=[]
  environment = environment;

  constructor(private serv: MaterialService) { }

  ngOnInit() {
    this.dtOptions = {
      pagingType: 'full_numbers',
       "searching": false,
       "lengthChange": false ,
       "paging":false,  
       "language": {
        "emptyTable": "",
        "zeroRecords": "",
        "infoEmpty": ""
      } 
            
      }; 
    
    this.fillMainTable();

  }

  fillMainTable(){
    this.serv.getmaterialsbygrp('EN','P').subscribe((res:any)=>{
      this.materialsResult=JSON.parse(res);})
  }
  
}
