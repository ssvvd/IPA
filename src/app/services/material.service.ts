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
}
