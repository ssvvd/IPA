import { Component, OnInit,Input,SimpleChanges } from '@angular/core';
import { MaterialService } from 'src/app/services/material.service';
import { StateManagerService } from 'src/app/services/statemanager.service' ;
import { clsMaterial } from 'src/app/models/materials/material'

@Component({
  selector: 'app-mat-standard-table',
  templateUrl: './mat-standard-table.component.html',
  styleUrls: ['./mat-standard-table.component.scss','../materials.component.scss']
})
export class MatStandardTableComponent implements OnInit {

  dtResult:any;
  headers:any;
  selectedMaterial:clsMaterial;
  @Input() selectedCateg: string ;
  @Input() selectedStandard: string ;

  constructor(private serv: MaterialService,private srv_statemanage:StateManagerService) { }

  ngOnInit() {
    this.fillTable();
  }

  fillTable(){
    this.serv.getmaterialsdetailsStnd(this.selectedCateg,this.selectedStandard).subscribe((res:any)=>{
      this.dtResult =JSON.parse(res);
      this.headers = Object.keys(this.dtResult[0]);
    });
      
  }

  ngOnChanges(changes:SimpleChanges) {
    this.fillTable();
  }

  OnSelectMaterial(selCol:string)
  {   
    this.selectedMaterial= new clsMaterial(this.mySplit(selCol,0),this.mySplit(selCol,1))
    this.srv_statemanage.SelectMaterial(this.selectedMaterial);

  }

  mySplit(col:string,nb:number){
    var array = col.split('+');
    return array[nb];
  }

}
