import { Component, OnInit,Input,SimpleChanges,ViewChild,DoCheck } from '@angular/core';
import { MaterialService } from 'src/app/services/material.service';
import { StateManagerService } from 'src/app/services/statemanager.service' ;
import { AppsettingService} from 'src/app/services/appsetting.service';
import { MaterialsmService } from 'src/app/services/materialsm.service'
import { clsMaterial } from 'src/app/models/materials/material'
import { environment } from 'src/environments/environment';
import { DataTableDirective } from 'angular-datatables';
import { Subject, Subscription } from 'rxjs';

@Component({
  selector: 'app-mat-standard-table',
  templateUrl: './mat-standard-table.component.html',
  styleUrls: ['./mat-standard-table.component.scss','../materials.component.scss']
})
export class MatStandardTableComponent implements OnInit,DoCheck {
  @ViewChild(DataTableDirective, {static: false})
  dtElement: DataTableDirective;

  dtResult:any;
  headers:any;
  selectedMaterial:clsMaterial;
  selectedMatOrGrp:String;
  getMaterial: string;
  environment=environment;
  dtOptionsMat: any = {};
  curPage:number;
  lastPage:number;
  curShownColumns:number[];
  dtTriggerMat: Subject<any> = new Subject();
  allSubsMat$: Subscription;
  isDtInitialized:boolean = false;
  @Input() selectedCateg: string ;
  @Input() selectedStandard: string ;

  constructor(private servsm: MaterialsmService,private serv: MaterialService,private srv_statemanage:StateManagerService,private srv_appsetting:AppsettingService) { }

  ngOnInit() {
    this.dtOptionsMat = {
      order:[],
      pagingType: 'full_numbers',
       "searching": false,
       "lengthChange": false ,
       "paging":false,  
       "autoWidth":false,
       "scrollY": 'calc(100vh - 355px)',
       "info":false,
       "scrollCollapse" : true,
       "ordering": false,
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
    this.allSubsMat$ = this.serv.getmaterialsdetailsStnd(this.selectedCateg,this.selectedStandard).subscribe((res:any)=>{
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
        this.isDtInitializedFunc();
    });
      
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
    this.fillTable();
  }

  OnSelectMaterial(selCol:string,mat:string)
  {   
    let matGroup:clsMaterial = this.servsm.getCategoryTable(this.srv_appsetting.Lang || "EN",this.selectedCateg).find(x => x.id === +this.mySplit(selCol,0))
    this.selectedMaterial= new clsMaterial(this.mySplit(selCol,0),this.mySplit(selCol,1),mat,this.selectedCateg,matGroup.HardnessHBValue || matGroup.Hardness);
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
  //   setTimeout(function(){
  //     if(true){
  //     this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
  //       dtInstance.columns.adjust();
  //       this.dtTriggerMat.next();
  //     });
  // }}, 1000);
  }

  ngDoCheck(){
    
  }
}
