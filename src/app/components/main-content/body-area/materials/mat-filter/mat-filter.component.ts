import { Component, OnInit } from '@angular/core';
import { sidetab } from 'src/app/models/materials/sidetab';
import { MaterialService } from 'src/app/services/material.service'

@Component({
  selector: 'app-mat-filter',
  templateUrl: './mat-filter.component.html',
  styleUrls: ['./mat-filter.component.scss','../materials.component.scss']
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
    this.Tabs.push (new sidetab(1,"P","Steel"));    
    this.Tabs.push (new sidetab(2,"M","Stainless Steel")); 
    this.Tabs.push (new sidetab(3,"K","Cast Iron")); 
    this.Tabs.push (new sidetab(4,"N","Non-Femous Metals")); 
    this.Tabs.push (new sidetab(5,"S","Superalloys and Titanium")); 
    this.Tabs.push (new sidetab(6,"H","Extra Material")); 
    this.Tabs[0].IsSelected=true;
  }

  fillStandard(){
    this.serv.getmaterialstandard().subscribe((res:any)=>{
      this.matStandard=JSON.parse(res);})
  }
}
