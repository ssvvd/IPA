import { Component, OnInit,Input ,Output,EventEmitter} from '@angular/core';
import { DatalayerService} from 'src/app/services/datalayer.service' ;
//import { DatalayerOptimizeToolService} from 'src/app/services/datalayer-tooloptimize.service' ;
import { StateManagerService } from 'src/app/services/statemanager.service';
import { AppsettingService} from 'src/app/services/appsetting.service';
import { Observable ,Subscription} from 'rxjs';
import { NgxSpinnerService } from "ngx-spinner"; 

interface ToolOptimizeItem
{
  RecordID:number;
  Designation:string;
  Value:string;
  Checked:boolean;
}

@Component({
  selector: 'app-optimizetool-filter',
  templateUrl: './optimizetool-filter.component.html',
  styleUrls: ['./optimizetool-filter.component.scss']
})

export class OptimizetoolFilterComponent implements OnInit {

  @Input() labeldescription:string;
  @Input() funcname:string;
  
  @Input() fieldname:string;
  @Input() fieldid:string;

  @Input() events: Observable<void>;
  private eventsSubscription: Subscription=new Subscription();

  //@Output() selectitems = new EventEmitter();
  //@Output() selectitems = new EventEmitter<{items: ToolOptimizeItem[],funcname:string}>();

  selitems:ToolOptimizeItem[];

  arrData:ToolOptimizeItem[]=[];
  arrDataF:ToolOptimizeItem[]=[];
  isshowdetail:boolean=false;  
  select_items:string='';
  show_more:boolean =false;
  show_all:boolean =false;
  after_getmore =false;
  desc_show_more:string;
  str_search:string ='';
  max_row_show:number;
  after_get_data:boolean;
  Top:number =10;
  Filter:string='All';  

  constructor(private srv_StMng:StateManagerService,private srv_appsetting:AppsettingService,
              private SpinnerService: NgxSpinnerService,private srv_DataLayer:DatalayerService) { }
  
  ngOnInit() { 
    this.eventsSubscription.add(this.events.subscribe(() => this.ClearData()));

    this.desc_show_more ="Show more...";
    this.arrData=[];
    this.after_get_data=false;
    this.selitems= [];
    if(this.srv_StMng.IPL.GetItem(this.fieldid).value!=this.srv_StMng.IPL.GetItem(this.fieldid).valuedefault)  
      {
        this.BuildSelectItems();
      } 
  }

  ngOnDestroy() {
    this.eventsSubscription.unsubscribe();
  }

  ClearData()
  {
    this.isshowdetail=false;  
    this.select_items='';
    this.show_more=false;
    this.show_all =false;
    this.after_getmore =false;
    this.desc_show_more ="Show more...";
    this.arrData=[];
    this.arrDataF=[];
    this.after_get_data=false;
    this.selitems= [];
    this.srv_StMng.IPL.GetItem(this.fieldid).value =this.srv_StMng.IPL.GetItem(this.fieldid).valuedefault; 
  }

  BuildSelectItems()
  {
    let arr = this.srv_StMng.IPL.GetItem(this.fieldid).value.split(",");   
    for (let value of arr) {
        this.selitems.push({ RecordID:0,
                             Designation:value,
                             Value:  value,
                             Checked:true
                            });      
    }
    this.selitems.forEach(pp=>{this.select_items = this.select_items +pp.Designation + ",";} );
    this.select_items =this.select_items.substring (0,this.select_items.length-1);  
  }
    
    ApplySearch(s:string) {    
    this.str_search = s;
    if(this.after_getmore)
    {
        this.arrDataF = this.arrData.filter(
        m => m.Designation.toUpperCase().indexOf(s.toUpperCase()) > -1  || m.Checked
      );
    }
    else
    {
      this.callfunchttp(this.funcname);
      if(this.str_search!='') this.after_getmore=false;
    }  
   
  }
 
  callfunchttp(funcname:string)
  {   
    this.SpinnerService.show();
    let str_param:string;
    let str_s:string= this.str_search;
    str_s =str_s.trim();
    let t:number= this.Top;
    if (str_s.replace(/\s/g, "") !='') t =9999 ; 
    str_s=str_s.replace (' ' ,'blank');
    if (str_s.replace(/\s/g, "") =='') str_s ='All';

    //str_param=this.funcpar + str_s + "/" + t;
    let param:string;
    switch(funcname)
    { 
      case "BRAND": {
          //"M/1/1/760/"
          param=this.srv_appsetting.Units + "/1/1/" + this.srv_StMng.SecApp + "/"; 
          str_param=param + str_s + "/" + t;
          this.eventsSubscription.add(this.srv_DataLayer.get_tdlist('td-get-brandname-list',str_param).subscribe((res: any)=>{this.filldatasubscribe(res);}) );
          break; 
      } 
      case"TOOL":  { 
          //"All/0/999/All/1/1/760/M/All/"          
          param=this.srv_StMng.IPL.GetItem("TD_BrandName").value + "/0/999/All/1/1/" + this.srv_StMng.SecApp +"/" + this.srv_appsetting.Units + "/All/";
          str_param=param + str_s + "/" + t;
          this.eventsSubscription.add(this.srv_DataLayer.get_tdlist('td-get-tool-designation-list',str_param).subscribe((res: any)=>{this.filldatasubscribe(res)}) );
          break; 
      }
      case "INSERT":  {         
          //(mBrand, mTool, mDiaFrom, mDiaTo, mInnerDiaFrom, mInnerDiaTo, mTA,mSolid, mSecondaryApp, mUnits            
          param=this.srv_StMng.IPL.GetItem("TD_BrandName").value +"/" + this.srv_StMng.IPL.GetItem("TD_ToolDesignation").value+  "/0/999/1/1/" + this.srv_StMng.SecApp +"/" + this.srv_appsetting.Units + "/";
          str_param=param + str_s + "/" + t;
          this.eventsSubscription.add(this.srv_DataLayer.get_tdlist('td-get-insert-designation-list',str_param).subscribe((res: any)=>{this.filldatasubscribe(res)}) );
          break; 
      } 
      case"TOOLCATALOGNO":  { 
          //"All/0/999/All/1/1/760/M/All/"
          //{BrandName}/{DiaFrom}/{DiaTo}/{Insert}/{bTA}/{bSolid}/{pSecondaryApp}/{pUnits}/{Family}/{ToolDesignation}/}{Filter}/{Top}
          param=this.srv_StMng.IPL.GetItem("TD_BrandName").value + "/0/999/All/1/1/" + this.srv_StMng.SecApp +"/" + this.srv_appsetting.Units + "/All/"  + this.srv_StMng.IPL.GetItem("TD_ToolDesignation").value+ "/";
          str_param=param + str_s + "/" + t;
          this.eventsSubscription.add(this.srv_DataLayer.get_tdlist('td-get-tool-catalogno-list',str_param).subscribe((res: any)=>{this.filldatasubscribe(res)}) );
          break; 
      }
      case"INSERTCATALOGNO":  { 
          //"All/0/999/All/1/1/760/M/All/"
          // /{BrandName}/{Designation}/{Units}/{bTA}/{bSolid}/{CarbideGrade}/{SecondaryApp}/{Tool}/{ToolCatalogNo}/{DiaFrom}/{DiaTo}/{Filter}/{Top}
          param=this.srv_StMng.IPL.GetItem("TD_BrandName").value + "/" +this.srv_StMng.IPL.GetItem("TD_InsertDesignation").value + "/" 
          + this.srv_appsetting.Units + "/1/1/All/" + this.srv_StMng.SecApp +"/" + this.srv_StMng.IPL.GetItem("TD_ToolDesignation").value+"/" + this.srv_StMng.IPL.GetItem("TD_ToolCatalogNo").value+ "/0/999/";
          str_param=param + str_s + "/" + t;
          this.eventsSubscription.add(this.srv_DataLayer.get_tdlist('td-get-insert-catalogno-list',str_param).subscribe((res: any)=>{this.filldatasubscribe(res)})) ;
          break; 
      }
      case"GRADE":  {          
          //{BrandName}/{Designation}/{bTA}/{bSolid}/{InsertCatalog}/{pUnits}/{pSecondaryApp}/{Tool}/{DiaFrom}/{DiaTo}/{Filter}/{Top}
          //All/         All/           1/    1/       /     M/760/All/0/999/All/5
          param=this.srv_StMng.IPL.GetItem("TD_BrandName").value + "/" +this.srv_StMng.IPL.GetItem("TD_InsertDesignation").value + "/1/1/" +
          this.srv_StMng.IPL.GetItem("TD_InsertCatalogNo").value +"/"+ this.srv_appsetting.Units + "/" + this.srv_StMng.SecApp +"/" + 
          this.srv_StMng.IPL.GetItem("TD_ToolDesignation").value+ "/0/999/";
          str_param=param + str_s + "/" + t;
          this.eventsSubscription.add(this.srv_DataLayer.get_tdlist('td-get-grade-list',str_param).subscribe((res: any)=>{this.filldatasubscribe(res)})) ;
          break; 
      }
      
       case"BRANDNAMETHREAD":  {  
         let cool_yes:string;
         let cool_no:string;  
         let threadform:string;
         let pitch:string;
         this.srv_StMng.IPL.GetItem("TD_CoolantYes").value=='True'? cool_yes = '1':cool_yes = '0'; 
         this.srv_StMng.IPL.GetItem("TD_CoolantNo").value=='True'? cool_no = '1':cool_no = '0';  
         this.srv_StMng.IPL.GetItem("ThreadForm").value==null || this.srv_StMng.IPL.GetItem("ThreadForm").value==''? threadform = 'All':threadform = this.srv_StMng.IPL.GetItem("ThreadForm").value; 
         this.srv_StMng.IPL.GetItem("Pitch").value==null || this.srv_StMng.IPL.GetItem("Pitch").value==''? pitch = 'All':pitch = this.srv_StMng.IPL.GetItem("Pitch").value; 
          //td-get-brandname-thread/{pUnits}/{bTA}/{bSolid}/{pSecondaryApp}/{pPitch}/{pSecondaryApp}/{pThreeadForm}/{pCoolantNo}/{pCoolantYes}/{Filter}/{Top}        
          param=this.srv_StMng.IPL.GetItem("Units").value +  "/1/1/" + this.srv_StMng.SecApp +"/" + pitch + "/" 
          + threadform +"/" + cool_no +"/" + cool_yes +"/";
          str_param=param + str_s + "/" + t;
          this.eventsSubscription.add(this.srv_DataLayer.get_tdlist('td-get-brandname-thread',str_param).subscribe((res: any)=>{this.filldatasubscribe(res)})) ;
          break; 
      } 

      case"TOOLTHREAD":  {  
         let cool_yes:string;
         let cool_no:string;  
         let brandname:string;
         let threadform:string;
         let pitch:string;
         let size:string;
         let family:string;
         let dia:string;
         let majordiameter:string;
         let l:string;
         this.srv_StMng.IPL.GetItem("TD_CoolantYes").value=='True'? cool_yes = '1':cool_yes = '0'; 
         this.srv_StMng.IPL.GetItem("TD_CoolantNo").value=='True'? cool_no = '1':cool_no = '0';
         this.srv_StMng.IPL.GetItem("MajorDiameter").value==null || this.srv_StMng.IPL.GetItem("MajorDiameter").value==''? majordiameter = '0':majordiameter = this.srv_StMng.IPL.GetItem("MajorDiameter").value;           
         this.srv_StMng.IPL.GetItem("LengthOfShoulder_L").value==null || this.srv_StMng.IPL.GetItem("LengthOfShoulder_L").value==''? l = '0':l = this.srv_StMng.IPL.GetItem("LengthOfShoulder_L").value;           
         this.srv_StMng.IPL.GetItem("D_Hole").value==null || this.srv_StMng.IPL.GetItem("D_Hole").value==''? dia = '0':dia = this.srv_StMng.IPL.GetItem("D_Hole").value;           
         
         brandname =this.getvalueparambyname("TD_BrandName");
         family =this.getvalueparambyname("TD_Family");
         threadform =this.getvalueparambyname("ThreadForm");
         pitch =this.getvalueparambyname("Pitch");         
         size=this.getvalueparambyname("Size");
         
          //{SecondaryApp}/{Units}/{BrandName}/{DiaFrom}/{DiaTo}/{bTA}/{bSolid}/{Family}/{Pitch}/{Size}/{Diameter}/{Length}/{MajorDiameter}/{ThreadForm}/{mCoolantNo}/{mCoolantYes}/{Filter}/{Top}        
          param=this.srv_StMng.SecApp + "/" + this.srv_StMng.IPL.GetItem("Units").value + "/" + brandname +  "/" + this.srv_StMng.IPL.GetItem("TD_DiameterFrom").value + "/" +this.srv_StMng.IPL.GetItem("TD_DiameterTo").value +
                "/1/1/" +family + "/" + pitch + "/" +size + "/" + dia + "/" + l + "/" + majordiameter + "/" +threadform + "/" +cool_no +"/" + cool_yes + "/";       
          str_param=param + str_s + "/" + t;
          this.eventsSubscription.add(this.srv_DataLayer.get_tdlist('get-tool-thread-list',str_param).subscribe((res: any)=>{this.filldatasubscribe(res)})) ;
          break; 
      }       
       case"INSERTTHREAD":  {  
         let cool_yes:string;
         let cool_no:string;  
         let brandname:string =this.getvalueparambyname("TD_BrandName");
         let threadform:string=this.getvalueparambyname("ThreadForm");
         let pitch:string =this.getvalueparambyname("Pitch");
         let size:string='All';
         let family:string=this.getvalueparambyname("TD_Family");
         let tool:string =this.getvalueparambyname("TD_ToolDesignation");
         let dia:string;
         let majordiameter:string;
         let l:string;
         this.srv_StMng.IPL.GetItem("TD_CoolantYes").value=='True'? cool_yes = '1':cool_yes = '0'; 
         this.srv_StMng.IPL.GetItem("TD_CoolantNo").value=='True'? cool_no = '1':cool_no = '0';
         this.srv_StMng.IPL.GetItem("MajorDiameter").value==null || this.srv_StMng.IPL.GetItem("MajorDiameter").value==''? majordiameter = '0':majordiameter = this.srv_StMng.IPL.GetItem("MajorDiameter").value;           
         this.srv_StMng.IPL.GetItem("LengthOfShoulder_L").value==null || this.srv_StMng.IPL.GetItem("LengthOfShoulder_L").value==''? l = '0':l = this.srv_StMng.IPL.GetItem("LengthOfShoulder_L").value;           
         this.srv_StMng.IPL.GetItem("D_Hole").value==null || this.srv_StMng.IPL.GetItem("D_Hole").value==''? dia = '0':dia = this.srv_StMng.IPL.GetItem("D_Hole").value;                             
          //{SecondaryApp}/{Units}/{BrandName}/{DiaFrom}/{DiaTo}/{bTA}/{bSolid}/{Family}/{Pitch}/{Size}/{Diameter}/{Length}/{MajorDiameter}/{ThreadForm}/{Tool}/{mCoolantNo}/{mCoolantYes}/{Filter}/{Top}"        
          param=this.srv_StMng.SecApp + "/" + this.srv_StMng.IPL.GetItem("Units").value + "/" + brandname +  "/" + this.srv_StMng.IPL.GetItem("TD_DiameterFrom").value + "/" +this.srv_StMng.IPL.GetItem("TD_DiameterTo").value +
                "/1/1/" +family + "/" + pitch + "/" +size + "/" + dia + "/" + l + "/" + majordiameter + "/" +threadform + "/" + tool + "/" +cool_no +"/" + cool_yes + "/";       
          str_param=param + str_s + "/" + t;
          this.eventsSubscription.add(this.srv_DataLayer.get_tdlist('get-insert-thread-list',str_param).subscribe((res: any)=>{this.filldatasubscribe(res)})) ;
          break; 
      }      
      case"TOOLCATALOGNOTHREAD":  {  
         let cool_yes:string;
         let cool_no:string;  
         let brandname:string =this.getvalueparambyname("TD_BrandName");
         let threadform:string=this.getvalueparambyname("ThreadForm");
         let pitch:string =this.getvalueparambyname("Pitch");
         let size:string=this.getvalueparambyname("Size");
         let family:string=this.getvalueparambyname("TD_Family");
         let tool:string =this.getvalueparambyname("TD_ToolDesignation");
         let dia:string;
         let majordiameter:string;
         let l:string;         
         this.srv_StMng.IPL.GetItem("TD_CoolantYes").value=='True'? cool_yes = '1':cool_yes = '0'; 
         this.srv_StMng.IPL.GetItem("TD_CoolantNo").value=='True'? cool_no = '1':cool_no = '0';
         this.srv_StMng.IPL.GetItem("MajorDiameter").value==null || this.srv_StMng.IPL.GetItem("MajorDiameter").value==''? majordiameter = '0':majordiameter = this.srv_StMng.IPL.GetItem("MajorDiameter").value;           
         this.srv_StMng.IPL.GetItem("LengthOfShoulder_L").value==null || this.srv_StMng.IPL.GetItem("LengthOfShoulder_L").value==''? l = '0':l = this.srv_StMng.IPL.GetItem("LengthOfShoulder_L").value;           
         this.srv_StMng.IPL.GetItem("D_Hole").value==null || this.srv_StMng.IPL.GetItem("D_Hole").value==''? dia = '0':dia = this.srv_StMng.IPL.GetItem("D_Hole").value;           
                
          //{SecondaryApp}/{Units}/{BrandName}/{DiaFrom}/{DiaTo}/{bTA}/{bSolid}/{Family}/{Pitch}/{Size}/{Diameter}/{Length}/{MajorDiameter}/{ThreadForm}/{Tool}/{mCoolantNo}/{mCoolantYes}/{Filter}/{Top}        
          param=this.srv_StMng.SecApp + "/" + this.srv_StMng.IPL.GetItem("Units").value + "/" + brandname +  "/" + this.srv_StMng.IPL.GetItem("TD_DiameterFrom").value + "/" +this.srv_StMng.IPL.GetItem("TD_DiameterTo").value +
                "/1/1/" +family + "/" + pitch + "/" +size + "/" + dia + "/" + l + "/" + majordiameter + "/" +threadform + "/" + tool + "/" +cool_no +"/" + cool_yes + "/";       
          str_param=param + str_s + "/" + t;
          this.eventsSubscription.add(this.srv_DataLayer.get_tdlist('get-tool-catalog-thread-list',str_param).subscribe((res: any)=>{this.filldatasubscribe(res)})) ;
          break; 
      }    
      case"INSERTCATALOGNOTHREAD":  {  
         let cool_yes:string;
         let cool_no:string;  
         let brandname:string =this.getvalueparambyname("TD_BrandName");
         let threadform:string=this.getvalueparambyname("ThreadForm");
         let pitch:string =this.getvalueparambyname("Pitch");
         let size:string='All'; //this.getvalueparambyname("Size");
         let family:string=this.getvalueparambyname("TD_Family");
         let tool:string =this.getvalueparambyname("TD_ToolDesignation");
         let insert:string =this.getvalueparambyname("TD_InsertDesignation");
         let grade:string =this.getvalueparambyname("TD_Grade");
         let dia:string;
         let majordiameter:string;
         let l:string;         
         this.srv_StMng.IPL.GetItem("TD_CoolantYes").value=='True'? cool_yes = '1':cool_yes = '0'; 
         this.srv_StMng.IPL.GetItem("TD_CoolantNo").value=='True'? cool_no = '1':cool_no = '0';
         this.srv_StMng.IPL.GetItem("MajorDiameter").value==null || this.srv_StMng.IPL.GetItem("MajorDiameter").value==''? majordiameter = '0':majordiameter = this.srv_StMng.IPL.GetItem("MajorDiameter").value;           
         this.srv_StMng.IPL.GetItem("LengthOfShoulder_L").value==null || this.srv_StMng.IPL.GetItem("LengthOfShoulder_L").value==''? l = '0':l = this.srv_StMng.IPL.GetItem("LengthOfShoulder_L").value;           
         this.srv_StMng.IPL.GetItem("D_Hole").value==null || this.srv_StMng.IPL.GetItem("D_Hole").value==''? dia = '0':dia = this.srv_StMng.IPL.GetItem("D_Hole").value;           
                
          //get-insert-catalog-thread-list/120/M/All/0/250/1/1/All/All/All/0/0/0/All/All/All/1/1/All/10     
          param=this.srv_StMng.SecApp + "/" + this.srv_StMng.IPL.GetItem("Units").value + "/" + brandname +  "/" + this.srv_StMng.IPL.GetItem("TD_DiameterFrom").value + "/" +this.srv_StMng.IPL.GetItem("TD_DiameterTo").value +
                "/1/1/" +family + "/" + pitch + "/" +size + "/" + dia + "/" + l + "/" + majordiameter + "/" +threadform + "/" + tool + "/" +insert +"/" +grade+ "/" +cool_no +"/" + cool_yes + "/";       
          str_param=param + str_s + "/" + t;
          this.eventsSubscription.add(this.srv_DataLayer.get_tdlist('get-insert-catalog-thread-list',str_param).subscribe((res: any)=>{this.filldatasubscribe(res)})) ;
          break; 
      }      
         case"GRADETHREAD":  
      {  
         let cool_yes:string;
         let cool_no:string;  
         let brandname:string =this.getvalueparambyname("TD_BrandName");
         let threadform:string=this.getvalueparambyname("ThreadForm");
         let pitch:string =this.getvalueparambyname("Pitch");
         let size:string='All' //this.getvalueparambyname("Size");
         let family:string=this.getvalueparambyname("TD_Family");
         let tool:string =this.getvalueparambyname("TD_ToolDesignation");
         let insert:string =this.getvalueparambyname("TD_InsertDesignation");         
         let dia:string;
         let majordiameter:string;
         let l:string;         
         this.srv_StMng.IPL.GetItem("TD_CoolantYes").value=='True'? cool_yes = '1':cool_yes = '0'; 
         this.srv_StMng.IPL.GetItem("TD_CoolantNo").value=='True'? cool_no = '1':cool_no = '0';
         this.srv_StMng.IPL.GetItem("MajorDiameter").value==null || this.srv_StMng.IPL.GetItem("MajorDiameter").value==''? majordiameter = '0':majordiameter = this.srv_StMng.IPL.GetItem("MajorDiameter").value;           
         this.srv_StMng.IPL.GetItem("LengthOfShoulder_L").value==null || this.srv_StMng.IPL.GetItem("LengthOfShoulder_L").value==''? l = '0':l = this.srv_StMng.IPL.GetItem("LengthOfShoulder_L").value;           
         this.srv_StMng.IPL.GetItem("D_Hole").value==null || this.srv_StMng.IPL.GetItem("D_Hole").value==''? dia = '0':dia = this.srv_StMng.IPL.GetItem("D_Hole").value;           
                
          //get-grade-thread-list/{SecondaryApp}/{Units}/{BrandName}/{DiaFrom}/{DiaTo}/{bTA}/{bSolid}/{Family}/
          //{Pitch}/{Size}/{Diameter}/{Length}/{MajorDiameter}/{ThreadForm}/{Tool}/{Insert}/{mCoolantNo}/{mCoolantYes}/{Filter}/{Top}     
          param=this.srv_StMng.SecApp + "/" + this.srv_StMng.IPL.GetItem("Units").value + "/" + brandname +  "/" + this.srv_StMng.IPL.GetItem("TD_DiameterFrom").value + "/" +this.srv_StMng.IPL.GetItem("TD_DiameterTo").value +
                "/1/1/" +family + "/" + pitch + "/" +size + "/" + dia + "/" + l + "/" + majordiameter + "/" + threadform + "/" + tool + "/" +insert +"/"  +cool_no +"/" + cool_yes + "/";       
          str_param=param + str_s + "/" + t;
          this.eventsSubscription.add(this.srv_DataLayer.get_tdlist('get-grade-thread-list',str_param).subscribe((res: any)=>{this.filldatasubscribe(res)})) ;
          break; 
      } 
      case "BRANDISO": {
          // get-ISO-brandnames-list/{mIsoMat}/{pUnits}/{pSecondaryApp}
          param=this.srv_StMng.IPL.GetItem('TD_ISOMat').value + "/" +this.srv_StMng.IPL.GetItem("Units").value +"/" + this.srv_StMng.SecApp+"/";
          str_param=param + str_s + "/" + t;
          this.eventsSubscription.add(this.srv_DataLayer.get_tdlist('get-ISO-brandnames-list',str_param).subscribe((res: any)=>{this.filldatasubscribe(res);}) );
          break; 
      }      
       case "SHAPEISO": {
          // get-ISO-shapes-list/{pIsoMat}/{pUnits}/{pSecondaryApp}/{pGrooveBrandName}/{Filter}/{Top}"
          let brandname:string =this.getvalueparambyname("TD_BrandName");
          param=this.srv_StMng.IPL.GetItem('TD_ISOMat').value + "/" +this.srv_StMng.IPL.GetItem("Units").value +"/" + this.srv_StMng.SecApp+"/" +brandname + "/";
          str_param=param + str_s + "/" + t;
          this.eventsSubscription.add(this.srv_DataLayer.get_tdlist('get-ISO-shapes-list',str_param).subscribe((res: any)=>{this.filldatasubscribe(res);}) );
          break; 
      }  
      case "INSERTISO": {
          // get-ISO-inserts-list/{pIsoMat}/{pUnits}/{pSecondaryApp}/{pGrooveBrandName}/{pInsertShape}/{pAngle}/{pPrecisionOrUtility}/{pWMin}/{pWMax}/{pRadiusMin}/{pRadiusMax}")
          let brandname:string =this.getvalueparambyname("TD_BrandName");
          let shape:string =this.getvalueparambyname("TD_InsertShape");
          param=this.srv_StMng.IPL.GetItem('TD_ISOMat').value+"/"+this.srv_StMng.IPL.GetItem("Units").value +"/" + this.srv_StMng.SecApp+"/" +
                brandname + "/" +shape + "/" +this.srv_StMng.IPL.GetItem('TD_NegOrPosAngle').value +"/" + this.srv_StMng.IPL.GetItem('TD_PrecisionOrUtility').value+
                "/0/999/0/999/";
          str_param=param + str_s + "/" + t;
          this.eventsSubscription.add(this.srv_DataLayer.get_tdlist('get-ISO-inserts-list',str_param).subscribe((res: any)=>{this.filldatasubscribe(res);}) );
          break; 
      } 
      case "GRADEISO": {
          //get-ISO-grade-list/{pIsoMat}/{pUnits}/{pSecondaryApp}/{pGrooveBrandName}/{pInsertShape}/{pAngle}/{pPrecisionOrUtility}/{pWMin}/{pWMax}/{pRadiusMin}/{pRadiusMax}/{pGrooveInsertDesignation}/{Filter}/{Top}")>  
          let brandname:string =this.getvalueparambyname("TD_BrandName");
          let shape:string =this.getvalueparambyname("TD_InsertShape");
          let inserts:string =this.getvalueparambyname("TD_InsertDesignation");
          param=this.srv_StMng.IPL.GetItem('TD_ISOMat').value+"/"+this.srv_StMng.IPL.GetItem("Units").value +"/" + this.srv_StMng.SecApp+"/" +
                brandname + "/" +shape + "/" +this.srv_StMng.IPL.GetItem('TD_NegOrPosAngle').value +"/" + this.srv_StMng.IPL.GetItem('TD_PrecisionOrUtility').value+
                "/0/999/0/999/" +inserts + "/";
          str_param=param + str_s + "/" + t;
          this.eventsSubscription.add(this.srv_DataLayer.get_tdlist('get-ISO-grade-list',str_param).subscribe((res: any)=>{this.filldatasubscribe(res);}) );
          break; 
      }   
      case "HOLDERISO": {
         //get-ISO-holder-list/{pIsoMat}/{pUnits}/{pSecondaryApp}/{pGrooveBrandName}/{pInsertShape}/{pAngle}/{pPrecisionOrUtility}/{pWMin}/{pWMax}/{pRadiusMin}/{pRadiusMax}/{pGrooveInsertDesignation}/{pCarbideGrade}/{pGrooveCuttingEdge}/{pKaAngleMin}/{pKaAngleMax}/{pKrAngleMin}/{pKrAngleMax}/{Filter}/{Top}")
          let brandname:string =this.getvalueparambyname("TD_BrandName");
          let shape:string =this.getvalueparambyname("TD_InsertShape");
          let inserts:string =this.getvalueparambyname("TD_InsertDesignation");
          let grade:string =this.getvalueparambyname("TD_Grade");
          param=this.srv_StMng.IPL.GetItem('TD_ISOMat').value+"/"+this.srv_StMng.IPL.GetItem("Units").value +"/" + this.srv_StMng.SecApp+"/" +
                brandname + "/" +shape + "/" +this.srv_StMng.IPL.GetItem('TD_NegOrPosAngle').value +"/" + this.srv_StMng.IPL.GetItem('TD_PrecisionOrUtility').value+
                "/0/999/0/999/" +inserts + "/" +grade +"/All/0/999/0/9999/"  ;
          str_param=param + str_s + "/" + t;
          this.eventsSubscription.add(this.srv_DataLayer.get_tdlist('get-ISO-holder-list',str_param).subscribe((res: any)=>{this.filldatasubscribe(res);}) );
          break; 
      }  
        case "TOOLISO": {
         //get-ISO-tool-list/{pIsoMat}/{pUnits}/{pSecondaryApp}/{pGrooveBrandName}/{pInsertShape}/{pAngle}/{pPrecisionOrUtility}/{pWMin}/{pWMax}/{pRadiusMin}/{pRadiusMax}/{pGrooveInsertDesignation}/{pCarbideGrade}/{pGrooveCuttingEdge}/{pKaAngleMin}/{pKaAngleMax}/{pKrAngleMin}/{pKrAngleMax}/{pHolderType}/{Filter}/{Top}  
          let brandname:string =this.getvalueparambyname("TD_BrandName");
          let shape:string =this.getvalueparambyname("TD_InsertShape");
          let inserts:string =this.getvalueparambyname("TD_InsertDesignation");
          let grade:string =this.getvalueparambyname("TD_Grade");
          let holder:string =this.getvalueparambyname("TD_HolderDesignation");
          param=this.srv_StMng.IPL.GetItem('TD_ISOMat').value+"/"+this.srv_StMng.IPL.GetItem("Units").value +"/" + this.srv_StMng.SecApp+"/" +
                brandname + "/" +shape + "/" +this.srv_StMng.IPL.GetItem('TD_NegOrPosAngle').value +"/" + this.srv_StMng.IPL.GetItem('TD_PrecisionOrUtility').value+
                "/0/999/0/999/" +inserts + "/" +grade +"/All/0/999/0/9999/" +holder+"/" ;
          str_param=param + str_s + "/" + t;
          this.eventsSubscription.add(this.srv_DataLayer.get_tdlist('get-ISO-tool-list',str_param).subscribe((res: any)=>{this.filldatasubscribe(res);}) );
          break; 
      }  
      case "TOOLCATALOGNOISO": {
         //get-ISO-tool-list/{pIsoMat}/{pUnits}/{pSecondaryApp}/{pGrooveBrandName}/{pInsertShape}/{pAngle}/{pPrecisionOrUtility}/{pWMin}/{pWMax}/{pRadiusMin}/{pRadiusMax}/{pGrooveInsertDesignation}/{pCarbideGrade}/{pGrooveCuttingEdge}/{pKaAngleMin}/{pKaAngleMax}/{pKrAngleMin}/{pKrAngleMax}/{pHolderType}/{Filter}/{Top}  
          let brandname:string =this.getvalueparambyname("TD_BrandName");
          let shape:string =this.getvalueparambyname("TD_InsertShape");
          let inserts:string =this.getvalueparambyname("TD_InsertDesignation");
          let grade:string =this.getvalueparambyname("TD_Grade");
          let holder:string =this.getvalueparambyname("TD_HolderDesignation");
          param=this.srv_StMng.IPL.GetItem('TD_ISOMat').value+"/"+this.srv_StMng.IPL.GetItem("Units").value +"/" + this.srv_StMng.SecApp+"/" +
                brandname + "/" +shape + "/" +this.srv_StMng.IPL.GetItem('TD_NegOrPosAngle').value +"/" + this.srv_StMng.IPL.GetItem('TD_PrecisionOrUtility').value+
                "/0/999/0/999/" +inserts + "/" +grade +"/All/0/999/0/9999/" +holder+"/" ;
          str_param=param + str_s + "/" + t;
          this.eventsSubscription.add(this.srv_DataLayer.get_tdlist('get-ISO-toolcatalogno-list',str_param).subscribe((res: any)=>{this.filldatasubscribe(res);}) );
          break; 
      }  
      case "INSERTCATALOGNOISO": {
          // get-ISO-insertscatalogno-list/{pIsoMat}/{pUnits}/{pSecondaryApp}/{pGrooveBrandName}/{pInsertShape}/{pAngle}/{pPrecisionOrUtility}/{pWMin}/{pWMax}/{pRadiusMin}/{pRadiusMax}")
          let brandname:string =this.getvalueparambyname("TD_BrandName");
          let shape:string =this.getvalueparambyname("TD_InsertShape");
          param=this.srv_StMng.IPL.GetItem('TD_ISOMat').value+"/"+this.srv_StMng.IPL.GetItem("Units").value +"/" + this.srv_StMng.SecApp+"/" +
                brandname + "/" +shape + "/" +this.srv_StMng.IPL.GetItem('TD_NegOrPosAngle').value +"/" + this.srv_StMng.IPL.GetItem('TD_PrecisionOrUtility').value+
                "/0/999/0/999/";
          str_param=param + str_s + "/" + t;
          this.eventsSubscription.add(this.srv_DataLayer.get_tdlist('get-ISO-insertscatalogno-list',str_param).subscribe((res: any)=>{this.filldatasubscribe(res);}) );
          break; 
      } 
       default: {             
          break; 
      } 
    }   

  }
 
  getvalueparambyname(name:string)
  {
    let val:string;
    this.srv_StMng.IPL.GetItem(name).value==null || this.srv_StMng.IPL.GetItem(name).value==''? val = 'All':val = this.srv_StMng.IPL.GetItem(name).value;
    return val;
  }

  getmore()
  {        
    this.show_all =!this.show_all;
    if(this.show_all)
      {
        this.Top=9999;               
        this.callfunchttp(this.funcname);
        this.after_getmore=true;
        this.desc_show_more ="Show less...";
      }
    else
      {           
        if(this.Filter == '' || this.Filter == 'All')
          this.Top=5;
        else
          this.Top=9999;

        this.desc_show_more ="Show more...";
      }
  }

  filldatasubscribe(data:any)
  {       
    if(data=='e') { this.SpinnerService.hide();return;}   
    this.show_more = false;   
    let n:number=0;
    this.arrData =[];     
    //add from post      
    for (const d of JSON.parse(data)) {                                                     
            if(d[this.fieldname]!='All' && d[this.fieldname].replace(/\s/g, "")!='')                                     
              this.arrData.push({                
                                  RecordID:n++,
                                  Designation:d[this.fieldname],
                                  Value:  d[this.fieldname],
                                  Checked:false
                                })          
    }
      //add selected
      this.selitems.forEach(pp=>{
      let a:ToolOptimizeItem[];
      a=this.arrData.filter(p=>p.Designation==pp.Designation)
      if(a.length==0)
      {
        this.arrData.unshift({                
                        RecordID:pp.RecordID,
                        Designation:pp[this.fieldname],
                        Value:  pp[this.fieldname],
                        Checked:true
                        }) 
      }
      else    
        a[0].Checked=true;      
    } );
             
    if(this.arrData.length <6) 
    {
      this.max_row_show =this.arrData.length;
      this.show_more = true;
    }
    else
    {
      this.max_row_show = 6;
      this.show_more = true;
    }                                                                                                                            
    this.SpinnerService.hide();
    this.after_get_data =true;
    this.arrDataF=this.arrData;
    this.setSelectedItemsFromServerStateManager();
    this.isshowdetail=true;        
  }
  
  setSelectedItemsFromServerStateManager()
  {
    if(this.srv_StMng.IPL!= null)
     {
       //this.srv_StMng.IPL.GetItem(this.fieldid).value;
       let arr:string[];
       arr = this.srv_StMng.IPL.GetItem(this.fieldid).value.split(',');      
       for (let value of arr) {
          if(this.arrDataF.filter(p=>p.Value==value).length>0)
            this.arrData.filter(p=>p.Value==value)[0].Checked =true;
      }     
    }
  }
  
  get_strselectedvalue(arr :ToolOptimizeItem[]):string
  {
    let str:string ='';     
    arr.forEach(pp=>{str = str +pp.Designation + ",";} );
    if(str!='') str=str.substring(0,str.length-1);
    return str;
    //str =str.substring (0,this.select_items.length-1);
  }

  checkItem()
  {
    this.selitems =this.arrDataF.filter(p => p.Checked);  
    this.fillselectedvalue(); 
    this.srv_StMng.IPL.GetItem(this.fieldid).value = this.get_strselectedvalue( this.selitems);             
  }
  
  remove_select()
  {      
    this.arrDataF.filter(p=>p.Checked).forEach((pp=>{pp.Checked=false;}));
    this.selitems=[];
    this.select_items='';   
    this.srv_StMng.IPL.GetItem(this.fieldid).value =this.srv_StMng.IPL.GetItem(this.fieldid).valuedefault;
    this.after_get_data=false;
    //this.showdetail();    
  }

  showdetail()
  {
    if(!this.isshowdetail)
    {
      this.isshowdetail=true; 
      if(!this.after_get_data) this.callfunchttp(this.funcname);            
    }    
    else
      {
       this.isshowdetail=false;                  
       this.fillselectedvalue();                        
      }
  }

  fillselectedvalue()
  {
    this.select_items=''; 
    this.selitems=[];              
    this.selitems =this.arrDataF.filter(p => p.Checked);
    this.selitems.forEach(pp=>{this.select_items = this.select_items +pp.Designation + ",";} );
    this.select_items =this.select_items.substring (0,this.select_items.length-1);
  }
}
