import { Component, OnInit, ViewChild, ElementRef, AfterViewInit} from '@angular/core';
import { ResultsTableComponent } from 'src/app/components/main-content/body-area/results/results-table/results-table.component';
import {ResultPpDownloadComponent} from 'src/app/components/main-content/body-area/results/result-pp-download/result-pp-download.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DownloadresultService} from 'src/app/services/downloadresult.service';
import { environment } from 'src/environments/environment';
import { NgxSpinnerService } from "ngx-spinner"; 
import { StateManagerService} from 'src/app/services/statemanager.service' ;
import { DatalayerService} from 'src/app/services/datalayer.service' ;
import { AppsettingService} from 'src/app/services/appsetting.service';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.scss']
})

export class ResultsComponent implements OnInit, AfterViewInit { 

filterChanged:any;
viewParams:any;
MainPage:boolean = true;
active = 1;
IsExport:boolean;
environment = environment;  
navigationSubscription;
_hideFilter:boolean;

@ViewChild('resTable', {static: false}) resTable: ResultsTableComponent;

eventsSubject: Subject<void> = new Subject<void>();

  constructor(private modalService: NgbModal,private SpinnerService: NgxSpinnerService,
    private srv_down:DownloadresultService, public srv_statemanage:StateManagerService,private srv_DataLayer:DatalayerService,
    private srv_appsetting:AppsettingService) { }
  ngAfterViewInit() {
    console.log(this.resTable); 
  }

  ngOnInit() {
    this.srv_down.PDFListLoaded.subscribe((res:any) => {this.processdownload =false;});
    this.MainPage = true;   
    this._hideFilter = false; 
  }

  receiveFilterChange(value){
    this.filterChanged = value;
  }

  getHelpFilter(){

  }
  goToView(value){
    this.MainPage = false;
    this.viewParams = value;
    this.active = 1;
  }

  switchPage(){
    this.MainPage = true;
  }

  mat_desc:string;
  processdownload:boolean=false;

  hideFilter(event){
    this._hideFilter = true;
  }

  DownLoadResults()
  {  
   const modalRef = this.modalService.open(ResultPpDownloadComponent, { centered: true });
      
   modalRef.result.then((result) => {
    if(result=='cancel') return;
    
    if (result=='PDF')
    {
      this.processdownload=true;
      let m:any;        
      m=this.srv_statemanage.GetMaterialSelected();
      if (typeof ( m.material) !== 'undefined')
        this.mat_desc=m.Category + m.group.toString() + " - " + m.material ;     
      else
        this.mat_desc=m.Category + m.group.toString() + " - " + m.description.toString(); 
  
      this.IsExport=true; 

      setTimeout( () => {this.srv_down.DownLoadDataItem('PDF','');}, 5000 );    
      
    }
    
    if(result=="P21" || result=="FP") 
    { 

      //todo:temp     
      this.processdownload =true;
      let sCatalogNo:string ='';
      for (let c of this.viewParams.Res[0].CatalogNo)
      {
        c=c.replace(/\s/g, "");
        sCatalogNo = sCatalogNo +c + ',';
      } 

      if(sCatalogNo!='') sCatalogNo=sCatalogNo.substring(0,sCatalogNo.length-1);
      if(result=='P21')     
        return this.srv_DataLayer.downloadp21file(sCatalogNo,'M').subscribe( response=>       
        {      
          var downloadURL = window.URL.createObjectURL(response);
          var link = document.createElement('a');
          link.href = downloadURL;
          link.download = "P21.zip";
          link.click();
          this.processdownload =false;          
        }
      );
      if(result=='FP')     
      return this.srv_DataLayer.downloadfilepackage(sCatalogNo,'M').subscribe( response=>       
      {      
        var downloadURL = window.URL.createObjectURL(response);
        var link = document.createElement('a');
        link.href = downloadURL;
        link.download = "GTC.zip";
        link.click();
        this.processdownload =false;
      }
    );
    }
   });
 }
 
 OpenCNGenerator()
 {
   let strpar:string=this.srv_down.CreateURLparamCNCProgram(this.viewParams);
   window.open('http://intranet.imc.co.il/ITA/GCodeCreator.aspx?' +strpar);   
 }

 /* CreateURLparamCNCProgram() 
{
  let urlparam:string = '';
 
    urlparam = urlparam + "&units=" + this.srv_statemanage.IPL.GetItem('Units').value.toString() ; 
    urlparam = urlparam + "&threadform=" + this.srv_statemanage.IPL.GetItem('ThreadForm').value.toString();
    urlparam = urlparam + "&pitch=" +  this.srv_statemanage.IPL.GetItem('Pitch').value.toString();
    urlparam = urlparam + "&majordiameter=" + this.srv_statemanage.IPL.GetItem('MajorDiameter').value.toString();

    if (!this.srv_statemanage.IPL.GetItem('D_Hole').value.toString() ==null && this.srv_statemanage.IPL.GetItem('D_Hole').value.toString() != "" &&
    this.srv_statemanage.IPL.GetItem('D_Hole').value.toString() != "0")        
      urlparam = urlparam + "&size=" + this.srv_statemanage.IPL.GetItem('D_Hole').value.toString();
    else
      urlparam = urlparam + "&size=" + this.srv_statemanage.IPL.GetItem('Size').value.toString();

  urlparam = urlparam + "&length=" + this.srv_statemanage.IPL.GetItem('LengthOfShoulder_L').value.toString();

  //urlparam = urlparam + "&predrilldia=" + this.srv_statemanage.IPL.GetItem('DiameterInner').Value.ToString; todo:check
  //urlparam = urlparam + "&predrilldia=" + objParamList.Item(InpItemName.DiameterInner.ToString).Value.ToString

  urlparam = urlparam + "&material=" + this.srv_statemanage.IPL.GetItem('Material').value.toString();
  
  urlparam = urlparam + "&sid=" + this.srv_statemanage.IPL.GetItem('SecondaryApplication').value.toString();
  
  urlparam = urlparam + "&lang=" + this.srv_appsetting.Lang;

  if (this.srv_statemanage.IPL.GetItem('ThreadForm').value.toString() == 'M60' || this.srv_statemanage.IPL.GetItem('ThreadForm').value.toString() == 'MJ60' )
    this.srv_statemanage.IPL.GetItem('MachineType').value='M';           
 else
    this.srv_statemanage.IPL.GetItem('MachineType').value='I';

  urlparam = urlparam + "&pitchunits=" + this.srv_statemanage.IPL.GetItem('MachineType').value.toString(); 
  urlparam = urlparam + "&minordiameter=" + this.srv_statemanage.IPL.GetItem('WorkpieceDiameterRad').value.toString();
  
  urlparam=this.CreateURLparamCNCProgramForItem() +urlparam ;
   window.open('GCodeCreator.aspx?' +urlparam);            
}

CreateURLparamCNCProgramForItem() :string
{
  let strpar:string;
  let catsnumber:string;
  let cuttingspeed:string='0';
  let feedtable:string='0';
  let rpm:string='0';
  let feed:string='0';
  let feed1:string='0';
  let rorl:string='R';

  let cuttingspeedfieldname:string;
  let FeedTablefieldname:string;
  let Feedfieldname:string;
  let FeedGfieldname:string;
  if (this.srv_statemanage.IPL.GetItem('Units').value.toString() == "M")
  {
    cuttingspeedfieldname = "CuttingSpeed";
    FeedTablefieldname = "FeedTable";
    Feedfieldname = "Feed";
    FeedGfieldname = "FeedG";
  }
  else
  {
    cuttingspeedfieldname = "CuttingSpeed_INCH";
    FeedTablefieldname = "FeedTable_INCH";
    Feedfieldname = "Feed_INCH";
    FeedGfieldname = "FeedG_INCH";
  }                  

  catsnumber ="";
  for (let c of this.viewParams.Res[0].CatalogNo)
  {
    c=c.replace(/\s/g, "");
    catsnumber = catsnumber +c + '_';
  } 
  for (let d of this.viewParams.Res[1])
  {
    let f:any;
    f=d[0].property.Field;
    if(f==cuttingspeedfieldname) {if(d[0].value!== 'undefined')  cuttingspeed=d[0].value;}     
    if(f=='RPM') {if(d[0].value!== 'undefined') rpm=d[0].value;}  
    if(f==FeedTablefieldname)  {if(d[0].value!== 'undefined') feedtable=d[0].value }
    if(f==Feedfieldname)  {if(d[0].value!== 'undefined') feed=d[0].value;}
    if(f==FeedGfieldname)  {if(d[0].value!=='undefined') feed1=d[0].value;}
    if(f=='RorL')  {if(d[0].value!== 'undefined') rorl=d[0].value;}    
  }
  
  let itemtype:string;
  itemtype=this.viewParams.Res[0].itemTypeRes;
  strpar="&catnumbers=" + catsnumber + "&cuttingspeed=" + cuttingspeed + "&rpm=" + rpm + "&feedtable=" + feedtable + "&feed1=" + feed1 + "&feed=" + feed + "&rorl=" + rorl + "&itemtype=" + itemtype;
  return strpar;
} */
}
