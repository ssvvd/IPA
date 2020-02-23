import { Component, OnInit,Input ,Output,EventEmitter} from '@angular/core';
import { DatalayerService} from 'src/app/services/datalayer.service' ;
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

  @Input() selitems:ToolOptimizeItem[];
  @Input() labeldescription:string;
  @Input() funcname:string;
  @Input() funcpar:string;
  @Input() field:string;
 
  //@Output() selectitems = new EventEmitter();
  @Output() selectitems = new EventEmitter<{items: ToolOptimizeItem[],funcname:string}>();

  arrData:ToolOptimizeItem[]=[];
  arrDataF:ToolOptimizeItem[]=[];
  isshowdetail:boolean=false;  
  select_items:string='';
  show_more:boolean =false;
  show_all:boolean =false;
  after_getmore =false;

  description:string;
  desc_show_more:string;
  str_search:string ='';
  max_row_show:number;
  after_get_data:boolean;
  data:any;
  Top:number =10;
  Filter:string='All';
  status_view:string;
  
  constructor(private srv_DataLayer:DatalayerService,
    private SpinnerService: NgxSpinnerService) { }
  
  ngOnInit() { 
     this.desc_show_more ="Show more...";
     this.arrData=[];
     this.after_get_data=false;
     this.status_view="new";
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
 
  callfunchttp(func:string)
  {   
    this.SpinnerService.show();
    let str_param:string;
    let str_s:string= this.str_search;
    let t:number= this.Top;
    if (str_s.replace(/\s/g, "") !='') t =9999 ; 
    str_s=str_s.replace (' ' ,'blank');
    if (str_s.replace(/\s/g, "") =='') str_s ='All';

    str_param=this.funcpar + str_s + "/" + t;

    switch(func)
        { 
          case "brandname": { 
              this.srv_DataLayer.td_brandname_list(str_param).subscribe((res: any)=>{this.data=res;this.filldatasubscribe(res);}) ;
              break; 
          } 
          case"tool":  { 
              this.srv_DataLayer.td_tool_list(str_param).subscribe((res: any)=>{this.data=res;this.filldatasubscribe(res)}) ;
              break; 
          } 
          default: { 
              //statements; 
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
        //this.selectitems.emit({ items: this.selitems,funcname:this.funcname, Top:this.Top,Filter:this.Filter});
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
    this.show_more = false;   
    let n:number=0;
    this.arrData =[];   
    //add from post      
    for (const d of JSON.parse(data)) {                  
          {                                   
            if(d[this.field]!='All' && d[this.field].replace(/\s/g, "")!='')                                     
              this.arrData.push({                
                                  RecordID:n++,
                                  Designation:d[this.field],
                                  Value:  d[this.field],
                                  Checked:false
                                }) 
          }
    }
    //add selected
      this.selitems.forEach(pp=>{
      let a:ToolOptimizeItem[];
      a=this.arrData.filter(p=>p.Designation==pp.Designation)
      if(a.length==0)
      {
        this.arrData.unshift({                
                        RecordID:pp.RecordID,
                        Designation:pp[this.field],
                        Value:  pp[this.field],
                        Checked:true
                        }) 
      }
      else
      {
        a[0].Checked=true;
      }
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
    this.isshowdetail=true;  
  }
  
  checkItem()
  {
    this.selitems =this.arrDataF.filter(p => p.Checked);  
    this.fillselectedvalue();   
    this.selectitems.emit({ items: this.selitems,funcname:this.funcname});          
  }
  
  remove_select()
  {      
    this.arrDataF.filter(p=>p.Checked).forEach((pp=>{pp.Checked=false;}));
    this.selitems=[];
    this.select_items='';
    this.selectitems.emit({ items: this.selitems,funcname:this.funcname});
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
