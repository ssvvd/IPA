import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MaterialService {

  private API_ROUTE = 'api/material/';
  constructor(private httpClient: HttpClient) { }

  public  getmaterials(lang:string)
  {        
    return  this.httpClient.get(environment.API_HOST + this.API_ROUTE + 'materials/' + lang);
  }
  public  getmaterialsbygrp(lang:string , grp:string)
  {        
    return  this.httpClient.get(environment.API_HOST + this.API_ROUTE + 'materials/' + lang + '/' + grp);
  }
  public  getmaterialdesignation(matdes:string)
  {        
    return  this.httpClient.get(environment.API_HOST + this.API_ROUTE + 'material-designation/' + matdes);
  }
  public  getmaterialstandard()
  {        
    return  this.httpClient.get(environment.API_HOST + this.API_ROUTE + 'material-standard');
  }
  public  getmaterialsdetails(GWFN:number)
  {        
    return  this.httpClient.get(environment.API_HOST + this.API_ROUTE + 'material-details/' + GWFN);
  }
  public  getmaterialsdetailsSpec(GWCCNT:string , GWFN:number)
  {        
    return  this.httpClient.get(environment.API_HOST + this.API_ROUTE + 'material-details/' + GWFN + '/' + GWCCNT);
  }
  public  getmaterialsdetailsStnd(grp:string , GWCCNT:string)
  {        
    return  this.httpClient.get(environment.API_HOST + this.API_ROUTE + 'material-details-stnd/' + grp + '/' + GWCCNT);
  }
  public  getmaterialhardness()
  {        
    return  this.httpClient.get(environment.API_HOST + this.API_ROUTE + 'material-hardness-conv');
  }
  public  getmaterialimits(mat:number)
  {        
    return  this.httpClient.get(environment.API_HOST + this.API_ROUTE + 'material-hardness-limit/' + mat);
  }
  public  searchmaterial(mat:string)
  {        
    return  this.httpClient.get(environment.API_HOST + this.API_ROUTE + 'material-search/' + mat);
  }
  //"material-get-fav/{userID}//{FavoritName}/
  public getMatFav(userID:string){
    return  this.httpClient.get(environment.API_HOST + this.API_ROUTE + 'material-get-fav/' + userID );
  }


  public DeleteMaterialFavorit( userID:string,  FavoritName:string){
    return this.httpClient.get(environment.API_HOST + this.API_ROUTE + 'material-del-fav/' + userID + '/' + FavoritName);
  }


  public AddMaterialFavorit( userID:string,  ISO:string,  Group:number,  FavoritName:string,  Standard:string,  Condetion:string,  Hardness:number,  HardnessUnits:string,  HardnessOrig:number,HardnessHBValue:number,matOrig:string)
  {
    if(matOrig!='')  matOrig='/' + matOrig;
    return this.httpClient.get(environment.API_HOST + this.API_ROUTE + 'material-add-fav/' + userID + '/' + ISO+ '/' + Group+ '/' + FavoritName+ '/' + Standard+ '/' + Condetion+ '/' + Hardness+ '/' + HardnessUnits+ '/' + HardnessOrig + '/' + HardnessHBValue + matOrig);
  }


  public EditMaterialFavorit( userID:string,  OldFavoritName:string,  FavoritName:string,  Hardness:number,  HardnessUnits:string){
    return this.httpClient.get(environment.API_HOST + this.API_ROUTE + 'material-edit-fav/' + userID + '/' + OldFavoritName+ '/' + FavoritName+ '/' + Hardness+ '/' + HardnessUnits);
  }
}