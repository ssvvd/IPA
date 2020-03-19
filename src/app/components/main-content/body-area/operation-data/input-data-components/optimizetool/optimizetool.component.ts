import { Component, OnInit,Input,SimpleChanges, SimpleChange,ViewChild } from '@angular/core';
import { InputParameterItem } from 'src/app/models/operational-data/inputparameteritem';
import { InputParameterlist } from 'src/app/models/operational-data/inputparameterlist';
import { DatalayerService} from 'src/app/services/datalayer.service' ;
import { StateManagerService } from 'src/app/services/statemanager.service';
import { OptimizetoolFilterComponent} from 'src/app/components/main-content/body-area/operation-data/input-data-components/optimizetool-filter/optimizetool-filter.component'
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

  //@Input() Ipl:InputParameterlist;
  //@Input() parentSubject:Subject<any>;
   @ViewChild(OptimizetoolFilterComponent,{ static: false }) OptimizetoolFilter: OptimizetoolFilterComponent ; 
  TypeFeed:string ="BothFeed";

  arrBrandName:ToolOptimizeItem[]=[];
  arrToolDesignation:ToolOptimizeItem[]=[];

  //parBrandName:string='All';
  //parToolDesignation:string='All';
  eventsSubject: Subject<void> = new Subject<void>();

  isLoad:boolean =false;
  
  constructor(private srv_DataLayer:DatalayerService,private srv_StMng:StateManagerService) { }
  
  ClearDataChild() {
    this.TypeFeed='BothFeed';
    this.changeTypeFeed();
    this.srv_StMng.IPL.GetItem('TD_IT_InsertTool').value =this.srv_StMng.IPL.GetItem('TD_IT_InsertTool').valuedefault;
    this.srv_StMng.IPL.GetItem('TD_IT_InsertHead').value =this.srv_StMng.IPL.GetItem('TD_IT_InsertHead').valuedefault;
    this.srv_StMng.IPL.GetItem('TD_IT_SolidTool').value =this.srv_StMng.IPL.GetItem('TD_IT_SolidTool').valuedefault;
    this.srv_StMng.IPL.GetItem('TD_IT_SolidHead').value =this.srv_StMng.IPL.GetItem('TD_IT_SolidHead').valuedefault;
    this.eventsSubject.next();
  }

 /*  onClearFilter()
  {
    alert('ssssss');
    this.OptimizetoolFilter.ClearData();
  } */

  GetSelectedItemsString(items:ToolOptimizeItem[]): string
  {
    let strItems:string='';
    items.forEach (p=>{strItems = strItems +p.Value + ",";});  
    if(strItems=='') 
      strItems ="All";
    else
      strItems =strItems.substring (0,strItems.length-1);
    return strItems;
  }
 
  ngOnInit() {   
    if(this.srv_StMng.IPL.GetItem('TD_FASTFEED').value=='True'&& this.srv_StMng.IPL.GetItem('TD_REGULAR').value=='True')        
      this.TypeFeed="BothFeed";     
    else             
        if (this.srv_StMng.IPL.GetItem('TD_FASTFEED').value=='True') 
          this.TypeFeed="HightFeed";
        else 
          this.TypeFeed="NormalFeed";           
    this.isLoad =true;
  }

  change(field:string)
  {      
      if(this.srv_StMng.IPL.GetItem(field).value=='True')
        this.srv_StMng.IPL.GetItem(field).value='False';
      else
        this.srv_StMng.IPL.GetItem(field).value='True';                
  }

  changeTypeFeed()
  {
    if(this.TypeFeed=="BothFeed")  {this.srv_StMng.IPL.GetItem('TD_FASTFEED').value='True'; this.srv_StMng.IPL.GetItem('TD_REGULAR').value='True'};
    if(this.TypeFeed=="HightFeed")  {this.srv_StMng.IPL.GetItem('TD_FASTFEED').value='True'; this.srv_StMng.IPL.GetItem('TD_REGULAR').value='False'};
    if(this.TypeFeed=="NormalFeed")  {this.srv_StMng.IPL.GetItem('TD_FASTFEED').value='False'; this.srv_StMng.IPL.GetItem('TD_REGULAR').value='True'};
  } 
  
  get_strselectedvalue(arr :ToolOptimizeItem[]):string
  {
    let str:string ='';     
    arr.forEach(pp=>{str = str +pp.Designation + ",";} );
    return str;
    //str =str.substring (0,this.select_items.length-1);
  }
}
