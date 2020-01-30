import { Component, OnInit,Input ,Output,EventEmitter} from '@angular/core';
import { DatalayerService} from 'src/app/services/datalayer.service' ;

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
  @Output() selectitems = new EventEmitter<{items: ToolOptimizeItem[]}>();

  arrData:ToolOptimizeItem[];
  arrDataF:ToolOptimizeItem[];
  isshowdetail:boolean=false;  
  select_items:string;
  show_more:boolean =false;
  show_all:boolean =false;

  description:string;
  desc_show_more:string;
  str_search:string ='';
  max_row_show:number;
  after_get_data:boolean;
  data:any;

  constructor(private srv_DataLayer:DatalayerService) { }
  
  ngOnInit() { 
     this.desc_show_more ="Show more...";
     this.arrData=[];
     this.after_get_data=false;
  }  

  ApplySearch(s:string) {    
    this.str_search = s;
    this.arrDataF = this.arrData.filter(
      m => m.Designation.toUpperCase().indexOf(s.toUpperCase()) > -1  || m.Checked
    );    
  }
 
  callfunchttp(func:string)
  {   
    switch(func)
        { 
          case "brandname": { 
              this.srv_DataLayer.td_brandname_list(this.funcpar).subscribe((res: any)=>{this.data=res;this.filldatasubscribe(res);this.after_get_data=true;}) ;
              break; 
          } 
          case"tool":  { 
              /* this.srv_DataLayer.td_brandname_list(this.funcpar).subscribe((data: any)=>{this.filldatasubscribe(data)}) ;
              break;  */
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
        this.desc_show_more ="Show less...";
    else
        this.desc_show_more ="Show more...";   
  }

  filldatasubscribe(data:any)
  {
    this.show_more = false;
    if(data.length <10) 
      this.max_row_show =data.length;
    else
      {
        this.max_row_show =10;
        this.show_more = true;
      }   
    let n:number=0;         
    for (const d of JSON.parse(data)) {                  
          {              
            n++;       
            if(!this.after_get_data)              
              this.arrData.push({
                RecordID:n,
                Designation:d.BrandName,
                Value:  d.BrandName,
                Checked:false
              }) 
          }                                                                                                               
    }
    this.arrDataF=this.arrData;   
    this.isshowdetail=true;  
  }
  
  checkItem()
  {
    this.selitems =this.arrDataF.filter(p => 
          p.Checked);  
    this.selectitems.emit({ items: this.selitems});          
  }

  showdetail()
  {
    if(!this.isshowdetail)
    {
      if(!this.after_get_data)
      {                        
        this.callfunchttp(this.funcname);  
        this.ApplySearch(this.str_search);      
      }
      this.isshowdetail=true;  
    }    
    else
      {
       this.isshowdetail=!this.isshowdetail;
       if(typeof(this.arrDataF) !== 'undefined')
        {          
          this.select_items=''; 
          this.selitems=[];              
          this.selitems =this.arrDataF.filter(p => 
          p.Checked);
          this.selitems.forEach(pp=>{this.select_items = this.select_items +pp.Designation + ",";} );
          this.select_items =this.select_items.substring (0,this.select_items.length-1);
        }     
      }
  }
}
