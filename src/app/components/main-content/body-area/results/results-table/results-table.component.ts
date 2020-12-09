import { Component, OnInit,ViewChild, Input, SimpleChanges, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { ResultsService} from 'src/app/services/results.service' ;
import { ResultsStoreService} from 'src/app/services/results-store.service' ;
import { StateManagerService} from 'src/app/services/statemanager.service' ;
import { clsGroups } from 'src/app/models/results/groups';
import { clsProperties } from 'src/app/models/results/properties';
import {clsPropertyValue} from 'src/app/models/results/property-value';
import {ClsPromorionFamilies} from 'src/app/models/results/cls-promorion-families';
import {clsHelpProp} from 'src/app/models/results/help-prop';
import { AppsettingService} from 'src/app/services/appsetting.service';
import { TranslateService } from '@ngx-translate/core';
import { NgxSpinnerService } from "ngx-spinner"; 
import { Subject, Subscription, forkJoin, combineLatest } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
import { environment } from 'src/environments/environment';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ContactusComponent } from 'src/app/components/maintenance/contactus/contactus.component';
import {PpSelectColumnsComponent} from 'src/app/components/main-content/body-area/results/pp-select-columns/pp-select-columns.component';
import {PpPromotionComponent} from 'src/app/components/main-content/body-area/results/pp-promotion/pp-promotion.component';
import { DownloadresultService} from 'src/app/services/downloadresult.service';
import { ResultPpInventoryComponent } from 'src/app/components/main-content/body-area/results/result-pp-inventory/result-pp-inventory.component';
import { MachineService } from 'src/app/services/machine.service' ;
import { CookiesService } from 'src/app/services/cookies.service';
import { FeedbackComponent } from 'src/app/components/maintenance/feedback/feedback.component';

@Component({
  selector: 'app-results-table',
  templateUrl: './results-table.component.html',
  styleUrls: ['./results-table.component.scss']
})
export class ResultsTableComponent implements OnInit {
  @ViewChild(DataTableDirective, {static: false}) dtElement: DataTableDirective;
  isDtInitialized:boolean = false;

  dtTrigger: Subject<any> = new Subject();
  allSubs$: Subscription;
  environment = environment;
  dtOptions: any = {};
  // dtColumnDefs: any = {};
  dtRsults:object[];
  dtRsultsVisble:object[];
  dtFullTable:object[];
  dtPropertiesTable:clsProperties[];
  dtPropertiesTableVisible:clsProperties[];
  dtGroups:clsGroups[];
  promotionFamilies:ClsPromorionFamilies[]=[]
  dtDefaultFields:string[]=[]
  arrCurShownFields:string[]=[]
  dtResultsObjects:clsPropertyValue[][];
  dtResultsObjects3d:clsPropertyValue[][][];
  dtResultsObjects3dToShow:clsPropertyValue[][][]
  dtResultsObjectsHelp:clsHelpProp[]=[];
  dtResultShow:any;
  headers:clsProperties[] = [];
  headersOrig:clsProperties[] = [];
  arrResult:string[];
  arrResultImgsItem:string[]=[];
  arrResultImgsFamily:string[]=[];
  arrResultImgsAll:any;
  ErrMsg:boolean=false;
  lasTypeFeed:string="";
  sortProp:string="";
  sortType:string="";
  countrow:number=0;
  showingrows:number=0;
  lastTypeMainFilter:string="";
  // spanSort:string = "<span class='sort-icon ml-1'></span>"

  @Input() filterChangedRec: any ;
  @Output() goToViewEvent = new EventEmitter<any>();
  @Output() hideFilter = new EventEmitter<any>();
  processdownload:boolean=false;

  constructor(public translate: TranslateService,private srv_Results:ResultsService,private srv_StMng:StateManagerService,public srv_appsetting:AppsettingService,
    private SpinnerService: NgxSpinnerService,private modalService: NgbModal,private cdr: ChangeDetectorRef, 
    private srv_ResultsStore :ResultsStoreService,private srv_down:DownloadresultService,
    private srv_machine: MachineService,private srv_cook:CookiesService) { 
      
    }
  

    
  ngOnInit() {
    
    
     this.dtOptions = {
      pagingType: 'full_numbers',
      // "columnDefs":[{ "type": "numeric-comma" }],
    //   "columnDefs": [{ "width": "15%", "targets": 0 }
    //   ,{ "width": "15%", "targets": 1 }
    // ,{ "width": "15%", "targets": 2 }],
       "searching": false,
       "lengthChange": false ,
       "paging":false,  
       "autoWidth":false,
      "scrollY": 'calc(100vh - 336px)',
      "info":false,
       "scrollX": true,
       "scrollCollapse" : true,
       "language": {
        "emptyTable": "",
        "zeroRecords": "",
        "infoEmpty": "",
        "info": "",
        responsive: true
      }           
  }; 

//   this.dtColumnDefs = [
//     { targets: 33, type: 'num' } //0 is the column index
//  ];
  this.lasTypeFeed == 'BothFeed';
  this.sortProp = 'index';
  this.sortType = 'asc';
  this.ErrMsg = false
  this.countrow = 0
  this.lastTypeMainFilter = "FilterRec"
  this.GetResult();

  }

  // ngOnDestroy(): void {
  //   // Do not forget to unsubscribe the event
  //   this.dtTrigger.unsubscribe();
  // // }
  // ngAfterViewInit() {
  //   this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
  //     dtInstance.draw();
  //   });
  // }

  // ngAfterViewChecked(){
  //   // this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
  //   //   dtInstance.draw();
  //   // });
  // }

  GetResult() 
  {  
    if(this.srv_StMng.arrMachineSpindle == null || typeof(this.srv_StMng.arrMachineSpindle) == 'undefined') 
    {   
    this.allSubs$= this.srv_machine.getmachinedetailed(this.srv_StMng.SelectedMachine.MachineID,this.srv_appsetting.Units).subscribe((res: any) => 
      { 
        this.srv_StMng.arrMachineSpindle= JSON.parse(res);               
        this.srv_StMng.FillInputParameters();
        this.getShowTable();      
      });     
    } 
    else
    {
      this.srv_StMng.FillInputParameters();
      this.getShowTable();
    }          
  }

getShowTable(){
  this.SpinnerService.show();   
  if (this.srv_ResultsStore.checkChanged(this.srv_StMng.SecApp,this.srv_appsetting.Units,this.srv_StMng.IPLChanged))
  {
    this.srv_ResultsStore.setParams(this.srv_StMng.SecApp,this.srv_appsetting.Units,this.srv_StMng.IPLChanged)
    this.allSubs$ = forkJoin(
          this.srv_Results.getresults(this.srv_StMng.SecApp,this.srv_appsetting.Units,this.srv_StMng.IPLChanged),
          this.srv_Results.getoolproperties(this.srv_StMng.SecApp,this.srv_appsetting.Units,this.srv_StMng.IPLChanged),
          this.srv_Results.getgroups(this.srv_StMng.SecApp),
          this.srv_Results.getdefaultfields(this.srv_StMng.SecApp),
          this.srv_Results.Getfamilymovies(),
          this.srv_Results.GetPromotionFamilies()
        )
        .subscribe(([res1, res2, res3, res4,res5, res6]:[any,any,any,any,any,any]) => {
          this.srv_ResultsStore.setResults(res1, res2, res3, res4,res5, res6)
          this.renderTable(res1, res2, res3, res4,res5, res6);          
        // let a =0
        });
      }
      else{
        this.srv_ResultsStore.Currentres1.subscribe(res=>{

              let aaa = res;
         }
        );

        var _arr = [];

        _arr.push(this.srv_ResultsStore.Currentres1);
        _arr.push(this.srv_ResultsStore.Currentres2);
        _arr.push(this.srv_ResultsStore.Currentres3);
        _arr.push(this.srv_ResultsStore.Currentres4);
        _arr.push(this.srv_ResultsStore.Currentres5);
        _arr.push(this.srv_ResultsStore.Currentres6);

        this.allSubs$ = combineLatest(_arr).subscribe(resList=>{
          //-- the response will be in array
          this.renderTable(resList[0], resList[1], resList[2], resList[3],resList[4], resList[5])
      });

        // this.allSubs$ = forkJoin(
        //   this.srv_ResultsStore.Currentres1,
        //   this.srv_ResultsStore.Currentres2,
        //   this.srv_ResultsStore.Currentres3,
        //   this.srv_ResultsStore.Currentres4,
        //   this.srv_ResultsStore.Currentres5,
        //   this.srv_ResultsStore.Currentres6
        // )
        // .subscribe(([res1, res2, res3, res4,res5, res6]:[any,any,any,any,any,any]) => {
        //   this.renderTable(res1, res2, res3, res4,res5, res6)
        // // let a =0
        // });
        // this.renderTable(this.srv_ResultsStore.getRes1(), this.srv_ResultsStore.getRes2(), this.srv_ResultsStore.getRes3(), this.srv_ResultsStore.getRes4(),this.srv_ResultsStore.getRes5(), this.srv_ResultsStore.getRes6())
      }
}


renderTable(res1:any, res2:any, res3:any, res4:any,res5:any, res6:any){
  if (res1 == 'Error' || res1.length < 3){
    this.hideFilter.emit();
    this.ErrMsg = true
    this.SpinnerService.hide();
    return;
  }
  this.dtRsults =JSON.parse(res1);
  this.dtPropertiesTable = JSON.parse(res2); 
  this.dtGroups = JSON.parse(res3);
  this.dtDefaultFields = JSON.parse(res4); 
  this.arrResultImgsAll = JSON.parse(res5);
  // var obj = JSON.parse(res6);
  // this.promotionFamilies = obj.map(ele=>ele.GFNUM);
  this.promotionFamilies = JSON.parse(res6);

  if (this.dtRsults.length < 1){
    this.SpinnerService.hide();
    return;
  }
  this.arrCurShownFields = this.dtDefaultFields 
  var columnsCount = this.dtPropertiesTable.length
  var rowsCount = this.dtRsults.length

  this.dtResultsObjects = []
  // var groupsOrder:number [] =[]
  let index:number = 0;
  for(var i: number = 0; i < rowsCount; i++) {
      this.dtResultsObjects[i] = [];
      this.dtResultsObjectsHelp[i] = new clsHelpProp(this.srv_Results,i,this.srv_StMng);           
      index = 0

      for(var j: number = 0; j< columnsCount; j++) {
        
        //Build Helper

        if (this.dtPropertiesTable[j].FieldDescriptionSmall == 'Grade')
           this.dtPropertiesTable[j].IsVisible = false

        if (this.dtPropertiesTable[j].FieldDescriptionSmall == 'Average Usage'){
          if (this.dtResultsObjectsHelp[i].AverageUse)
          this.dtResultsObjectsHelp[i].AverageUse = this.dtResultsObjectsHelp[i].AverageUse + this.dtRsults[i][Object.keys(this.dtRsults[i])[j]];
          else
          this.dtResultsObjectsHelp[i].AverageUse = this.dtRsults[i][Object.keys(this.dtRsults[i])[j]];
        }
        

        if (this.dtPropertiesTable[j].Field.toLowerCase() == 'kappaleadangle')
        this.dtResultsObjectsHelp[i].kappaLeadAngle = this.dtRsults[i][Object.keys(this.dtRsults[i])[j]];

        if (this.dtPropertiesTable[j].Field == 'DetailsIsExpand'){
          if (rowsCount < 4)
          this.dtResultsObjectsHelp[i].IsExpand = "True";
          else
          this.dtResultsObjectsHelp[i].IsExpand = this.dtRsults[i][Object.keys(this.dtRsults[i])[j]];
          this.filterRecommended(this.dtResultsObjectsHelp[i]);
        }
        
        if (this.dtPropertiesTable[j].FieldDescriptionSmall == 'Brand Name')
        this.dtResultsObjectsHelp[i].BrandName.push(this.dtRsults[i][Object.keys(this.dtRsults[i])[j]]);

        if (this.dtPropertiesTable[j].Field.toLowerCase().includes('info'))
        this.dtResultsObjectsHelp[i].info.push(this.dtRsults[i][Object.keys(this.dtRsults[i])[j]]);

        if (this.dtPropertiesTable[j].FieldDescriptionSmall == 'Family' && this.dtRsults[i][Object.keys(this.dtRsults[i])[j]]){
          if (this.promotionFamilies.filter((obj) => obj.Family ==  this.dtRsults[i][Object.keys(this.dtRsults[i])[j]]).length > 0){
            this.dtResultsObjectsHelp[i].Promotion = true;
          }            
        }
        

        if (this.dtPropertiesTable[j].Field == 'SecondaryAppOrig1')
        this.dtResultsObjectsHelp[i].SecondaryAppOrig1 = this.dtRsults[i]['SecondaryAppOrig1'];


       if (this.dtPropertiesTable[j].Field == 'ItemType'){
          this.dtResultsObjectsHelp[i].itemTypeRes = this.dtRsults[i][Object.keys(this.dtRsults[i])[j]]
        }


        if (this.dtPropertiesTable[j].Field.toLowerCase().includes('catalogno') && this.dtRsults[i][Object.keys(this.dtRsults[i])[j]] && this.dtRsults[i][Object.keys(this.dtRsults[i])[j]] != '-'){
          let catNo:string = this.dtRsults[i][Object.keys(this.dtRsults[i])[j]]
          this.dtResultsObjectsHelp[i].CatalogNo.push(catNo);  
          this.dtResultsObjectsHelp[i].GroupText.push(this.dtPropertiesTable[j].GroupText); 

          let index:number = i
          this.srv_Results.getitemtype(catNo).subscribe((res: any) => {
            let typeRes:object[] = JSON.parse(res)
            let type:string = typeRes[0]['ItemType'] || ''
            let family:string= typeRes[0]['Family'] || ''
            let itemPicExists:boolean = typeRes[0]['picExists'] || false
            let catNoLoc:number = this.dtResultsObjectsHelp[index].CatalogNo.indexOf(catNo)
            this.dtResultsObjectsHelp[index].itemType.splice(catNoLoc, 0, type); 
            this.dtResultsObjectsHelp[index].Families.splice(catNoLoc, 0,family); 
             switch (type){
              //  case 'H':
              //   if (this.srv_StMng.SecApp == '57' && this.dtResultsObjectsHelp[index].GroupText[catNoLoc] == 'Tool'){
              //     this.dtResultsObjectsHelp[index].GroupText[catNoLoc] = 'Shank'
              //   }
              //  break;
               case 'T':
                this.dtResultsObjectsHelp[index].CatalogNoT.push(catNo);
                this.dtResultsObjectsHelp[index].DesgT.push(this.dtResultsObjectsHelp[index].Designation[catNoLoc]);

                if (itemPicExists){
                  this.dtResultsObjectsHelp[index].img = environment.eCatItemPictures + catNo.toString().trim() + ".gif ";
                }else{
                  let toolFamily = family.toString().trim()
                let curFamilyPic = this.arrResultImgsAll.find(i => i['Family'] == toolFamily);
                  if (curFamilyPic)
                  toolFamily = curFamilyPic['GFPIC'];
  
                  this.dtResultsObjectsHelp[index].img = environment.eCatFamilyPictures + toolFamily.toString().trim() + ".gif ";

                }
                // var url:string = environment.eCatItemPictures + catNo.toString().trim() + ".gif ";
                // this.arrResultImgsItem.splice(index, 0,url);
                // this.dtResultsObjectsHelp[index].itemImg = url

                // let toolFamily = family.toString().trim()
                // let curFamilyPic = this.arrResultImgsAll.find(i => i['Family'] == toolFamily);
                // if (curFamilyPic)
                // toolFamily = curFamilyPic['GFPIC'];

                //   var url:string = environment.eCatFamilyPictures + toolFamily.toString().trim() + ".gif ";
                //   this.arrResultImgsFamily.splice(index, 0,url);
                //   this.dtResultsObjectsHelp[index].familyImg = url

                break;
               case 'I': 
                this.dtResultsObjectsHelp[index].CatalogNoSI.push(catNo);
                this.dtResultsObjectsHelp[index].DesgSI.push(this.dtResultsObjectsHelp[index].Designation[catNoLoc]);
                // if (catNoLoc > 0 && this.dtResultsObjectsHelp[index].itemType[catNoLoc - 1] == 'T'){

                // }
                break;
                case 'S':
                  this.dtResultsObjectsHelp[index].CatalogNoSI.push(catNo);
                  this.dtResultsObjectsHelp[index].DesgSI.push(this.dtResultsObjectsHelp[index].Designation[catNoLoc]);
                  this.dtResultsObjectsHelp[index].DesgS.push(this.dtResultsObjectsHelp[index].Designation[catNoLoc]);
                  
                  // if (this.arrResultImgsItem.length < index + 1){

                    if (itemPicExists){
                      this.dtResultsObjectsHelp[index].img = environment.eCatItemPictures + catNo.toString().trim() + ".gif ";
                    }else{
                      let toolFamily = family.toString().trim()
                    let curFamilyPic = this.arrResultImgsAll.find(i => i['Family'] == toolFamily);
                      if (curFamilyPic)
                      toolFamily = curFamilyPic['GFPIC'];
      
                      this.dtResultsObjectsHelp[index].img = environment.eCatFamilyPictures + toolFamily.toString().trim() + ".gif ";
    
                    }


                    // var url:string = environment.eCatItemPictures + catNo.toString().trim() + ".gif ";
                    // this.arrResultImgsItem.splice(index, 0,url);
                    // this.dtResultsObjectsHelp[index].itemImg = url

                    // let curFamilyPic = this.arrResultImgsAll.find(i => i['Family'] == family.toString().trim());
                    // if (curFamilyPic)
                    //   family = curFamilyPic['GFPIC'];

                    //   var url:string = environment.eCatFamilyPictures + family.toString().trim() + ".gif ";
                    //   this.arrResultImgsFamily.splice(index, 0,url);
                    //   this.dtResultsObjectsHelp[index].familyImg = url
                  // }
                  
                  // if (this.srv_StMng.SecApp == '57'){
                  //   this.dtResultsObjectsHelp[index].GroupText[catNoLoc] = 'Solid Head'
                  // }
                break;
             } 

             this.updateGroupText(type,this.dtResultsObjectsHelp[index].itemTypeRes,this.dtResultsObjectsHelp[index].desgFieldName[catNoLoc],catNoLoc,index,catNo)
          })
        }
          // if (i == 0){
          //   groupsOrder.push(this.dtPropertiesTable[j].GroupID)
          // }            
        //   if (this.dtResultsObjectsHelp[i].itemType == 'H'){
        //     // this.dtResultsObjectsHelp[i].DesgSI.push(this.dtResultsObjectsHelp[i].Designation[this.dtResultsObjectsHelp[i].Designation.length - 1]);
        //     this.dtResultsObjectsHelp[i].CatalogNoSI.push(this.dtResultsObjectsHelp[i].CatalogNo[this.dtResultsObjectsHelp[i].Designation.length - 1]);
        //     // this.dtResultsObjectsHelp[i].DesgS.push(this.dtResultsObjectsHelp[i].Designation[this.dtResultsObjectsHelp[i].Designation.length - 1]);
        //   }
        //   else if (this.dtResultsObjectsHelp[i].itemType == 'T'){
        //     // this.dtResultsObjectsHelp[i].DesgSI.push(this.dtResultsObjectsHelp[i].Designation[this.dtResultsObjectsHelp[i].Designation.length - 1]);
        //     this.dtResultsObjectsHelp[i].CatalogNoSI.push(this.dtResultsObjectsHelp[i].CatalogNo[this.dtResultsObjectsHelp[i].Designation.length - 1]);
        //   }
        // }
        


        

        if (this.dtPropertiesTable[j].Field == 'ShankDiameter')
        this.dtResultsObjectsHelp[i].Dconms.push(this.dtRsults[i][Object.keys(this.dtRsults[i])[j]]);

        if (this.dtPropertiesTable[j].Field.toLowerCase().includes('designation') && this.dtRsults[i][Object.keys(this.dtRsults[i])[j]]  && this.dtRsults[i][Object.keys(this.dtRsults[i])[j]] != '-'){
          this.dtResultsObjectsHelp[i].Designation.push(this.dtRsults[i][Object.keys(this.dtRsults[i])[j]]);
          this.dtResultsObjectsHelp[i].desgFieldName.push(this.dtPropertiesTable[j].Field)
        }
        //   if (this.dtResultsObjectsHelp[i].itemType == 'H'){
        //     this.dtResultsObjectsHelp[i].DesgSI.push(this.dtResultsObjectsHelp[i].Designation[this.dtResultsObjectsHelp[i].Designation.length - 1]);
        //     // this.dtResultsObjectsHelp[i].CatalogNoSI.push(this.dtResultsObjectsHelp[i].CatalogNo[this.dtResultsObjectsHelp[i].Designation.length - 1]);
        //     this.dtResultsObjectsHelp[i].DesgS.push(this.dtResultsObjectsHelp[i].Designation[this.dtResultsObjectsHelp[i].Designation.length - 1]);
        //   }
        //   else if (this.dtResultsObjectsHelp[i].itemType == 'T'){
        //     this.dtResultsObjectsHelp[i].DesgSI.push(this.dtResultsObjectsHelp[i].Designation[this.dtResultsObjectsHelp[i].Designation.length - 1]);
        //     // this.dtResultsObjectsHelp[i].CatalogNoSI.push(this.dtResultsObjectsHelp[i].CatalogNo[this.dtResultsObjectsHelp[i].Designation.length - 1]);
        //   }
        // }
        

        // if (this.dtPropertiesTable[j].FieldDescriptionSmall == 'ItemType'){
        //   this.dtResultsObjectsHelp[i].itemType = this.dtRsults[i][Object.keys(this.dtRsults[i])[j]]
        //   if (this.dtRsults[i][Object.keys(this.dtRsults[i])[j]] == 'T'){
        //   this.dtResultsObjectsHelp[i].DesgT.push(this.dtResultsObjectsHelp[i].Designation[this.dtResultsObjectsHelp[i].Designation.length - 1]);
        //   this.dtResultsObjectsHelp[i].CatalogNoT.push(this.dtResultsObjectsHelp[i].CatalogNo[this.dtResultsObjectsHelp[i].Designation.length - 1]);
        // }
        // else if (this.dtRsults[i][Object.keys(this.dtRsults[i])[j]] == 'S'){
        //   this.dtResultsObjectsHelp[i].DesgSI.push(this.dtResultsObjectsHelp[i].Designation[this.dtResultsObjectsHelp[i].Designation.length - 1]);
        //   this.dtResultsObjectsHelp[i].CatalogNoSI.push(this.dtResultsObjectsHelp[i].CatalogNo[this.dtResultsObjectsHelp[i].Designation.length - 1]);
        //   this.dtResultsObjectsHelp[i].DesgS.push(this.dtResultsObjectsHelp[i].Designation[this.dtResultsObjectsHelp[i].Designation.length - 1]);
        // }
        // //   else if (this.dtRsults[i][Object.keys(this.dtRsults[i])[j]] == 'S'){
        // //   this.dtResultsObjectsHelp[i].DesgS.push(this.dtResultsObjectsHelp[i].Designation[this.dtResultsObjectsHelp[i].Designation.length - 1]);
        // //   // this.dtResultsObjectsHelp[i].CatalogNoS.push(this.dtResultsObjectsHelp[i].CatalogNo[this.dtResultsObjectsHelp[i].Designation.length - 1]);
        // // }
        // }
        

        // if (((this.srv_StMng.SecApp == '760' && this.dtPropertiesTable[j].Field == 'DMin') || (this.srv_StMng.SecApp != '760' && this.dtPropertiesTable[j].Field == 'Tool_D')) && this.dtRsults[i][Object.keys(this.dtRsults[i])[j]])
        // this.dtResultsObjectsHelp[i].DC = this.dtRsults[i][Object.keys(this.dtRsults[i])[j]];


        //End Build Helper
        if (this.dtPropertiesTable[j].IsVisible){

          if (this.dtPropertiesTable[j].Field.toLowerCase().includes('catalogno') && this.dtRsults[i][Object.keys(this.dtRsults[i])[j]]  && this.dtRsults[i][Object.keys(this.dtRsults[i])[j]]!= '-' ){
            this.dtResultsObjectsHelp[i].GroupID.push(this.dtPropertiesTable[j].GroupID)
            }  


          let fieldsmallSplit = this.dtPropertiesTable[j].FieldDescriptionSmall.split(" ")[0].trim();
          let value = this.dtRsults[i][Object.keys(this.dtRsults[i])[j]];
          switch (fieldsmallSplit){
            case 'DC': case 'DCX': case 'KAPR': case 'APMX':case 'RE':case 'CHW':case 'PSIR':case 'L':case 'IC':case 'CEDC':case 'CW':case 'ZEFF':
              if (value && value > 0){
              this.dtResultsObjectsHelp[i][fieldsmallSplit] = value;
              }
              break;
            case 'LU':
              if (value && value > 0){
                this.dtResultsObjectsHelp[i][fieldsmallSplit] = value;
              }
              break;
            // case 'LH':
            //   if (typeof this.dtResultsObjectsHelp[i].LU == 'undefined'){
            //     this.dtResultsObjectsHelp[i].LU = value;
            //   }
            //   break;
            case 'LF':
              break;
            case 'LB':
              break;
            case 'NOF':
              if (value && value > 0){
                this.dtResultsObjectsHelp[i][fieldsmallSplit] = value;
              }
              break;
            case 'CICT':
              if (typeof this.dtResultsObjectsHelp[i].NOF == 'undefined'){
                this.dtResultsObjectsHelp[i].NOF = value;
              }
              break;

              case 'TGC': case 'MCB': case 'TCB':
                this.dtPropertiesTable[j].FieldDescriptionSmall = fieldsmallSplit + ' (' + this.srv_StMng.IPL.GetItem('Currency').value + '/batch)'
                // this.dtRsults[i][Object.keys(this.dtRsults[i])[j]] = this.dtRsults[i][Object.keys(this.dtRsults[i])[j]].split(" ")[0].trim();
              break;
              case 'CPU':
                this.dtPropertiesTable[j].FieldDescriptionSmall = fieldsmallSplit + ' (' + this.srv_StMng.IPL.GetItem('Currency').value + '/unit)'
                // this.dtRsults[i][Object.keys(this.dtRsults[i])[j]] = this.dtRsults[i][Object.keys(this.dtRsults[i])[j]].split(" ")[0].trim();
              break;
              case 'List':
                this.dtPropertiesTable[j].FieldDescriptionSmall = 'List Price' + ' (' + this.srv_StMng.IPL.GetItem('Currency').value + ')'
              break;
              case 'Corner':
                if ( this.dtPropertiesTable[j].FieldDescriptionSmall == 'Corner Price')
                    this.dtPropertiesTable[j].FieldDescriptionSmall = 'Corner Price' + ' (' + this.srv_StMng.IPL.GetItem('Currency').value + ')'
                break;

          }

          this.dtResultsObjects[i][index] = new clsPropertyValue()
          this.dtResultsObjects[i][index].property = this.dtPropertiesTable[j]
          if (!this.dtRsults[i][Object.keys(this.dtRsults[i])[j]])
          this.dtRsults[i][Object.keys(this.dtRsults[i])[j]] = '';
          this.dtResultsObjects[i][index].value = this.dtRsults[i][Object.keys(this.dtRsults[i])[j]]

          if (this.dtDefaultFields.indexOf(this.dtPropertiesTable[j].FieldDescriptionSmall) === -1){
            this.dtResultsObjects[i][index].property.IsShow = false;
          }
          else{
            this.dtResultsObjects[i][index].property.IsShow = true;
          }

          index++

          
        //   if (this.dtPropertiesTable[j].FieldDescriptionSmall == "Catalog No" && '/Tool/Blade/Square shank'.indexOf(this.dtPropertiesTable[j].GroupText) !== -1){
        //     var url:string = environment.eCatItemPictures + this.dtRsults[i][Object.keys(this.dtRsults[i])[j]].toString().trim() + ".gif ";
        //     this.arrResultImgsItem.push(url);

        // }
      }


      if (this.dtPropertiesTable[j].FieldDescriptionSmall == 'Grade'){
        // this.dtPropertiesTable[j].IsVisible = false
        let gradeIndex:number = this.dtResultsObjectsHelp[i].GroupID.indexOf(this.dtPropertiesTable[j].GroupID)
        if (gradeIndex != -1)
        this.dtResultsObjectsHelp[i].Grade[gradeIndex] =  this.dtRsults[i][Object.keys(this.dtRsults[i])[j]]
      }


        // if (this.dtPropertiesTable[j].FieldDescriptionSmall.includes('Family')  && '/Tool/Blade/Square shank'.indexOf(this.dtPropertiesTable[j].GroupText) !== -1){
        //   let family:string = this.dtRsults[i][Object.keys(this.dtRsults[i])[j]].toString().trim();
          
          
        //   let curFamilyPic = this.arrResultImgsAll.find(i => i['Family'] == family.toString().trim());
        //   if (curFamilyPic)
        //     family = curFamilyPic['GFPIC'];

        //     var url:string = environment.eCatFamilyPictures + family.toString().trim() + ".gif ";
        //     this.arrResultImgsFamily.push(url);

        // }

     
          
      }

    }

  this.countShowingRows()
  var visColumnsCount = this.dtResultsObjects[0].length
  this.dtResultsObjects3d = []
  let index3:number = 0;
  var dupColumns:number [] = []
  
  for(var i: number = 0; i < rowsCount; i++) {
    this.dtResultsObjects3d[i] = []
    index = 0
    dupColumns = []
    // groupsOrder = []
  for(var col1: number = 0; col1 < visColumnsCount; col1++) {
    if(dupColumns.indexOf(col1) == -1){
      this.dtResultsObjects3d[i][index] = []
      index3 = 0
     
      if (this.dtResultsObjects[i][col1].property.Field.toLowerCase().includes('listprice') || this.dtResultsObjects[i][col1].property.Field.toLowerCase().includes('pricepercorner')){
        let grpID:number = this.dtResultsObjects[i][col1].property.GroupID
        let order:number = this.dtResultsObjectsHelp[i].GroupID.indexOf(grpID, 0)
        index3 = order
        for(var brandNamePos: number = 0; brandNamePos < index3; brandNamePos++) {
          this.dtResultsObjects3d[i][index][brandNamePos] = new clsPropertyValue() 
          this.dtResultsObjects3d[i][index][brandNamePos].value = ''
        }
        for(var brandNamePos: number = index3 + 1; brandNamePos < this.dtResultsObjectsHelp[i].GroupID.length; brandNamePos++) {
          this.dtResultsObjects3d[i][index][brandNamePos] = new clsPropertyValue() 
          this.dtResultsObjects3d[i][index][brandNamePos].value = ''
        }
      }
      this.dtResultsObjects3d[i][index][index3] = this.dtResultsObjects[i][col1]
      if (i==0)
        this.headers.push(this.dtResultsObjects[i][col1].property);
      
  for(var col2: number = col1 +  1; col2 < visColumnsCount; col2++) {
    if (dupColumns.indexOf(col2) == -1 
    && (this.dtResultsObjects[i][col1].property.FieldDescriptionSmall == this.dtResultsObjects[i][col2].property.FieldDescriptionSmall
      ||(this.dtResultsObjects[i][col1].property.Field.toLowerCase().includes('catalogno') && this.dtResultsObjects[i][col2].property.Field.toLowerCase().includes('catalogno'))
      ||(this.dtResultsObjects[i][col1].property.Field.toLowerCase().includes('designation') && this.dtResultsObjects[i][col2].property.Field.toLowerCase().includes('designation'))))
    {
      if (this.dtResultsObjects[i][col2].value
   &&  this.dtResultsObjects[i][col2].value.toString().trim() !== this.dtResultsObjects3d[i][index][0].value.toString().trim()){
    index3++
    // if (index == 0)
    // {
    //   groupsOrder.push(this.dtResultsObjects[i][col2].property.GroupID)
    // }
    if (this.dtResultsObjects[i][col1].property.Field.toLowerCase().includes('listprice') || this.dtResultsObjects[i][col1].property.Field.toLowerCase().includes('pricepercorner')){
      let grpID:number = this.dtResultsObjects[i][col2].property.GroupID
      let order:number = this.dtResultsObjectsHelp[i].GroupID.indexOf(grpID, 0)
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
this.countrow = this.dtResultsObjects3d.length
this.headersOrig = JSON.parse(JSON.stringify(this.headers));
//  this.dtTrigger.next();
if(this.dtElement){
if (this.dtElement.dtInstance) {
  this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
    dtInstance.destroy();
    this.dtTrigger.next();
    // dtInstance.columns.adjust().draw();
  });
} else {
  this.isDtInitialized = true
  this.dtTrigger.next();
} }
else{
  this.dtTrigger = null
}

// if (this.dtElement.dtInstance) {
//   this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
//   dtInstance.columns.adjust().draw();
//   })
// }

  
  this.SpinnerService.hide();
  
  if(this.srv_cook.get_cookie("notshowfeedback")=="")
  {    
    setTimeout(() => { this.feedback(); }, 40000);
  }    
}

changeSource(event, name) { event.target.src = name; }

openSelectColumns(){
  const modalRef = this.modalService.open(PpSelectColumnsComponent, { centered: true });
  modalRef.componentInstance.modal_columns = this.headers;
  modalRef.componentInstance.modal_columns_Org = this.headersOrig
  modalRef.result.then((result) => {
    if (result) {
    console.log(result);
      if(result != 'A'){
         this.headers = result
         let newDefaultFields = this.headers.reduce((a, o) => (o.IsShow && a.push(o.FieldDescriptionSmall), a), [])
         this.srv_ResultsStore.setNewDefaultFields(JSON.stringify(newDefaultFields))
         this.cdr.detectChanges();
        // this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
        //   dtInstance.destroy();
        //   this.dtTrigger.next();
        // });
      }
    }
    }, () => console.log('Rejected!'));
}


 trackItem (index: number, item: clsProperties):boolean {
  return item.IsShow;
}

customTB(index, song) { return `${index}-${song.id}`; }

// trackHelp(index: number, item: clsHelpProp):number {
//   return item.isHidden;
// }

updateGroupText(itemType:string,resultType:string,field:string,catalogNoLoc:number,index:number,catalogNo:string){
switch(this.srv_StMng.SecApp.toString()){
    case '760':  case '770': case '780': case '790': case '57': case '119': case '120':
      switch(field){
        case 'HolderDesignation' :
          this.dtResultsObjectsHelp[index].GroupText[catalogNoLoc] = 'Holder'
          break;
        case 'HolderDesignationCollet':
          this.dtResultsObjectsHelp[index].GroupText[catalogNoLoc] = 'Collet'
          break;
        case 'HeaderDesignation':
          switch(itemType){
            case 'T':
              this.dtResultsObjectsHelp[index].GroupText[catalogNoLoc] = 'Tool'
              for (let entry of this.dtResultsObjectsHelp[index].CatalogNoT) {
              this.srv_Results.getfzminf(entry.trim(),this.dtResultsObjectsHelp[index].SecondaryAppOrig1).subscribe((res: any) => {
                let _FzminF = JSON.parse(res)
                if (_FzminF.trim().startsWith('02,307-01,') || _FzminF == '01,307-01,SAI'  && this.dtResultsObjectsHelp[index].itemType.indexOf('S') == -1){
                  this.dtResultsObjectsHelp[index].GroupText[catalogNoLoc] = 'Head'
                }     
              })}
              
            break;
            case 'H':
              this.dtResultsObjectsHelp[index].GroupText[catalogNoLoc] = 'Shank'
            break;
          }
          break;
        case 'DetailsDesignation':
          switch(itemType){
            case 'I':
              this.dtResultsObjectsHelp[index].GroupText[catalogNoLoc] = 'Insert'
            break;
            case 'S':
              switch(resultType){
                case 'H':
                  this.dtResultsObjectsHelp[index].GroupText[catalogNoLoc] = 'Solid Head'
                break;
                case 'S':
                  this.dtResultsObjectsHelp[index].GroupText[catalogNoLoc] = 'Solid'
                break;
              }
            break;
          }
          break;
      }
    break
    case '960':  case '970': case '980': case '990':
      switch(field){
        case 'HeaderDesignation' :
          this.dtResultsObjectsHelp[index].GroupText[catalogNoLoc] = 'Holder'
          break;
        case 'HeaderDesignation1':
          this.dtResultsObjectsHelp[index].GroupText[catalogNoLoc] = 'Square shank'
          break;
        case 'DetailsDesignation':
          this.dtResultsObjectsHelp[index].GroupText[catalogNoLoc] = 'Insert'
          break;
      }
    break
    case '850':  case '860': case '870': case '880': case '890': 
    switch(field){
      case 'HeaderDesignation' :
        this.dtResultsObjectsHelp[index].GroupText[catalogNoLoc] = 'Holder'
        break;
      case 'HeaderDesignation1':
        this.dtResultsObjectsHelp[index].GroupText[catalogNoLoc] = 'Round shank holder'
        break;
      case 'HeaderDesignation2':
          this.dtResultsObjectsHelp[index].GroupText[catalogNoLoc] = 'Tool'
        break;
      case 'DetailsDesignation':
        switch(itemType){
          case 'S':
            this.dtResultsObjectsHelp[index].GroupText[catalogNoLoc] = 'Solid'
          break;
          case 'I':
            this.dtResultsObjectsHelp[index].GroupText[catalogNoLoc] = 'Insert'
          break;
        }
        break;
    }
    break
    case '52':  case '1': case '51': case '54': case '19': 
    switch(field){
      case 'HeaderDesignation' :
        this.dtResultsObjectsHelp[index].GroupText[catalogNoLoc] = 'Holder'
        break;
      case 'HeaderDesignation1':
        this.dtResultsObjectsHelp[index].GroupText[catalogNoLoc] = 'Square shank'
        break;
      case 'HeaderDesignation2':
        this.srv_Results.GetFlatDataField('OperationType',catalogNo,this.srv_StMng.SecApp,this.srv_appsetting.Units).subscribe((res: any) => {
          let fieldValue:string = JSON.parse(res)
          switch(fieldValue){
            case 'BLADE':
              this.dtResultsObjectsHelp[index].GroupText[catalogNoLoc] = 'Blade'
              break;
            case 'ADAPTER':
              this.dtResultsObjectsHelp[index].GroupText[catalogNoLoc] = 'Holder'
              break;
          }
        })
        break;
      case 'DetailsDesignation':
        this.dtResultsObjectsHelp[index].GroupText[catalogNoLoc] = 'Insert'
        break;
    }
    break
    case '188':  case '53': case '50': 
    switch(field){
      case 'HeaderDesignation' :
        this.dtResultsObjectsHelp[index].GroupText[catalogNoLoc] = 'Holder'
        break;
      case 'HeaderDesignation1':
        this.dtResultsObjectsHelp[index].GroupText[catalogNoLoc] = 'Round shank holder'
        break;
      case 'HeaderDesignation2':
        this.srv_Results.GetFlatDataField('OperationType',catalogNo,this.srv_StMng.SecApp,this.srv_appsetting.Units).subscribe((res: any) => {
          let fieldValue:string = JSON.parse(res)
          switch(fieldValue){
            case 'BLADE':
              this.dtResultsObjectsHelp[index].GroupText[catalogNoLoc] = 'Blade'
              break;
            case 'ADAPTER':
              this.dtResultsObjectsHelp[index].GroupText[catalogNoLoc] = 'Holder'
              break;
            case 'BORING BAR':
              this.dtResultsObjectsHelp[index].GroupText[catalogNoLoc] = 'Tool'
              break;
          }
        })
        break;
      case 'DetailsDesignation':
        this.dtResultsObjectsHelp[index].GroupText[catalogNoLoc] = 'Insert'
        break;
    }
    break
    case '77': 
    switch(field){
      case 'HolderDesignation' :
        this.dtResultsObjectsHelp[index].GroupText[catalogNoLoc] = 'Holder'
        break;
      case 'HolderDesignationCollet':
        this.dtResultsObjectsHelp[index].GroupText[catalogNoLoc] = 'Collet'
        break;
      case 'HeaderDesignation':
        this.dtResultsObjectsHelp[index].GroupText[catalogNoLoc] = 'Tool'
        break;
      case 'DetailsDesignation':
        if (this.dtResultsObjectsHelp[index].itemType.indexOf('S') != -1){
          this.dtResultsObjectsHelp[index].GroupText[catalogNoLoc] = 'Solid'
        }
        else{
          if (this.dtResultsObjectsHelp[index].ZEFF >= 2) 
          this.dtResultsObjectsHelp[index].GroupText[catalogNoLoc] = 'Head'
          else
          this.dtResultsObjectsHelp[index].GroupText[catalogNoLoc] = 'External Insert'
        }
        
        
        break;
      case 'DetailsIntDesignation':
        this.dtResultsObjectsHelp[index].GroupText[catalogNoLoc] = 'Internal insert'
        break;
      case 'EccenterDesignation':
        this.dtResultsObjectsHelp[index].GroupText[catalogNoLoc] = 'Eccenter'
        break;
      case 'CartridgeIntDesignation':
        this.dtResultsObjectsHelp[index].GroupText[catalogNoLoc] = 'Cartridge Int'
        break;
      case 'CartridgeExtDesignation':
        this.dtResultsObjectsHelp[index].GroupText[catalogNoLoc] = 'Cartridge Ext'
        break;
      case 'ShimPartDesignation':
        this.dtResultsObjectsHelp[index].GroupText[catalogNoLoc] = 'Shim Part'
        break;
    }
    break
}
}

ngOnChanges(changes:SimpleChanges) {

  if (this.filterChangedRec && changes.filterChangedRec){
    
    for(var i: number = 0; i < this.dtResultsObjectsHelp.length; i++){
      switch (this.filterChangedRec.control){
        case 'ST':
          if (this.srv_StMng.SecApp == '77')
          {
            if (this.dtResultsObjectsHelp[i].itemType.indexOf('S') != -1){
              if (!this.filterChangedRec.Res)
                  this.dtResultsObjectsHelp[i].isHidden++
              else
                  this.dtResultsObjectsHelp[i].isHidden--
            }
          }
          else{
            this.dtResultsObjectsHelp[i].checkFzminF(this.filterChangedRec.Res,this.filterChangedRec.control);
            // if (this.dtResultsObjectsHelp[i].DesgS.filter(s => !s.startsWith('MM')).length > 0){
            //   if (!this.filterChangedRec.Res)
            //       this.dtResultsObjectsHelp[i].isHidden++
            //   else
            //       this.dtResultsObjectsHelp[i].isHidden--
            //  }  
          }    
          break;
       case 'SH':
        if (this.srv_StMng.SecApp == '77')
        {
          if (this.dtResultsObjectsHelp[i].itemType.indexOf('T') != -1 && this.dtResultsObjectsHelp[i].ZEFF >= 2){
            if (!this.filterChangedRec.Res)
                this.dtResultsObjectsHelp[i].isHidden++
            else
                this.dtResultsObjectsHelp[i].isHidden--
          }
        }
        else{
          this.dtResultsObjectsHelp[i].checkFzminF(this.filterChangedRec.Res,this.filterChangedRec.control);
          // if (this.dtResultsObjectsHelp[i].DesgS.filter(s => s.startsWith('MM')).length > 0){
          //   if (!this.filterChangedRec.Res)
          //       this.dtResultsObjectsHelp[i].isHidden++
          //   else
          //       this.dtResultsObjectsHelp[i].isHidden--
          // }
        }
          break;
        case 'IT':
          if (this.srv_StMng.SecApp == '77'){
            if (this.dtResultsObjectsHelp[i].itemType.indexOf('T') != -1 && this.dtResultsObjectsHelp[i].ZEFF < 2){
              if (!this.filterChangedRec.Res)
                  this.dtResultsObjectsHelp[i].isHidden++
              else
                  this.dtResultsObjectsHelp[i].isHidden--
            }
          }
          else{
            this.dtResultsObjectsHelp[i].checkFzminF(this.filterChangedRec.Res,this.filterChangedRec.control);
          }
          break;  
        case 'IH':
          this.dtResultsObjectsHelp[i].checkFzminF(this.filterChangedRec.Res,this.filterChangedRec.control);
          break;   
        case 'TypeFeed':
          switch (this.filterChangedRec.Res){
            case 'BothFeed':
              if (this.lasTypeFeed == 'HightFeed'){
                if (this.srv_StMng.SecApp == '760' && this.dtResultsObjectsHelp[i].SecondaryAppOrig1 != '700')
                  {this.dtResultsObjectsHelp[i].isHidden--}
                if (this.srv_StMng.SecApp == '770' && this.dtResultsObjectsHelp[i].SecondaryAppOrig1 != '710')
                  {this.dtResultsObjectsHelp[i].isHidden--}
                if (this.srv_StMng.SecApp == '780' && this.dtResultsObjectsHelp[i].SecondaryAppOrig1 != '730')
                  {this.dtResultsObjectsHelp[i].isHidden--}                                    
                if (this.srv_StMng.SecApp == '790' && this.dtResultsObjectsHelp[i].SecondaryAppOrig1 != '740')
                  {this.dtResultsObjectsHelp[i].isHidden--}    
              }
              if (this.lasTypeFeed == 'NormalFeed'){
                if (this.srv_StMng.SecApp == '760' && this.dtResultsObjectsHelp[i].SecondaryAppOrig1 != '59')
                  {this.dtResultsObjectsHelp[i].isHidden--}
                if (this.srv_StMng.SecApp == '770' && this.dtResultsObjectsHelp[i].SecondaryAppOrig1 != '61')
                  {this.dtResultsObjectsHelp[i].isHidden--}
                if (this.srv_StMng.SecApp == '780' && this.dtResultsObjectsHelp[i].SecondaryAppOrig1 != '720')
                  {this.dtResultsObjectsHelp[i].isHidden--}                                    
                if (this.srv_StMng.SecApp == '790' && this.dtResultsObjectsHelp[i].SecondaryAppOrig1 != '750')
                  {this.dtResultsObjectsHelp[i].isHidden--}   
              }
              break;
            case 'HightFeed':
              
                  if (this.srv_StMng.SecApp == '760' && this.dtResultsObjectsHelp[i].SecondaryAppOrig1 != '700')
                    {this.dtResultsObjectsHelp[i].isHidden++}
                  if (this.srv_StMng.SecApp == '770' && this.dtResultsObjectsHelp[i].SecondaryAppOrig1 != '710')
                    {this.dtResultsObjectsHelp[i].isHidden++}
                  if (this.srv_StMng.SecApp == '780' && this.dtResultsObjectsHelp[i].SecondaryAppOrig1 != '730')
                    {this.dtResultsObjectsHelp[i].isHidden++}                                    
                  if (this.srv_StMng.SecApp == '790' && this.dtResultsObjectsHelp[i].SecondaryAppOrig1 != '740')
                    {this.dtResultsObjectsHelp[i].isHidden++}    
                    if (this.lasTypeFeed == 'NormalFeed'){
                      if (this.srv_StMng.SecApp == '760' && this.dtResultsObjectsHelp[i].SecondaryAppOrig1 != '59')
                        {this.dtResultsObjectsHelp[i].isHidden--}
                      if (this.srv_StMng.SecApp == '770' && this.dtResultsObjectsHelp[i].SecondaryAppOrig1 != '61')
                        {this.dtResultsObjectsHelp[i].isHidden--}
                      if (this.srv_StMng.SecApp == '780' && this.dtResultsObjectsHelp[i].SecondaryAppOrig1 != '720')
                        {this.dtResultsObjectsHelp[i].isHidden--}                                    
                      if (this.srv_StMng.SecApp == '790' && this.dtResultsObjectsHelp[i].SecondaryAppOrig1 != '750')
                        {this.dtResultsObjectsHelp[i].isHidden--}   
                    }           
              break;
            case 'NormalFeed':          
                  if (this.srv_StMng.SecApp == '760' && this.dtResultsObjectsHelp[i].SecondaryAppOrig1 != '59')
                    {this.dtResultsObjectsHelp[i].isHidden++}
                  if (this.srv_StMng.SecApp == '770' && this.dtResultsObjectsHelp[i].SecondaryAppOrig1 != '61')
                    {this.dtResultsObjectsHelp[i].isHidden++}
                  if (this.srv_StMng.SecApp == '780' && this.dtResultsObjectsHelp[i].SecondaryAppOrig1 != '720')
                    {this.dtResultsObjectsHelp[i].isHidden++}                                    
                  if (this.srv_StMng.SecApp == '790' && this.dtResultsObjectsHelp[i].SecondaryAppOrig1 != '750')
                    {this.dtResultsObjectsHelp[i].isHidden++}   
                    if (this.lasTypeFeed == 'HightFeed'){
                      if (this.srv_StMng.SecApp == '760' && this.dtResultsObjectsHelp[i].SecondaryAppOrig1 != '700')
                        {this.dtResultsObjectsHelp[i].isHidden--}
                      if (this.srv_StMng.SecApp == '770' && this.dtResultsObjectsHelp[i].SecondaryAppOrig1 != '710')
                        {this.dtResultsObjectsHelp[i].isHidden--}
                      if (this.srv_StMng.SecApp == '780' && this.dtResultsObjectsHelp[i].SecondaryAppOrig1 != '730')
                        {this.dtResultsObjectsHelp[i].isHidden--}                                    
                      if (this.srv_StMng.SecApp == '790' && this.dtResultsObjectsHelp[i].SecondaryAppOrig1 != '740')
                        {this.dtResultsObjectsHelp[i].isHidden--}    
                    }
              break;
          }   
          break;  
          case 'optFilter':
            switch (this.filterChangedRec.Res){
              case 'FilterRec':
                this.filterRecommended(this.dtResultsObjectsHelp[i]);
                this.sortProp = 'index';
                this.sortType = 'asc';
                  // if (this.dtResultsObjectsHelp[i].IsExpand == "False")
                  // this.dtResultsObjectsHelp[i].isHidden++
                break;
              case 'FilteAllRes':
                  if (this.dtResultsObjectsHelp[i].IsExpand == "False")
                  this.dtResultsObjectsHelp[i].isHidden--
                  this.sortProp = 'index';
                  this.sortType = 'asc';
                break;
              case 'FilterSeller':
                // if (this.dtResultsObjectsHelp[i].AverageUse < 1)
                //   this.dtResultsObjectsHelp[i].isHidden++
                  this.sortProp = 'AverageUse';
                  this.sortType = 'desc';
                  if(this.lastTypeMainFilter == "FilterRec" && this.dtResultsObjectsHelp[i].IsExpand == "False"){
                    this.dtResultsObjectsHelp[i].isHidden--
                  }
                break;
            }
            break;   
            // case 'optSort':
            //   switch (this.filterChangedRec.Res){
            //     case 'SortRec':
            //       this.sortProp = 'index';
            //       break;
            //     case 'SortSeller':
            //       this.sortProp = 'AverageUse';
            //       break;
            //   }
            //   return;  
              
            case 'filterList':
              let field:string = this.filterChangedRec.Res[0];
              let value:string = this.filterChangedRec.Res[1];
              // if (this.dtResultsObjectsHelp[i][field])
              switch (this.filterChangedRec.Res[2]){
                case 'T': case 'F':
                  this.InternalCoolant(field,value,this.filterChangedRec.Res[2],this.srv_appsetting.Units,i)
                  // if (this.dtResultsObjectsHelp[i][field].filter(s => s == value).length > 0)
                  //       this.dtResultsObjectsHelp[i].isHidden--
                  break;
                // case 'F':
                //  this.dtResultsObjectsHelp[i].InternalCoolant(field,value,this.filterChangedRec.Res[2],this.srv_appsetting.Units)
                //   // if (this.dtResultsObjectsHelp[i][field].filter(s => s == value).length > 0)
                //   //     this.dtResultsObjectsHelp[i].isHidden++
                //   break;
                case 'S':
                  if (this.dtResultsObjectsHelp[i][field].filter(s => !s.toUpperCase().includes(value)).length > 0)
                      this.dtResultsObjectsHelp[i].isHidden++
                  break;
                case 'CS':
                  if (this.dtResultsObjectsHelp[i][field].filter(s => !s.toUpperCase().includes(value)).length > 0)
                        this.dtResultsObjectsHelp[i].isHidden--
                  break;
              }
              console.log(i + " " + this.dtResultsObjectsHelp[i].isHidden);
              break;

              case 'scrolList':
                let fieldS:string = this.filterChangedRec.Res[0];
                let minValue:string = this.filterChangedRec.Res[1];
                let maxValue:string = this.filterChangedRec.Res[2];
                if (this.dtResultsObjectsHelp[i][fieldS] < minValue || this.dtResultsObjectsHelp[i][fieldS] > maxValue)
                        {this.dtResultsObjectsHelp[i].isHidden++}    
                else
                        {this.dtResultsObjectsHelp[i].isHidden--}  
                console.log(i + " " + this.dtResultsObjectsHelp[i].isHidden);
                break;
                case 'ClearAll':
                  this.dtResultsObjectsHelp[i].isHidden = 0;
                  this.sortProp = 'index';
                  this.sortType = 'asc';
                  this.filterRecommended(this.dtResultsObjectsHelp[i]);
                  break;


                  case 'Promotion':
                    if (this.filterChangedRec.Res){
                      if (!this.dtResultsObjectsHelp[i].Promotion)
                        this.dtResultsObjectsHelp[i].isHidden++
                    }
                    else{
                      if (!this.dtResultsObjectsHelp[i].Promotion)
                        this.dtResultsObjectsHelp[i].isHidden--
                    }
                    break;
      }
    
      
    }

    this.countShowingRows()
    if (this.filterChangedRec.control == 'TypeFeed')
      this.lasTypeFeed = this.filterChangedRec.Res;
    
      if (this.filterChangedRec.control == 'optFilter')
      this.lastTypeMainFilter = this.filterChangedRec.Res;

      if (this.filterChangedRec.control == 'ClearAll')
      this.lastTypeMainFilter = "FilterRec"
  }
  
}

countShowingRows(){
  this.showingrows = this.dtResultsObjectsHelp.filter((obj) => obj.isHidden < 1).length;
}
filterRecommended(prop:clsHelpProp){
    if (prop.IsExpand == "False")
        prop.isHidden++
    // else
    //     prop.isHidden--

        // if(this.lastTypeMainFilter == "FilterSeller" && prop.AverageUse < 1){
        //   prop.isHidden--
        // }
}


viewInfo(index:number)
{
  this.goToViewEvent.emit({control:'View',Res:[this.dtResultsObjectsHelp[index],this.dtResultsObjects3d[index]]})
}

getPropWithoutUnits(pr:string){
  let indexOfU:number = pr.lastIndexOf('(')
  if (indexOfU != -1){
    return pr.substring(0,indexOfU)
  }
  else{
    return pr;
  }
}

DownLoadPDF()
{    
    this.srv_down.PDFListLoaded.subscribe((res:any) => {this.processdownload =false;}); 
    this.processdownload =true; 
    this.SpinnerService.show(); 
    this.srv_appsetting.curDate= new Date().toString();   
    setTimeout( () => {this.srv_down.DownLoadData('PDF');}, 1000 ); 
    setTimeout( () => {this.SpinnerService.hide();}, 4000 );      
}

viewInventory(index:number)
{    
  const modalRef = this.modalService.open(ResultPpInventoryComponent, { centered: true });
  modalRef.componentInstance.objHelpProp = this.dtResultsObjectsHelp[index];  
}


contactus()
{
  const modalRef = this.modalService.open(ContactusComponent,{ size: 'lg' ,centered: true});                  
}

goToCatalog(rowIndex:number,itemIndex:number){
  // if (row.trim().length != 7){
  //   return this.sanitizer.bypassSecurityTrustResourceUrl('')
  // }
  // let _index:number = this.selectedOption.CatalogNo.indexOf(row)
  let mapp:string = 'IT'
  if (this.dtResultsObjectsHelp[rowIndex].itemType[itemIndex].trim() != 'H'){
    mapp = this.srv_StMng.SecAppSelected.MainApp
  }

  let url:string = environment.eCatItemPage + this.dtResultsObjectsHelp[rowIndex].CatalogNo[itemIndex].trim()  + '&fnum=' + this.dtResultsObjectsHelp[rowIndex].Families[itemIndex].trim()
   + '&mapp=' + mapp + '&GFSTYP=' + this.srv_appsetting.Units + '&lang=' + this.srv_appsetting.Lang

   window.open(url, "_blank");
  // return this.sanitizer.bypassSecurityTrustResourceUrl(url);
}


openPromotion(index:number){

let families:string[] = this.dtResultsObjectsHelp[index].Families
let img:string = ""
for (let x in families) {
  let index1 = this.promotionFamilies.findIndex(i => i.Family == families[x]);
  if (index1 > -1){
    img = this.promotionFamilies[index1].PromotionPDF
    const modalRef = this.modalService.open(PpPromotionComponent, { centered: true,windowClass:"customModalClass"});
    modalRef.componentInstance.pdFile = img;
    break;
  }
}

}

columnName(colName:string){

  return colName + '<span class="sort-icon ml-1"></span>'

}

getValue(col:clsPropertyValue[]){
  let value:string = ''
  for (var val of col) {
    value = value + val.value
  }
  return value;
}


InternalCoolant(filed:string,value:string,checked:string,units:string,index:number){

  if (this.dtResultsObjectsHelp[index][filed]){
      this.dtResultsObjectsHelp[index].InternalCoolantFilter(filed,value,checked)
       if(index == (this.dtResultsObjectsHelp.length - 1))
       setTimeout(() => {
        this.countShowingRows() 
      }, 100)
  }
  else{
      //get CSP/CP value
      //CatalogNoT - Cool - EffZ
      if (this.dtResultsObjectsHelp[index].CatalogNoT && this.dtResultsObjectsHelp[index].CatalogNoT[0].trim().length == 7){
      this.srv_Results.GetFlatDataField(filed == 'CSP' ? 'Cool' : 'EffZ' ,this.dtResultsObjectsHelp[index].CatalogNoT[0].trim(),this.srv_StMng.SecApp,units).subscribe((res: any) => {
          let fieldValue:string = JSON.parse(res)
          this.dtResultsObjectsHelp[index][filed] = fieldValue
          this.dtResultsObjectsHelp[index].InternalCoolantFilter(filed,value,checked)
          if(index == (this.dtResultsObjectsHelp.length - 1))
          setTimeout(() => {
            this.countShowingRows() 
          }, 100)
          
          // (index == (this.dtResultsObjectsHelp.length - 1)) ? this.countShowingRows() : ''
      })
  }
  else{
      }
  }
  }
feedback()
{
  const modalRef = this.modalService.open(FeedbackComponent,{ backdrop: 'static',centered: true, windowClass: 'feedback-modal' });
  modalRef.result.then((result) => {
    if(result=='cancel') return;
    if(result=='send') this.srv_cook.set_cookie("notshowfeedback",'1');    
  });    
} 

}

