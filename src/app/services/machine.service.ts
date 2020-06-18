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

  public  getmachines(units:string)
  {        
    return  this.httpClient.get(environment.API_HOST + this.API_ROUTE + 'machines/' +units);
  }
  public  getmachinedetailed(id:number)
  {        
    return  this.httpClient.get(environment.API_HOST + this.API_ROUTE + 'machine-detailed/' + id);
  }
  public  getmachineheader(id:number)
  {        
    return  this.httpClient.get(environment.API_HOST + this.API_ROUTE + 'machine-header/' + id);
  }
  public  getmachineadaptationtype()
  {        
    return  this.httpClient.get(environment.API_HOST + this.API_ROUTE + 'machine-adaptatation-type');
  }
   public  getmachineadaptationsize()
  {        
    return  this.httpClient.get(environment.API_HOST + this.API_ROUTE + 'machine-adaptatation-size');
  }
   public  getmachineadaptationdata(adaptationtype:string,adaptationsize:string,spindle:string,units:string)
  {        
    return  this.httpClient.get(environment.API_HOST + this.API_ROUTE + 'machine-adaptatation-data/'+ adaptationtype +"/" +adaptationsize + "/" +spindle +"/" +units);
  }

  public  machine_copy(machineid:string,machinetype:string,machinename:string,machinename_new:string)
  {  //machines-copy/{MachineID}/{MachineType}/{MachineName}/{MachineName_new}      
    return  this.httpClient.get(environment.API_HOST + this.API_ROUTE + 'machines-copy/' + machineid + '/' + machinetype + '/' + machinename + '/' + machinename_new);
  }
}