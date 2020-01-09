import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ChangeContext } from 'ng5-slider';
import { sidetab } from 'src/app/models/materials/sidetab';
import { MaterialService } from 'src/app/services/material.service'
import { StateManagerService } from 'src/app/services/statemanager.service' ;

@Component({
  selector: 'app-mat-filter',
  templateUrl: './mat-filter.component.html',
  styleUrls: ['./mat-filter.component.scss','../materials.component.scss']
})
export class MatFilterComponent implements OnInit {

  Tabs:sidetab[]=[];
  matStandard:string[]=[];
  curSelectedCategory:string;
  standardSelected:String;
  searchText:String;

  @Output() categEvent = new EventEmitter<string>();
  @Output() standardEvent = new EventEmitter<string>();
  @Output() MaterialSearchChanged = new EventEmitter<String>();
  // @Output() MaterialSearchClear = new EventEmitter();

  constructor(private serv: MaterialService,private srv_statemanage:StateManagerService) { }

  ngOnInit() {

    this.fillStandard();
    this.filTabs();
    this.curSelectedCategory = 'P';
    this.standardSelected = '';
    this.categClick(this.curSelectedCategory);
    this.srv_statemanage.CurrentMaterialSelected.subscribe(arr => this.SelectedMaterial(arr));
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

  categClick(categ: string) {
    this.categEvent.emit(categ)
    this.curSelectedCategory = categ;
    this.standardSelected = '';
  }

  onStandardChange(standardValue:string) {
    console.log(standardValue);
    if (standardValue == ''){
      this.categClick(this.curSelectedCategory);
    }
    else{
      this.standardEvent.emit(standardValue);
    }
    this.standardSelected = standardValue;
}

SelectedMaterial(arr:string[])
{    
  if (arr[0]){
    let cat = arr[0].substring(0,1);
    this.categClick(cat);
  }
}

FilterChange(event: ChangeContext ) {      
/*   if (this.searchText == '')
      this.MaterialSearchClear.emit();
  else */
      this.MaterialSearchChanged.emit(this.searchText);   
}

}