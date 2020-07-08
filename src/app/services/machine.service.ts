import { Injectable } from '@angular/core';
import { HttpClient,HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MachineService {

  private API_ROUTE = 'api/machine/';
  constructor(private httpClient: HttpClient) 
  {}

  public  getmachines(units:string,userid:string)
  {       
    if(userid!='')  userid='/' + userid;
     
    return  this.httpClient.get(environment.API_HOST + this.API_ROUTE + 'machines/' +units + userid);
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

  public  machine_add(machineid:string,machinename_new:string,userid:string)
  {    
    return  this.httpClient.get(environment.API_HOST + this.API_ROUTE + 'machines-add/' + machineid + '/' + machinename_new +'/' + userid);
  }
  public  machine_delete(machineid:string,userid:string)
  {        
    return  this.httpClient.get(environment.API_HOST + this.API_ROUTE + 'machines-delete/' + machineid + '/'  + userid);
  }
  public  machine_update(machineid:number,machinetype:string,machinename:string,units:string,machinetype1:string,costperhour :number,currency:string,inputparam:string) //todo:
  {      
    //ByVal MachineID As String, ByVal MachineType As String, ByVal MachineName As String, ByVal Units As String, ByVal MachineType1 As String, ByVal CostPerHour As Decimal, _
    //ByVal Currency As Decimal
    return  this.httpClient.post(environment.API_HOST + this.API_ROUTE +  'machines-update/' + machineid +
      '/'+ machinetype +'/' +machinename +'/' +units +'/'+ machinetype1 + '/' + costperhour +'/' + currency, inputparam ).catch((err: HttpErrorResponse) => {   
      console.error('An error occurred:', err.error);   
      return "error";
    });  

  }
}