import { Component, OnInit } from '@angular/core';
import { sidetab } from 'src/app/models/materials/sidetab';
import { MaterialService } from 'src/app/services/material.service'

@Component({
  selector: 'app-mat-filter',
  templateUrl: './mat-filter.component.html',
  styleUrls: ['./mat-filter.component.scss']
})
export class MatFilterComponent implements OnInit {

  Tabs:sidetab[]=[];
  matStandard:string[]=[];

  constructor(private serv: MaterialService) { }

  ngOnInit() {

    this.fillStandard();
    this.filTabs();
    
  }
  
  filTabs(){
    this.Tabs.push (new sidetab(1,"P","Steel","#82aade"));    
    this.Tabs.push (new sidetab(2,"M","Stainless Steel","#fff184")); 
    this.Tabs.push (new sidetab(3,"K","Cast Iron","#eb8888")); 
    this.Tabs.push (new sidetab(4,"N","Non-Femous Metals","#9bd599")); 
    this.Tabs.push (new sidetab(5,"S","Superalloys and Titanium","#ffd685")); 
    this.Tabs.push (new sidetab(6,"H","Extra Material","#b2b2b2")); 
    this.Tabs[0].IsSelected=true;
  }

  fillStandard(){
    this.serv.getmaterialstandard().subscribe((res:any)=>{
      this.matStandard=JSON.parse(res);})
  }
}
