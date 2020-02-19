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
  dtOptionsMat: DataTables.Settings = {};
  curPage:number;
  lastPage:number;
  curShownColumns:number[];
  @Input() selectedCateg: string ;
  @Input() selectedStandard: string ;

  constructor(private serv: MaterialService,private srv_statemanage:StateManagerService) { }

  ngOnInit() {
    this.dtOptionsMat = {
      order:[],
      pagingType: 'full_numbers',
       "searching": false,
       "lengthChange": false ,
       "paging":false,  
       "autoWidth":false,
       "language": {
        "emptyTable": "",
        "zeroRecords": "",
        "infoEmpty": "",
        "info": ""
      } 
            
      }; 
    this.fillTable();
  }

  fillTable(){
    this.curPage = 0;
    this.curShownColumns = [0,1,2,3,4,5,6,7];
    this.serv.getmaterialsdetailsStnd(this.selectedCateg,this.selectedStandard).subscribe((res:any)=>{
      this.dtResult =JSON.parse(res);
      this.headers = Object.keys(this.dtResult[0]);
      this.lastPage = Math.ceil(this.headers.length / 8) - 1;
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
    
    this.selectedMaterial= new clsMaterial(this.mySplit(selCol,0),this.mySplit(selCol,1),mat,this.selectedCateg);
    this.srv_statemanage.SelectMaterial(this.selectedMaterial);

  }

  mySplit(col:string,nb:number){
    var array = col.split('+');
    return array[nb];
  }

  Next(){
    this.curPage = this.curPage + 1;
    this.setCurVisColumns();
  }

  Previous(){
    this.curPage = this.curPage - 1;
    this.setCurVisColumns();
  }

  setCurVisColumns(){
    let nextPageStart:number = this.curPage * 8;
    this.curShownColumns = [nextPageStart,nextPageStart + 1,nextPageStart + 2,nextPageStart + 3,nextPageStart + 4,nextPageStart + 5,nextPageStart + 6,nextPageStart + 7];
  }
}
