import { Injectable } from '@angular/core';
import { clsMaterial } from 'src/app/models/materials/material'

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
  }

  getCategoryTable(lang:string,category:string){
    return this.mainMaterialsTable.get(lang + category)
  }


}
   