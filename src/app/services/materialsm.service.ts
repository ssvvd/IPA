import { Injectable } from '@angular/core';
import { clsMaterial } from 'src/app/models/materials/material'
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MaterialsmService {

  constructor() { }
  private mainMaterialsTable:Map<string,clsMaterial[]>=new Map()


  checkCategoryTableExists(lang:string,category:string){
    return this.mainMaterialsTable.has(lang + category)
  }

  setNewCategoryTable(lang:string,category:string,data:clsMaterial[]){
    this.mainMaterialsTable.set(lang + category,data)
    //console.log(lang + category);
    //console.log(data);
    //console.log(this.mainMaterialsTable);
  }

  getCategoryTable(lang:string,category:string){
    //console.log(this.mainMaterialsTable.get(lang + category));
    return this.mainMaterialsTable.get(lang + category)
  }


}
   