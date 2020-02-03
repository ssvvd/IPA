import { Component, OnInit,Input,SimpleChanges, SimpleChange } from '@angular/core';
import { InputParameterItem } from 'src/app/models/operational-data/inputparameteritem';
import { InputParameterlist } from 'src/app/models/operational-data/inputparameterlist';
import { DatalayerService} from 'src/app/services/datalayer.service' ;
import { Observable, Subject } from 'rxjs';

interface ToolOptimizeItem
{
  RecordID:number;
  Designation:string;
  Value:string;
  Checked:boolean;
}
@Component({
  selector: 'app-optimizetool',
  templateUrl: './optimizetool.component.html',
  styleUrls: ['./optimizetool.component.scss']
})

export class OptimizetoolComponent implements OnInit {

  @Input() Ipl:InputParameterlist;
  @Input() parentSubject:Subject<any>;
 

  TypeFeed:string ="BothFeed";

  //isshow_brandname:boolean =false;

  arrBrandName:ToolOptimizeItem[]=[];
  arrToolDesignation:ToolOptimizeItem[]=[];

  parBrandName:string='All';
  parToolDesignation:string='All';

  isLoad:boolean =false;
  
  constructor(private srv_DataLayer:DatalayerService) { }
  
  GetSelectedBrandName() : string
  {
    let strItems:string='';
    this.arrBrandName.forEach (p=>{strItems = strItems +p.Value + ",";});  
    if(strItems=='') strItems ="All";
    return strItems;
  }

  GetSelectedToolDesignation() : string
  {
    let strItems:string='';
    this.arrToolDesignation.forEach (p=>{strItems = strItems +p.Value + ",";});
    if(strItems=='') strItems ="All";    
    return strItems;
  }

  ngOnInit() { 
    this.parentSubject.subscribe(event => {              
    this.Ipl.GetItem('TD_BrandName').value= this.GetSelectedBrandName() ;
    this.Ipl.GetItem('TD_ToolDesignation').value= this.GetSelectedToolDesignation();     
    });
    
    this.parBrandName="M/1/1/760/";
    this.parToolDesignation="All/0/999/All/1/1/760/M/All/";

    if(this.Ipl.GetItem('TD_FASTFEED').value=='1' && this.Ipl.GetItem('TD_REGULAR').value=='1')        
      this.TypeFeed="BothFeed";     
    else             
        if (this.Ipl.GetItem('TD_FASTFEED').value=='1') 
          this.TypeFeed="HightFeed";
        else 
          this.TypeFeed="NormalFeed";           
    this.isLoad =true;
  }
  
  onSelectedItems($event) {          
    switch($event.funcname)
        { 
          case "brandname": { 
              this.arrBrandName = $event.items;
              this.Ipl.GetItem('TD_BrandName').value=this.get_strselectedvalue(this.arrBrandName);
              break; 
          } 
          case"tool":  { 
              this.arrToolDesignation = $event.items;
              this.Ipl.GetItem('TD_ToolDesignation').value=this.get_strselectedvalue(this.arrToolDesignation);
              break; 
          } 
          default: {               
              break; 
          } 
        }           
        this.parToolDesignation=this.GetSelectedBrandName()+ "/0/999/All/1/1/760/M/All/"  ;
        //alert(this.parToolDesignation);
   }

   onSelectedBrandNamesChanged($event) {    
    this.arrBrandName = $event.items; 
     
    this.parToolDesignation="";      
   }
  
   onSelectedToolDesignationChanged($event) {    
    this.arrToolDesignation = $event.items;         
   }

  change(field:string)
  {      
      if(this.Ipl.GetItem(field).value=='0') 
        this.Ipl.GetItem(field).value='1';
      else
        this.Ipl.GetItem(field).value='0';                
  }

  changeTypeFeed()
  {
    if(this.TypeFeed=="BothFeed")  {this.Ipl.GetItem('TD_FASTFEED').value='True'; this.Ipl.GetItem('TD_REGULAR').value='True'};
    if(this.TypeFeed=="HightFeed")  {this.Ipl.GetItem('TD_FASTFEED').value='True'; this.Ipl.GetItem('TD_REGULAR').value='False'};
    if(this.TypeFeed=="NormalFeed")  {this.Ipl.GetItem('TD_FASTFEED').value='False'; this.Ipl.GetItem('TD_REGULAR').value='True'};
  } 
  
  get_strselectedvalue(arr :ToolOptimizeItem[]):string
  {
    let str:string ='';     
    arr.forEach(pp=>{str = str +pp.Designation + ",";} );
    return str;
    //str =str.substring (0,this.select_items.length-1);
  }
}
