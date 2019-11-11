import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-main-content',
  templateUrl: './main-content.component.html',
  styleUrls: ['./main-content.component.scss']
})

export class MainContentComponent implements OnInit { 

  activetab: string="activetab";
  constructor() { }
  
  ngOnInit() {
    this.activetab="machine";
  }
  
  TabChanged(tabname:string) {   
    this.activetab = tabname;       
  }

}
