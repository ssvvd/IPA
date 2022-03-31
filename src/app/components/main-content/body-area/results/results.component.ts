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
import { NavigationEnd, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ProductInfoComponent } from './product-info/product-info.component';
import { PpSuccessfullyComponent } from 'src/app/components/maintenance/pp-successfully/pp-successfully.component';
import { ResultsService} from 'src/app/services/results.service' ;
import { ResultsStoreService} from 'src/app/services/results-store.service' ;
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
indextool:number;

filtermobiletop:string='FilterRec';

// _showDownload:boolean;

@ViewChild('resTable', {static: false}) resTable: ResultsTableComponent;
@ViewChild('productInfo', {static: false}) productInfo: ProductInfoComponent;

EvOpenWebShop: Subject<void> = new Subject<void>();

eventsSubject: Subject<void> = new Subject<void>();

  constructor(private srv_ResultsStore :ResultsStoreService,private srv_Results:ResultsService,private modalService: NgbModal,private SpinnerService: NgxSpinnerService,
    private srv_down:DownloadresultService, public srv_statemanage:StateManagerService,private srv_DataLayer:DatalayerService,
    public srv_appsetting:AppsettingService,private router: Router,
    public translate:TranslateService) { 
      this.navigationSubscription = this.router.events.subscribe((e: any) => {
        // If it is a NavigationEnd event re-initalise the component
        if (e instanceof NavigationEnd) {
          this.initialiseInvites();
        }
      });
    }

    initialiseInvites() {
      this.MainPage = true;
     }

     ngOnDestroy() {
      // avoid memory leaks here by cleaning up after ourselves. If we  
      // don't then we will continue to run our initialiseInvites()   
      // method on every navigationEnd event.
      if (this.navigationSubscription) {  
         this.navigationSubscription.unsubscribe();
      }
    }
  ngAfterViewInit() {
    //console.log(this.resTable); 
  }

  onOpenWebShop()
  {
    this.EvOpenWebShop.next();
  }

  ngOnInit() {
    
    this.srv_statemanage._hideFiltermobile= true;
    //this.srv_statemanage.onflgDownLoadPDF.subscribe(f => { if(f==2) {console.log('f==2'); setTimeout( () => {this.SpinnerService.hide();}, 3000 ); return;}});
    this.srv_appsetting.LangChanged.subscribe(l=>this.translate.use(l));
    this.MainPage = true;     
    this._hideFilter = false; 
    // this._showDownload = true;
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
    this.indextool = value.index; 
  }

  switchPage(){
    this.MainPage = true;
  }

  mat_desc:string;
  processdownload:boolean=false;

  hideFilter(event){
    this._hideFilter = true;
  }

  // showDownload1($event:boolean){
  //   this._showDownload = $event;
  // }

  CheckDownloadResults()
  {
    let sCatalogNo:string ='';
    for (let c of this.viewParams.Res[0].CatalogNo)
    {
      c=c.replace(/\s/g, "");
      sCatalogNo = sCatalogNo +c + ',';
    } 
    if(sCatalogNo!='') sCatalogNo=sCatalogNo.substring(0,sCatalogNo.length-1);
      this.srv_DataLayer.checkexistsp21(sCatalogNo).subscribe( res=>
        {
          if(res=='')
            this.DownLoadResults(false);
          else
            this.DownLoadResults(true);
        });    
  }
  
  DownLoadResults1(result:string)
  {
    if(result=='cancel') return;

    if (result=='PDF')
    {
      this.IsExport=true;
      this.processdownload=true;
      this.srv_statemanage.flgPDFLoading=1;

      let m:any;        
      m=this.srv_statemanage.GetMaterialSelected();
      if (typeof ( m.material) !== 'undefined')
        this.mat_desc=m.Category + m.group.toString() + " - " + m.material ;     
      else
        this.mat_desc=m.Category + m.group.toString() + " - " + m.description.toString(); 
  
       
      
      this.SpinnerService.show();
      let filename:string;
      filename=this.srv_statemanage.MainAppSelected.MenuName.trim();
      filename=filename + ' ' +this.srv_statemanage.SecAppSelected.MenuName.trim();
      filename=filename + ' ' +this.viewParams.Res[0].Designation[this.viewParams.Res[0].Designation.length-1].trim();
      filename=filename + ' '+ this.viewParams.Res[0].Grade[this.viewParams.Res[0].Grade.length-1].trim();
      filename= filename + ' '+ this.viewParams.Res[0].CatalogNo[this.viewParams.Res[0].CatalogNo.length-1].trim();
      setTimeout( () => {this.srv_down.DownLoadDataItem('PDF','',this.srv_statemanage,filename);}, 6000 );               
      setTimeout(() => {this.SpinnerService.hide();}, 12000);
    }
    
    if(result=="P21" || result=="GTC" || result=="ZIP" ) 
    { 
      let   filename:string=result ;            
      filename=filename + ' ' +this.viewParams.Res[0].Designation[this.viewParams.Res[0].Designation.length-1].trim();
      filename=filename + ' '+ this.viewParams.Res[0].Grade[this.viewParams.Res[0].Grade.length-1].trim();
      filename= filename + ' '+ this.viewParams.Res[0].CatalogNo[this.viewParams.Res[0].CatalogNo.length-1].trim();

      this.processdownload =true;
      let sCatalogNo:string ='';
      for (let c of this.viewParams.Res[0].CatalogNo)
      {
        c=c.replace(/\s/g, "");
        sCatalogNo = sCatalogNo +c + ',';
      } 

      if(sCatalogNo!='') sCatalogNo=sCatalogNo.substring(0,sCatalogNo.length-1);
      if(result=='P21')  
      {  
        this.SpinnerService.show();     
        return this.srv_DataLayer.downloadp21file(sCatalogNo,this.srv_appsetting.Units).subscribe( response=>       
          {      
            var downloadURL = window.URL.createObjectURL(response);
            var link = document.createElement('a');
            link.href = downloadURL;
            link.download = filename + ".zip";
            link.click();
            this.processdownload =false;  
            this.SpinnerService.hide();        
          }
          );         
      }   
              
      if(result=='GTC')  
      {
        this.SpinnerService.show(); 
        return this.srv_DataLayer.downloadfilepackage(sCatalogNo,this.srv_appsetting.Units).subscribe( response=>       
          {      
            var downloadURL = window.URL.createObjectURL(response);
            var link = document.createElement('a');
            link.href = downloadURL;
            link.download =  filename + ".zip";
            link.click();
            this.processdownload =false;
            this.SpinnerService.hide();  
          }
        );
      }   
      if(result=='ZIP')  
      {  
        //this.SpinnerService.show();   
       
        let index= this.indextool+1;
        let indexstr:string;
        indexstr=index.toString();
        return this.srv_DataLayer.downloadfilezip(sCatalogNo,this.srv_appsetting.Units,this.srv_statemanage.SecAppSelected.ApplicationITAID, 
        this.srv_statemanage.SecAppSelected.MenuName.trim(),this.srv_statemanage.MainAppSelected.MenuName.trim(),
        indexstr,filename,
        this.srv_statemanage.IPLChanged,  this.srv_ResultsStore.res1 ).subscribe( response=>       
          {      
            //alert(response);
            var downloadURL = window.URL.createObjectURL(response);
            var link = document.createElement('a');
            link.href = downloadURL;
            link.download = filename + ".zip";
            link.click();
            this.processdownload =false;  
            this.SpinnerService.hide();        
          }
          );  
          //this.SpinnerService.hide();          
      }   
    }
  }

  DownLoadResults(isp21:boolean)
  {  
    this.srv_appsetting.curDate= new Date().toString();    
    this.srv_statemanage.onflgDownLoadPDF.subscribe(f => { f=0; if(f==2) {this.SpinnerService.hide(); return;}});
    
    if(this.srv_appsetting.isMobileResolution)
    {
      this.DownLoadResults1("PDF");
      return;
    }
    const modalRef = this.modalService.open(ResultPpDownloadComponent, { centered: true });    
    modalRef.componentInstance.isP21 = isp21;

    modalRef.result.then((result) => {
      this.DownLoadResults1(result);
   /*  if(result=='cancel') return;

    if (result=='PDF')
    {
      this.IsExport=true;
      this.processdownload=true;
      this.srv_statemanage.flgPDFLoading=1;

      let m:any;        
      m=this.srv_statemanage.GetMaterialSelected();
      if (typeof ( m.material) !== 'undefined')
        this.mat_desc=m.Category + m.group.toString() + " - " + m.material ;     
      else
        this.mat_desc=m.Category + m.group.toString() + " - " + m.description.toString(); 
  
       
      
      this.SpinnerService.show();
      let filename:string;
      filename=this.srv_statemanage.MainAppSelected.MenuName.trim();
      filename=filename + ' ' +this.srv_statemanage.SecAppSelected.MenuName.trim();
      filename=filename + ' ' +this.viewParams.Res[0].Designation[this.viewParams.Res[0].Designation.length-1].trim();
      filename=filename + ' '+ this.viewParams.Res[0].Grade[this.viewParams.Res[0].Grade.length-1].trim();
      filename= filename + ' '+ this.viewParams.Res[0].CatalogNo[this.viewParams.Res[0].CatalogNo.length-1].trim();
      setTimeout( () => {this.srv_down.DownLoadDataItem('PDF','',this.srv_statemanage,filename);}, 6000 );               
      setTimeout(() => {this.SpinnerService.hide();}, 12000);
    }
    
    if(result=="P21" || result=="GTC" || result=="ZIP" ) 
    { 
      let   filename:string=result ;            
      filename=filename + ' ' +this.viewParams.Res[0].Designation[this.viewParams.Res[0].Designation.length-1].trim();
      filename=filename + ' '+ this.viewParams.Res[0].Grade[this.viewParams.Res[0].Grade.length-1].trim();
      filename= filename + ' '+ this.viewParams.Res[0].CatalogNo[this.viewParams.Res[0].CatalogNo.length-1].trim();

      this.processdownload =true;
      let sCatalogNo:string ='';
      for (let c of this.viewParams.Res[0].CatalogNo)
      {
        c=c.replace(/\s/g, "");
        sCatalogNo = sCatalogNo +c + ',';
      } 

      if(sCatalogNo!='') sCatalogNo=sCatalogNo.substring(0,sCatalogNo.length-1);
      if(result=='P21')  
      {  
        this.SpinnerService.show();     
        return this.srv_DataLayer.downloadp21file(sCatalogNo,this.srv_appsetting.Units).subscribe( response=>       
          {      
            var downloadURL = window.URL.createObjectURL(response);
            var link = document.createElement('a');
            link.href = downloadURL;
            link.download = filename + ".zip";
            link.click();
            this.processdownload =false;  
            this.SpinnerService.hide();        
          }
          );         
      }   
              
      if(result=='GTC')  
      {
        this.SpinnerService.show(); 
        return this.srv_DataLayer.downloadfilepackage(sCatalogNo,this.srv_appsetting.Units).subscribe( response=>       
          {      
            var downloadURL = window.URL.createObjectURL(response);
            var link = document.createElement('a');
            link.href = downloadURL;
            link.download =  filename + ".zip";
            link.click();
            this.processdownload =false;
            this.SpinnerService.hide();  
          }
        );
      }   
      if(result=='ZIP')  
      {  
        //this.SpinnerService.show();   
       
        let index= this.indextool+1;
        let indexstr:string;
        indexstr=index.toString();
        return this.srv_DataLayer.downloadfilezip(sCatalogNo,this.srv_appsetting.Units,this.srv_statemanage.SecAppSelected.ApplicationITAID, 
        this.srv_statemanage.SecAppSelected.MenuName.trim(),this.srv_statemanage.MainAppSelected.MenuName.trim(),
        indexstr,filename,
        this.srv_statemanage.IPLChanged,  this.srv_ResultsStore.res1 ).subscribe( response=>       
          {      
            //alert(response);
            var downloadURL = window.URL.createObjectURL(response);
            var link = document.createElement('a');
            link.href = downloadURL;
            link.download = filename + ".zip";
            link.click();
            this.processdownload =false;  
            this.SpinnerService.hide();        
          }
          );  
          //this.SpinnerService.hide();          
      }   
    } */
   });
 }
 
 OpenCNGenerator()
 {
   let NotCNGenerator:boolean =false;
   let message:string;   
   let index_family:number=0;
   for (let f of this.viewParams.Res[0].Families)
   {  
    if(f==4089 || f==4090 || f==3524) NotCNGenerator=true;
   }

   if(NotCNGenerator)
   {    
      message="Currently, NC program is not available for this type of tool.";
   } 

   
 /*    if(this.srv_statemanage.IPL.GetItem('ThreadForm').value=='BSPT55' 
   || this.srv_statemanage.IPL.GetItem('ThreadForm').value=='NPTF60' 
   || this.srv_statemanage.IPL.GetItem('ThreadForm').value=='NPT60' )
   {
    NotCNGenerator =true;
    message="Generation of NC code for Conical threads is not yet available, please contact your technical support team.";
   }  */

   if(NotCNGenerator)
   {
    const modalRef = this.modalService.open(PpSuccessfullyComponent, { backdrop:'static',centered: true });
    modalRef.componentInstance.HeaderDescription = "NC Generator";
    modalRef.componentInstance.Text = message;

    //  alert('Generation of NC code for Conical threads is not yet available, please contact your technical support team.');
      return;
   }
   let strpar:string=this.srv_down.CreateURLparamCNCProgram(this.viewParams);
   window.open(this.environment.IscarSite + '/ITC/GCodeCreator.aspx?' +strpar,"_blank");   
 }

 GoToAssembly(){

   this.srv_Results.getAssemblyURL(this.viewParams.Res[0].CatalogNo.toString().replace(/\s/g, ""),this.srv_appsetting.Lang).subscribe(res => {    
    let url = (new DOMParser()).parseFromString(res, "text/xml").getElementsByTagName('string')[0].textContent;    
    window.open(url, "_blank");
    
  }) 

}

OpenFilter()
  {
  this.srv_statemanage._hideFiltermobile =!this.srv_statemanage._hideFiltermobile;
  }
 
  changefiltermobile(event)
  {
    this.filtermobiletop =event;
  }
}
