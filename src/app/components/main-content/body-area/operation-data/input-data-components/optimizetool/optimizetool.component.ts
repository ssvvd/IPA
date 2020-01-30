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
  isshow_brandname:boolean =false;
  arrBrandName:ToolOptimizeItem[]=[];
  decs_brandname:string=''; 
  isLoad:boolean =false;

  constructor(private srv_DataLayer:DatalayerService) { }
  
  ngOnInit() { 
     this.parentSubject.subscribe(event => {
       let strItems:string='';
       this.arrBrandName.forEach (p=>{strItems = strItems +p.Value + ",";});       
       this.Ipl.GetItem('TD_BrandName').value=strItems;       
    });
    
    if(this.Ipl.GetItem('TD_FASTFEED').value=='1' && this.Ipl.GetItem('TD_REGULAR').value=='1')        
      this.TypeFeed="BothFeed";     
    else             
        if (this.Ipl.GetItem('TD_FASTFEED').value=='1') 
          this.TypeFeed="HightFeed";
        else 
          this.TypeFeed="NormalFeed";           
    this.isLoad =true;
  }
  
   onSelectedBrandNamesChanged($event) {    
    this.arrBrandName = $event.items;         
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
}
