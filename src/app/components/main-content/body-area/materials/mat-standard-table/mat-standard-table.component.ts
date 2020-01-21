import { Component, OnInit,Input,SimpleChanges } from '@angular/core';
import { MaterialService } from 'src/app/services/material.service';
import { StateManagerService } from 'src/app/services/statemanager.service' ;
import { clsMaterial } from 'src/app/models/materials/material'
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-mat-standard-table',
  templateUrl: './mat-standard-table.component.html',
  styleUrls: ['./mat-standard-table.component.scss','../materials.component.scss']
})
export class MatStandardTableComponent implements OnInit {

  dtResult:any;
  headers:any;
  selectedMaterial:clsMaterial;
  selectedMatOrGrp:String;
  getMaterial: string;
  environment=environment;
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
      this.selectedMaterial = this.srv_statemanage.GetMaterialSelected();
      if (this.selectedMaterial== null){
        this.selectedMatOrGrp = "";
      }
      else {
        if (this.selectedMaterial.material && this.selectedMaterial.material != ""){
          this.selectedMatOrGrp = this.selectedMaterial.material;
        }     
          else
          {
            this.selectedMatOrGrp = this.selectedMaterial.group;
          }
          
        }
    });
      
  }

  ngOnChanges(changes:SimpleChanges) {
    this.fillTable();
  }

  OnSelectMaterial(selCol:string,mat:string)
  {   
    
    this.selectedMaterial= new clsMaterial(this.mySplit(selCol,0),this.mySplit(selCol,1),mat);
    this.srv_statemanage.SelectMaterial(this.selectedMaterial);

  }

  mySplit(col:string,nb:number){
    var array = col.split('+');
    return array[nb];
  }

}
