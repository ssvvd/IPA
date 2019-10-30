import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MachineService {

  private API_ROUTE = 'api/machine/';
  constructor(private httpClient: HttpClient) 
  {}

  public  getmachines()
  {        
    return  this.httpClient.get(environment.API_HOST + this.API_ROUTE + 'machines');
  }
  public  getmachinedetailed(id:number)
  {        
    return  this.httpClient.get(environment.API_HOST + this.API_ROUTE + 'machine-detailed/' + id)
  }
}