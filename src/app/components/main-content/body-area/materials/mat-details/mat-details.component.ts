import { Component, OnInit, Input,SimpleChanges } from '@angular/core';
import { MaterialService } from 'src/app/services/material.service'
import { StateManagerService } from 'src/app/services/statemanager.service' ;
import { clsMaterial } from 'src/app/models/materials/material'

@Component({
  selector: 'app-mat-details',
  templateUrl: './mat-details.component.html',
  styleUrls: ['./mat-details.component.scss','../materials.component.scss']
})
export class MatDetailsComponent implements OnInit {

  detailsResult:any;
  headers:any;
  selectedMaterialCls:clsMaterial;
  selectedMatOrGrp:String = "";
  @Input() selectedMaterial: clsMaterial ;

  constructor(private serv: MaterialService,private srv_statemanage:StateManagerService) { }

  ngOnInit() {
    this.fillDetailsTable();
  }

  fillDetailsTable(){
    this.serv.getmaterialsdetails(this.selectedMaterial.id).subscribe((res:any)=>{
      this.detailsResult =JSON.parse(res);
      this.headers = Object.keys(this.detailsResult[0]);
      this.selectedMaterialCls = this.srv_statemanage.GetMaterialSelected();
      if (this.selectedMaterialCls.group == this.selectedMaterial.group && this.selectedMaterialCls.material && this.selectedMaterialCls.material != ""){
          this.selectedMatOrGrp = this.selectedMaterialCls.material;
      }
    });
      
      var a = 0;
  }

  ngOnChanges(changes:SimpleChanges) {
    this.fillDetailsTable();
  }

  OnSelectMaterial(mat:string)
  {   
    this.selectedMaterialCls= new clsMaterial(this.selectedMaterial.group,this.selectedMaterial.desc,mat);
    this.srv_statemanage.SelectMaterial(this.selectedMaterialCls);

  }
}
