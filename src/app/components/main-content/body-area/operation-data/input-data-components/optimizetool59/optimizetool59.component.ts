import { Component, OnInit,Input,SimpleChanges, SimpleChange } from '@angular/core';
import { InputParameterItem } from 'src/app/models/operational-data/inputparameteritem';
import { InputParameterlist } from 'src/app/models/operational-data/inputparameterlist';

@Component({
  selector: 'app-optimizetool59',
  templateUrl: './optimizetool59.component.html',
  styleUrls: ['./optimizetool59.component.scss']
})

export class Optimizetool59Component implements OnInit {

  @Input() Ipl:InputParameterlist;
  
  TypeFeed:string ="BothFeed";
  constructor() { }

  ngOnInit() { 
    if(this.Ipl.GetItem('TD_FASTFEED').value=='1' && this.Ipl.GetItem('TD_REGULAR').value=='1')        
      this.TypeFeed="BothFeed";     
    else             
        if (this.Ipl.GetItem('TD_FASTFEED').value=='1') 
          this.TypeFeed="HightFeed";
        else 
          this.TypeFeed="NormalFeed";          
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
    if(this.TypeFeed=="BothFeed")  {this.Ipl.GetItem('TD_FASTFEED').value='1'; this.Ipl.GetItem('TD_REGULAR').value='1'};
    if(this.TypeFeed=="HightFeed")  {this.Ipl.GetItem('TD_FASTFEED').value='1'; this.Ipl.GetItem('TD_REGULAR').value='0'};
    if(this.TypeFeed=="NormalFeed")  {this.Ipl.GetItem('TD_FASTFEED').value='0'; this.Ipl.GetItem('TD_REGULAR').value='1'};
  }
}
