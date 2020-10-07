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

 CreateURLparamCNCProgram() :string
{
  let urlparam:string = '';
 
    urlparam = urlparam + "&units=" + this.srv_statemanage.IPL.GetItem('Units').value ; //objParamList.Item(InpItemName.Units.ToString).Value.ToString
    urlparam = urlparam + "&threadform=" + this.srv_statemanage.IPL.GetItem('ThreadForm').value.ToString;
    urlparam = urlparam + "&pitch=" +  this.srv_statemanage.IPL.GetItem('Pitch').value;
    urlparam = urlparam + "&majordiameter=" + this.srv_statemanage.IPL.GetItem('MajorDiameter').value.ToString;

    if (!this.srv_statemanage.IPL.GetItem('D_Hole').value.ToString ==null && this.srv_statemanage.IPL.GetItem('D_Hole').Value.ToString != "" &&
    this.srv_statemanage.IPL.GetItem('D_Hole.ToString').value.ToString != "0")        
      urlparam = urlparam + "&size=" + this.srv_statemanage.IPL.GetItem('D_Hole').value.ToString;
    else
      urlparam = urlparam + "&size=" + this.srv_statemanage.IPL.GetItem('Size.ToString').value.ToString;

/*   if Not objParamList.Item(InpItemName.D_Hole.ToString).Value Is Nothing AndAlso objParamList.Item(InpItemName.D_Hole.ToString).Value.ToString <> "" And objParamList.Item(InpItemName.D_Hole.ToString).Value.ToString <> "0" Then
      urlparam = urlparam + "&size=" + objParamList.Item(InpItemName.D_Hole.ToString).Value.ToString
  Else
      urlparam = urlparam + "&size=" + objParamList.Item(InpItemName.Size.ToString).Value.ToString
  End If */

  urlparam = urlparam + "&length=" + this.srv_statemanage.IPL.GetItem('LengthOfShoulder_L').value.ToString;

  //urlparam = urlparam + "&predrilldia=" + this.srv_statemanage.IPL.GetItem('DiameterInner').Value.ToString; todo:check
  //urlparam = urlparam + "&predrilldia=" + objParamList.Item(InpItemName.DiameterInner.ToString).Value.ToString

  urlparam = urlparam + "&material=" + this.srv_statemanage.IPL.GetItem('Material').value.ToString;
  //urlparam = urlparam + "&material=" + objParamList.Item(InpItemName.Material.ToString).Value.ToString
  
  urlparam = urlparam + "&sid=" + this.srv_statemanage.IPL.GetItem('SecondaryApplication').value.ToString;
  //urlparam = urlparam + "&sid=" + objParamList.Item(InpItemName.SecondaryApplication.ToString).Value.ToString

  urlparam = urlparam + "&lang=" + this.srv_appsetting.Lang;

  if (this.srv_statemanage.IPL.GetItem('ThreadForm').value.ToString == 'M60' || this.srv_statemanage.IPL.GetItem('ThreadForm').value.ToString == 'MJ60' )
    this.srv_statemanage.IPL.GetItem('MachineType').value='M';           
 else
    this.srv_statemanage.IPL.GetItem('MachineType').value='I';

  urlparam = urlparam + "&pitchunits=" + this.srv_statemanage.IPL.GetItem('MachineType').value.ToString;
  //urlparam = urlparam + "&pitchunits=" + objParamList.Item(InpItemName.MachineType.ToString).Value.ToString

  urlparam = urlparam + "&minordiameter=" + this.srv_statemanage.IPL.GetItem('WorkpieceDiameterRad').value.ToString;
  
   //window.open('GCodeCreator.aspx?opt=' + opt + "&catnumbers=" + catnumbers[opt] + "&cuttingspeed=" + cuttingspeed[opt] + "&rpm=" + rpm[opt] + "&feedtable=" + feedtable[opt] + "&feed1=" + feed1[opt] + "&feed=" + feed[opt] + "&rorl=" + rorl[opt] + "&itemtype=" + itemtype[opt] + parURL);            
  //urlparam = urlparam + "&minordiameter=" + objParamList.Item(InpItemName.WorkpieceDiameterRad.ToString).Value.ToString

  

  return urlparam
}

CreateURLparamCNCProgramForItem() :string
{
  return "";

}
}
