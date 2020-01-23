import { Component, OnInit, Input,SimpleChanges,ViewChild,OnDestroy } from '@angular/core';
import { MaterialService } from 'src/app/services/material.service'
import { StateManagerService } from 'src/app/services/statemanager.service' ;
import { clsMaterial } from 'src/app/models/materials/material'
import { environment } from 'src/environments/environment';
import { DataTableDirective } from 'angular-datatables';
import { Subject, Subscription } from 'rxjs';

@Component({
  selector: 'app-mat-details',
  templateUrl: './mat-details.component.html',
  styleUrls: ['./mat-details.component.scss','../materials.component.scss']
})
export class MatDetailsComponent implements OnInit, OnDestroy {
  @ViewChild(DataTableDirective, {static: false})
  dtElement: DataTableDirective;

  dtTriggerMat: Subject<any> = new Subject();
  allSubsMat$: Subscription;
  isDtInitialized:boolean = false;
  dtOptionsMat: DataTables.Settings = {};
  detailsResult:any;
  headers:any;
  selectedMaterialCls:clsMaterial;
  selectedMatOrGrp:String = "";
  environment=environment;
  @Input() selectedMaterial: clsMaterial ;

  constructor(private serv: MaterialService,private srv_statemanage:StateManagerService) { }

  ngOnInit() {

    this.dtOptionsMat = {
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
    

    // this.fillDetailsTable();
  }

  fillDetailsTable(){
    this.allSubsMat$ = this.serv.getmaterialsdetails(this.selectedMaterial.id).subscribe((res:any)=>{
      this.detailsResult =JSON.parse(res);
      this.headers = Object.keys(this.detailsResult[0]);
      this.selectedMaterialCls = this.srv_statemanage.GetMaterialSelected();
      if (this.selectedMaterialCls && this.selectedMaterialCls.group == this.selectedMaterial.group && this.selectedMaterialCls.material && this.selectedMaterialCls.material != ""){
          this.selectedMatOrGrp = this.selectedMaterialCls.material;
      }
      this.isDtInitializedFunc();
    });
      
      var a = 0;
  }

  
  isDtInitializedFunc(){
    if (this.isDtInitialized){
      this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
        dtInstance.destroy();
        this.dtTriggerMat.next();
      });
    }
    else{
       this.isDtInitialized = true;
      this.dtTriggerMat.next();
    }
  }


  ngOnChanges(changes:SimpleChanges) {
    this.fillDetailsTable();
  }

  OnSelectMaterial(mat:string)
  {   
    this.selectedMaterialCls= new clsMaterial(this.selectedMaterial.group,this.selectedMaterial.desc,mat,this.selectedMaterial.Category);
    this.srv_statemanage.SelectMaterial(this.selectedMaterialCls);

  }

  ngOnDestroy() {
    this.allSubsMat$.unsubscribe();
  }
}
