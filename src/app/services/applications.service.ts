import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApplicationsService {

  private API_ROUTE = 'api/applications/';
  constructor(private httpClient: HttpClient) 
  {}

  public  getmenu(lang:string,usergroup:string)
  {        
    return  this.httpClient.get(environment.API_HOST + this.API_ROUTE + 'getmenu/' + lang + '/' + usergroup);
  }
}
