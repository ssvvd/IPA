import { Component, OnInit, Input, SimpleChanges, Output, EventEmitter  } from '@angular/core';
import { clsMaterial } from 'src/app/models/materials/material'
import { MaterialService } from 'src/app/services/material.service'
import { StateManagerService } from 'src/app/services/statemanager.service' ;
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-mat-main-table',
  templateUrl: './mat-main-table.component.html',
  styleUrls: ['./mat-main-table.component.scss','../materials.component.scss']
})
export class MatMainTableComponent implements OnInit {

  dtOptions: DataTables.Settings = {};
  materialsResult:clsMaterial[]=[];
  selectedMaterial:string;
  environment = environment;
  @Input() selectedCategory: string ;
  @Output() matDetailSelectedEv = new EventEmitter<string>();

  constructor(private serv: MaterialService,private srv_statemanage:StateManagerService) { }

  ngOnInit() {
    this.dtOptions = {
      pagingType: 'full_numbers',
       "searching": false,
       "lengthChange": false ,
       "paging":false,  
       "autoWidth":false,
       "language": {
        "emptyTable": "",
        "zeroRecords": "",
        "infoEmpty": ""
      } 
            
      }; 
    
    this.fillMainTable();

  }

  fillMainTable(){
    this.serv.getmaterialsbygrp('EN',this.selectedCategory).subscribe((res:any)=>{
      this.materialsResult=JSON.parse(res);
    
      if (this.srv_statemanage.GetMaterialSelected()== null)
          this.selectedMaterial = "";
       else
          this.selectedMaterial = this.srv_statemanage.GetMaterialSelected().group;
    })
  }

  ngOnChanges(changes:SimpleChanges) {
    this.fillMainTable();
  }

  matDetailClick(material: string) {
    this.matDetailSelectedEv.emit(material);
  }

  OnSelectMaterial(mat:clsMaterial)
  {   
    this.selectedMaterial = mat.group;
    this.srv_statemanage.SelectMaterial(mat);

  }
  
}
