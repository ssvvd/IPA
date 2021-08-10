import { Component, OnInit, } from '@angular/core';
import { StateManagerService } from '../../../../../../services/statemanager.service';
import {  Subject } from 'rxjs';

@Component({
  selector: 'app-optimizetool',
  templateUrl: './optimizetool.component.html',
  styleUrls: ['./optimizetool.component.scss']
})

export class OptimizetoolComponent implements OnInit {
    
  TypeFeed:string ="BothFeed";
  eventsSubject: Subject<void> = new Subject<void>();
  
  isLoad:boolean =false;
  public msrv_StMng:StateManagerService =this.srv_StMng;

  constructor(private srv_StMng:StateManagerService) { }
  
  ClearDataChild() {
    this.TypeFeed='BothFeed';
    this.changeTypeFeed();
    this.srv_StMng.IPL.GetItem('TD_IT_InsertTool').value =this.srv_StMng.IPL.GetItem('TD_IT_InsertTool').valuedefault;
    this.srv_StMng.IPL.GetItem('TD_IT_InsertHead').value =this.srv_StMng.IPL.GetItem('TD_IT_InsertHead').valuedefault;
    this.srv_StMng.IPL.GetItem('TD_IT_SolidTool').value =this.srv_StMng.IPL.GetItem('TD_IT_SolidTool').valuedefault;
    this.srv_StMng.IPL.GetItem('TD_IT_SolidHead').value =this.srv_StMng.IPL.GetItem('TD_IT_SolidHead').valuedefault;
    this.eventsSubject.next();
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
    if(this.TypeFeed=="HightFeed")  
    {this.srv_StMng.IPL.GetItem('TD_FASTFEED').value='True'; 
    this.srv_StMng.IPL.GetItem('TD_REGULAR').value='False';
    this.srv_StMng.IPL.GetItem('OperationType').value='Heavy'
    };
    if(this.TypeFeed=="NormalFeed")  {this.srv_StMng.IPL.GetItem('TD_FASTFEED').value='False'; this.srv_StMng.IPL.GetItem('TD_REGULAR').value='True'};
  } 
  
}
