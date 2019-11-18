import { Component, OnInit ,Output,EventEmitter} from '@angular/core';
import { Router, Event, NavigationStart, NavigationEnd, NavigationError } from '@angular/router';

@Component({
  selector: 'app-main-content',
  templateUrl: './main-content.component.html',
  styleUrls: ['./main-content.component.scss']
})

export class MainContentComponent implements OnInit { 
 
  @Output() ChangedRoute = new EventEmitter();
  activeroute:string;
  activetab: string="activetab";

  constructor() { 
  
  }
  
  ngOnInit() {
    //this.activetab="machine";   
  }
  
  /* TabChanged(tabname:string) {   
    //this.activetab = tabname;       
  } */

}
