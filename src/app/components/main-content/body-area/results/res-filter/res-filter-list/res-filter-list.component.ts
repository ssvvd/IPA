import { Component, OnInit,Input ,Output,EventEmitter} from '@angular/core';
import { DatalayerService} from 'src/app/services/datalayer.service' ;
import { DatalayerOptimizeToolService} from 'src/app/services/datalayer-tooloptimize.service' ;
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
  selector: 'res-filter-list',
  templateUrl: './res-filter-list.component.html',
  styleUrls: ['./res-filter-list.component.scss']
})

export class ResFilterListComponent implements OnInit {

  @Output("getListFields") getListFields: EventEmitter<any> = new EventEmitter();
  @Output("change") change: EventEmitter<any> = new EventEmitter();
  @Input() controlName:string;
  @Input() filteredList:string[] = [];

  @Input() labeldescription:string;
  @Input() funcname:string;
  
  @Input() fieldname:string;
  @Input() fieldid:string;

  @Input() events: Observable<void>;
  private eventsSubscription: Subscription=new Subscription();
  srchValue:string;
  isChecked:string;
  lastValueSrch:string;
  selitems:ToolOptimizeItem[];

  arrlistFieldsAll:string[]=[];
  arrlistFields:string[]=[];
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

  constructor(private srv_DataLayer:DatalayerService,private srv_dl_toolopt:DatalayerOptimizeToolService,
              private srv_StMng:StateManagerService,private srv_appsetting:AppsettingService,
              private SpinnerService: NgxSpinnerService) { }
  
  ngOnInit() { 
    this.eventsSubscription.add(this.events.subscribe(() => this.ClearData()));

    this.desc_show_more ="Show more...";
    this.arrData=[];
    this.after_get_data=false;
    this.selitems= [];
    // if(this.srv_StMng.IPL.GetItem(this.fieldid).value!=this.srv_StMng.IPL.GetItem(this.fieldid).valuedefault)  
    //   {
    //     this.BuildSelectItems();
    //   } 
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
    // this.srv_StMng.IPL.GetItem(this.fieldid).value =this.srv_StMng.IPL.GetItem(this.fieldid).valuedefault; 
  }

  // BuildSelectItems()
  // {
  //   let arr = this.srv_StMng.IPL.GetItem(this.fieldid).value.split(",");   
  //   for (let value of arr) {
  //       this.selitems.push({ RecordID:0,
  //                            Designation:value,
  //                            Value:  value,
  //                            Checked:true
  //                           });      
  //   }
  //   this.selitems.forEach(pp=>{this.select_items = this.select_items +pp.Designation + ",";} );
  //   this.select_items =this.select_items.substring (0,this.select_items.length-1);  
  // }
    
    ApplySearch(s:string) {    
      if (this.lastValueSrch != s.toUpperCase()){
        this.str_search = s;

        this.arrlistFields = this.arrlistFieldsAll.filter(
          m => m.toUpperCase().indexOf(s.toUpperCase()) > -1
        );
    
        let type:string = 'S'
        let value:string = s
        if (s.trim()==''){
          type = 'CS'
          value = this.lastValueSrch
        }
          
    
        this.change.emit({control:'filterList',Res:[this.controlName,value.toUpperCase(),type]});
    
        this.lastValueSrch = s.toUpperCase()
      }

    // if(!this.after_getmore){
    //   if(this.str_search!=''){
    //     this.after_getmore=false;
    //   } 
    // }
    // else{
    //   if(this.str_search!='') this.after_getmore=false;
    // }

    // if(this.after_getmore)
    // {
    //     this.arrDataF = this.arrData.filter(
    //     m => m.Designation.toUpperCase().indexOf(s.toUpperCase()) > -1  || m.Checked
    //   );
    // }
    // else
    // {
    //   this.callfunchttp(this.funcname);
    //   if(this.str_search!='') this.after_getmore=false;
    // }  
   
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
          param=this.srv_appsetting.Units + "/1/1/" + this.srv_StMng.SecApp + "/"; 
          str_param=param + str_s + "/" + t;
          this.eventsSubscription.add(this.srv_dl_toolopt.td_brandname_list(str_param).subscribe((res: any)=>{this.filldatasubscribe(res);}) );
          break; 
      } 
      case"TOOL":  {        
          param=this.srv_StMng.IPL.GetItem("TD_BrandName").value + "/0/999/All/1/1/" + this.srv_StMng.SecApp +"/" + this.srv_appsetting.Units + "/All/";
          str_param=param + str_s + "/" + t;
          this.eventsSubscription.add(this.srv_dl_toolopt.td_tool_designation_list(str_param).subscribe((res: any)=>{this.filldatasubscribe(res)}) );
          break; 
      }
      case "INSERT":  {                 
          param=this.srv_StMng.IPL.GetItem("TD_BrandName").value +"/" + this.srv_StMng.IPL.GetItem("TD_ToolDesignation").value+  "/0/999/1/1/" + this.srv_StMng.SecApp +"/" + this.srv_appsetting.Units + "/";
          str_param=param + str_s + "/" + t;
          this.eventsSubscription.add(this.srv_dl_toolopt.td_insert_designation_list(str_param).subscribe((res: any)=>{this.filldatasubscribe(res)}) );
          break; 
      } 
      case"TOOLCATALOGNO":  { 
          param=this.srv_StMng.IPL.GetItem("TD_BrandName").value + "/0/999/All/1/1/" + this.srv_StMng.SecApp +"/" + this.srv_appsetting.Units + "/All/"  + this.srv_StMng.IPL.GetItem("TD_ToolDesignation").value+ "/";
          str_param=param + str_s + "/" + t;
          this.eventsSubscription.add(this.srv_dl_toolopt.td_tool_catalogno_list(str_param).subscribe((res: any)=>{this.filldatasubscribe(res)}) );
          break; 
      }
      case"INSERTCATALOGNO":  { 
          param=this.srv_StMng.IPL.GetItem("TD_BrandName").value + "/" +this.srv_StMng.IPL.GetItem("TD_InsertDesignation").value + "/" 
          + this.srv_appsetting.Units + "/1/1/All/" + this.srv_StMng.SecApp +"/" + this.srv_StMng.IPL.GetItem("TD_ToolDesignation").value+"/" + this.srv_StMng.IPL.GetItem("TD_ToolCatalogNo").value+ "/0/999/";
          str_param=param + str_s + "/" + t;
          this.eventsSubscription.add(this.srv_dl_toolopt.td_insert_catalogno_list(str_param).subscribe((res: any)=>{this.filldatasubscribe(res)})) ;
          break; 
      }
      case"GRADE":  {          
          param=this.srv_StMng.IPL.GetItem("TD_BrandName").value + "/" +this.srv_StMng.IPL.GetItem("TD_InsertDesignation").value + "/1/1/" +
          this.srv_StMng.IPL.GetItem("TD_InsertCatalogNo").value +"/"+ this.srv_appsetting.Units + "/" + this.srv_StMng.SecApp +"/" + 
          this.srv_StMng.IPL.GetItem("TD_ToolDesignation").value+ "/0/999/";
          str_param=param + str_s + "/" + t;
          this.eventsSubscription.add(this.srv_dl_toolopt.td_grade_list(str_param).subscribe((res: any)=>{this.filldatasubscribe(res)})) ;
          break; 
      }
      default: {             
          break; 
      } 
    }   

  }

  getmore()
  {        
    this.show_all =!this.show_all;
    if(this.show_all)
      {
        // this.Top=9999;               
        // this.callfunchttp(this.funcname);
        this.after_getmore=true;
        this.desc_show_more ="Show less...";
      }
    else
      {           
        // if(this.Filter == '' || this.Filter == 'All')
        //   // this.Top=5;
        // else
        //   // this.Top=9999;

        this.desc_show_more ="Show more...";
      }
  }

  filldatasubscribe(data:any)
  {   
    if(data=='error') { this.SpinnerService.hide();return;}   
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
      this.show_more = false;
    }
    else
    {
      this.max_row_show = 5;
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

  checkItem(value:string, event)
  {
    this.srchValue = value;
    if (event.target.checked)
    this.isChecked = "T"
  else
    this.isChecked = "F"
    this.change.emit({control:'filterList',Res:[this.controlName,value,this.isChecked]});
    // this.selitems =this.arrDataF.filter(p => p.Checked);  
    // this.fillselectedvalue(); 
    // this.srv_StMng.IPL.GetItem(this.fieldid).value = this.get_strselectedvalue( this.selitems);             
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
      if(!this.after_get_data) {
        this.getListFields.emit();         
        this.after_get_data = true;
      }
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

