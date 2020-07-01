import { Component, OnInit,Input } from '@angular/core';
import { DatalayerService} from 'src/app/services/datalayer.service' ;
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
  selector: 'app-optimizetool-filter-ext',
  templateUrl: './optimizetool-filter-ext.component.html',
  styleUrls: ['./optimizetool-filter-ext.component.scss']
})

export class OptimizetoolFilterExtComponent implements OnInit {

  @Input() labeldescription:string;
  @Input() funcname:string;
  
  @Input() fieldname:string;
  @Input() fieldvalue:string ='';
  @Input() fieldid:string;

  @Input() events: Observable<void>;
  private eventsSubscription: Subscription=new Subscription();

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

  constructor(private srv_DataLayer:DatalayerService,private srv_StMng:StateManagerService,private srv_appsetting:AppsettingService,
              private SpinnerService: NgxSpinnerService) { }
  
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
    this.srv_StMng.opttool_selectedfamily = this.selitems;    
    this.srv_StMng.IPL.GetItem(this.fieldid).value =this.srv_StMng.IPL.GetItem(this.fieldid).valuedefault; 
  }

 /*  BuildSelectItems()
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
    this.srv_StMng.opttool_selectedfamily = this.selitems;
    this.select_items =this.select_items.substring (0,this.select_items.length-1);  
  } */
  
  BuildSelectItems()
  {
    let arr = this.srv_StMng.opttool_selectedfamily;   
    for (let a of arr) {
        this.selitems.push({ RecordID:0,
                             Designation:a.Designation,
                             Value:  a.Value,
                             Checked:true
                            });      
    }
    this.selitems.forEach(pp=>{this.select_items = this.select_items +pp.Designation + ",";} );
    //this.srv_StMng.opttool_selectedfamily = this.selitems;
    this.select_items =this.select_items.substring (0,this.select_items.length-1);  
  }

    ApplySearch(s:string) {    
    this.str_search = s;
    if(this.after_getmore)
    {
        this.arrDataF = this.arrData.filter(
        m => m.Designation.toUpperCase().indexOf(s.toUpperCase()) > -1  || m.Checked);
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
    let param:string;
    switch(funcname)
    { 
      case"FAMILYTHREAD":  {  
         let cool_yes:string;
         let cool_no:string;  
         let threadform:string;
         let pitch:string;
         let size:string='All';
         let brandname:string;
         this.srv_StMng.IPL.GetItem("TD_CoolantYes").value=='True'? cool_yes = '1':cool_yes = '0'; 
         this.srv_StMng.IPL.GetItem("TD_CoolantNo").value=='True'? cool_no = '1':cool_no = '0'; 
         this.srv_StMng.IPL.GetItem("TD_BrandName").value==''?brandname='All':brandname= this.srv_StMng.IPL.GetItem("TD_BrandName").value;
         this.srv_StMng.IPL.GetItem("ThreadForm").value==null || this.srv_StMng.IPL.GetItem("ThreadForm").value==''? threadform = 'All':threadform = this.srv_StMng.IPL.GetItem("ThreadForm").value; 
         this.srv_StMng.IPL.GetItem("Pitch").value==null || this.srv_StMng.IPL.GetItem("Pitch").value==''? pitch = 'All':pitch = this.srv_StMng.IPL.GetItem("Pitch").value; 
         this.srv_StMng.IPL.GetItem("Size").value==null || this.srv_StMng.IPL.GetItem("Size").value==''? size = 'All':size = this.srv_StMng.IPL.GetItem("Size").value; 
         param=this.srv_StMng.IPL.GetItem("Units").value + "/" + this.srv_StMng.SecApp+ "/" +brandname +"/1/1/" 
                                 + threadform + "/" + pitch + "/" + size + "/" +cool_no + "/" +cool_yes+"/";    
          str_param=param + str_s + "/" + t;
          this.eventsSubscription.add(this.srv_DataLayer.get_tdlist('td-get-family-thread',str_param).subscribe((res: any)=>{this.filldatasubscribe(res)})) ;
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
                                  Value: this.fieldvalue==''? d[this.fieldname]:d[this.fieldvalue],
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
                        Value: this.fieldvalue==''? pp[this.fieldname]:pp[this.fieldvalue],
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
    arr.forEach(pp=>{str = str +pp.Value + ",";} );
    if(str!='') str=str.substring(0,str.length-1);
    return str;   
  }

  checkItem()
  {
    this.selitems =this.arrDataF.filter(p => p.Checked);  
    this.fillselectedvalue(); 
    this.srv_StMng.IPL.GetItem(this.fieldid).value = this.get_strselectedvalue( this.selitems);  
    this.srv_StMng.opttool_selectedfamily = this.selitems;           
  }
  
  remove_select()
  {      
    this.arrDataF.filter(p=>p.Checked).forEach((pp=>{pp.Checked=false;}));
    this.selitems=[];
    this.select_items='';   
    this.srv_StMng.IPL.GetItem(this.fieldid).value =this.srv_StMng.IPL.GetItem(this.fieldid).valuedefault;
    this.after_get_data=false;   
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
