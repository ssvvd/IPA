import { Component, OnInit,ViewChild } from '@angular/core';
import { ResultsService} from 'src/app/services/results.service' ;
import { StateManagerService} from 'src/app/services/statemanager.service' ;
import { clsGroups } from 'src/app/models/results/groups';
import { clsMainFields } from 'src/app/models/results/main-fields';
import { clsProperties } from 'src/app/models/results/properties';
import {clsPropertyValue} from 'src/app/models/results/property-value';
import { AppsettingService} from 'src/app/services/appsetting.service';
import { NgxSpinnerService } from "ngx-spinner"; 
import { Subject, Subscription, forkJoin } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
import { environment } from '../../../../../../environments/environment';

@Component({
  selector: 'app-results-table',
  templateUrl: './results-table.component.html',
  styleUrls: ['./results-table.component.scss']
})
export class ResultsTableComponent implements OnInit {
  @ViewChild(DataTableDirective, {static: false})
  dtElement: DataTableDirective;

  dtTrigger: Subject<any> = new Subject();
  allSubs$: Subscription;
  dtOptions: any = {};
  dtRsults:object[];
  dtRsultsVisble:object[];
  dtFullTable:object[];
  dtPropertiesTable:clsProperties[];
  dtPropertiesTableVisible:clsProperties[];
  dtGroups:clsGroups[];
  dtDefaultFields:clsMainFields[];
  dtResultsObjects:clsPropertyValue[][];
  dtResultsObjects3d:clsPropertyValue[][][];
  dtResultsObjects3dToShow:clsPropertyValue[][][]
  dtResultShow:any;
  headers:string[] = [];
  arrResult:string[];
  arrResultImgsItem:string[]=[];
  arrResultImgsFamily:string[]=[];
  arrResultImgsAll:any;
  ErrMsg:string="";

  constructor(private srv_Results:ResultsService,private srv_StMng:StateManagerService,private srv_appsetting:AppsettingService,
    private SpinnerService: NgxSpinnerService) { }



  ngOnInit() {

    this.dtOptions = {
      pagingType: 'full_numbers',
       "searching": false,
       "lengthChange": false ,
       "paging":false,  
       "autoWidth":false,
      //  "scrollY": '65vh',
       "scrollCollapse" : true,
       "language": {
        "emptyTable": "",
        "zeroRecords": "",
        "infoEmpty": "",
        "info": ""
      } 
            
      }; 


    this.GetResult();
  }

  GetResult() 
  {
       
      this.getShowTable()
  }

getShowTable(){
  this.SpinnerService.show(); 
  this.allSubs$ = forkJoin(
          this.srv_Results.getresults(this.srv_StMng.SecApp,this.srv_appsetting.Units,this.srv_StMng.IPLChanged),
          this.srv_Results.getoolproperties(this.srv_StMng.SecApp,this.srv_appsetting.Units,this.srv_StMng.IPLChanged),
          this.srv_Results.getgroups(this.srv_StMng.SecApp),
          this.srv_Results.getdefaultfields(this.srv_StMng.SecApp),
          this.srv_Results.Getfamilymovies()
        )
        .subscribe(([res1, res2, res3, res4,res5]:[any,any,any,any,any]) => {
          this.dtRsults =JSON.parse(res1);
          this.dtPropertiesTable = JSON.parse(res2); 
          this.dtGroups = JSON.parse(res3);
          this.dtDefaultFields = JSON.parse(res4); 
          this.arrResultImgsAll = JSON.parse(res5);

          var columnsCount = this.dtPropertiesTable.length
          var rowsCount = this.dtRsults.length

          this.dtResultsObjects = []
          let index:number = 0;
          for(var i: number = 0; i < rowsCount; i++) {
              this.dtResultsObjects[i] = [];
              index = 0

              for(var j: number = 0; j< columnsCount; j++) {
                if (this.dtPropertiesTable[j].IsVisible){
                  this.dtResultsObjects[i][index] = new clsPropertyValue()
                  this.dtResultsObjects[i][index].property = this.dtPropertiesTable[j]
                  if (!this.dtRsults[i][Object.keys(this.dtRsults[i])[j]])
                  this.dtRsults[i][Object.keys(this.dtRsults[i])[j]] = '';
                  this.dtResultsObjects[i][index].value = this.dtRsults[i][Object.keys(this.dtRsults[i])[j]]
                  index++

                  if (this.dtPropertiesTable[j].FieldDescriptionSmall == "Catalog No" && '/Tool/Blade/Square shank'.indexOf(this.dtPropertiesTable[j].GroupText) !== -1){
                    var url:string = environment.eCatItemPictures + this.dtRsults[i][Object.keys(this.dtRsults[i])[j]].toString().trim() + ".gif ";
                    this.arrResultImgsItem.push(url);

                }
              }
                if (this.dtPropertiesTable[j].FieldDescriptionSmall == "Family" && '/Tool/Blade/Square shank'.indexOf(this.dtPropertiesTable[j].GroupText) !== -1){
                  let family:string = this.dtRsults[i][Object.keys(this.dtRsults[i])[j]].toString().trim();
                  
                  
                  let curFamilyPic = this.arrResultImgsAll.find(i => i['Family'] == family.toString().trim());
                  if (curFamilyPic)
                    family = curFamilyPic['GFPIC'];

                    var url:string = environment.eCatFamilyPictures + family.toString().trim() + ".gif ";
                    this.arrResultImgsFamily.push(url);

                }

             
                  
              }
            }
        

          var visColumnsCount = this.dtResultsObjects[0].length
          this.dtResultsObjects3d = []
          let index3:number = 0;
          var dupColumns:number [] = []
          var groupsOrder:number [] =[]
          for(var i: number = 0; i < rowsCount; i++) {
            this.dtResultsObjects3d[i] = []
            index = 0
            dupColumns = []
            groupsOrder = []
          for(var col1: number = 0; col1 < visColumnsCount; col1++) {
            if(dupColumns.indexOf(col1) == -1){
              this.dtResultsObjects3d[i][index] = []
              index3 = 0
              if (index == 2){
                let grpID:number = this.dtResultsObjects[i][col1].property.GroupID
                let order:number = groupsOrder.indexOf(grpID, 0)
                index3 = order
                for(var brandNamePos: number = 0; brandNamePos < index3; brandNamePos++) {
                  this.dtResultsObjects3d[i][index][brandNamePos] = new clsPropertyValue() 
                }
                for(var brandNamePos: number = index3 + 1; brandNamePos < groupsOrder.length; brandNamePos++) {
                  this.dtResultsObjects3d[i][index][brandNamePos] = new clsPropertyValue() 
                }
              }
              this.dtResultsObjects3d[i][index][index3] = this.dtResultsObjects[i][col1]
              if (i==0)
                this.headers.push(this.dtResultsObjects[i][col1].property.FieldDescriptionSmall);
              if (col1 == 0)
                groupsOrder.push(this.dtResultsObjects[i][col1].property.GroupID)
          for(var col2: number = col1 +  1; col2 < visColumnsCount; col2++) {
            if (dupColumns.indexOf(col2) == -1 
            && this.dtResultsObjects[i][col1].property.FieldDescriptionSmall == this.dtResultsObjects[i][col2].property.FieldDescriptionSmall            )
            {
              if (this.dtResultsObjects[i][col2].value
           &&  this.dtResultsObjects[i][col2].value.toString().trim() !== this.dtResultsObjects3d[i][index][0].value.toString().trim()){
            index3++
            if (index == 0)
            {
              groupsOrder.push(this.dtResultsObjects[i][col2].property.GroupID)
            }
            if (index == 2){
              let grpID:number = this.dtResultsObjects[i][col2].property.GroupID
              let order:number = groupsOrder.indexOf(grpID, 0)
              index3 = order
            }
            this.dtResultsObjects3d[i][index][index3] = this.dtResultsObjects[i][col2] 
           }      
              dupColumns.push(col2)     
            }
          }
          index++
            }
            
          }
          
        }

        this.dtTrigger.next();
        this.SpinnerService.hide();
        // let a =0
        });


}

// private async checkImgExists(image_url:string){
//   const data = await this.srv_Results.checkImgExists(image_url).toPromise();
//   console.log("Data: " + JSON.stringify(data));

// }

changeSource(event, name) { event.target.src = name; }

}
