import { Component, OnInit,Input,SimpleChanges, SimpleChange,ViewChild } from '@angular/core';
import { InputParameterlist } from 'src/app/models/operational-data/inputparameterlist';
import { StateManagerService } from 'src/app/services/statemanager.service';
import { Observable, Subject } from 'rxjs';

/* interface ToolOptimizeItem
{
  RecordID:number;
  Designation:string;
  Value:string;
  Checked:boolean;
} */

@Component({
  selector: 'app-optimizetool990',
  templateUrl: './optimizetool990.component.html',
  styleUrls: ['./optimizetool990.component.scss']
})

export class Optimizetool990Component implements OnInit {


/*   arrBrandName:ToolOptimizeItem[]=[];
  arrToolDesignation:ToolOptimizeItem[]=[];  */
  eventsSubject: Subject<void> = new Subject<void>();
  
  isLoad:boolean =false;
  public msrv_StMng:StateManagerService =this.srv_StMng;

  constructor(private srv_StMng:StateManagerService) { }
  
  ClearDataChild() {
 
   /*  this.srv_StMng.IPL.GetItem('TD_IT_InsertTool').value =this.srv_StMng.IPL.GetItem('TD_IT_InsertTool').valuedefault;
    this.srv_StMng.IPL.GetItem('TD_IT_InsertHead').value =this.srv_StMng.IPL.GetItem('TD_IT_InsertHead').valuedefault;
    this.srv_StMng.IPL.GetItem('TD_IT_SolidTool').value =this.srv_StMng.IPL.GetItem('TD_IT_SolidTool').valuedefault;
    this.srv_StMng.IPL.GetItem('TD_IT_SolidHead').value =this.srv_StMng.IPL.GetItem('TD_IT_SolidHead').valuedefault; */
    this.eventsSubject.next();
  }

/*   GetSelectedItemsString(items:ToolOptimizeItem[]): string
  {
    let strItems:string='';
    items.forEach (p=>{strItems = strItems +p.Value + ",";});  
    if(strItems=='') 
      strItems ="All";
    else
      strItems =strItems.substring (0,strItems.length-1);
    return strItems;
  } */
 
  ngOnInit() {           
    this.isLoad =true;
  }

  change(field:string)
  {      
      if(this.srv_StMng.IPL.GetItem(field).value=='True')
        this.srv_StMng.IPL.GetItem(field).value='False';
      else
        this.srv_StMng.IPL.GetItem(field).value='True';                
  }  
  
 /*  get_strselectedvalue(arr :ToolOptimizeItem[]):string
  {
    let str:string ='';     
    arr.forEach(pp=>{str = str +pp.Designation + ",";} );
    return str;    
  } */
}
