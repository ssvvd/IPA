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

  public  getmachines(units:string,isgermany:boolean,userid:string)
  {       
    if(userid!='')  userid='/' + userid;
    let isgermanystr:string='0';
    if(isgermany)  isgermanystr='1'; 
    return  this.httpClient.get(environment.API_HOST + this.API_ROUTE + 'machines/' +units + '/'+ isgermanystr + userid);
  }
  public  getmachinedetailed(id:number,units:string)
  {        
    return  this.httpClient.get(environment.API_HOST + this.API_ROUTE + 'machine-detailed/' + id + '/' +units);
  }
  public  getmachineheader(id:number)
  {        
    return  this.httpClient.get(environment.API_HOST + this.API_ROUTE + 'machine-header/' + id);
  }
  public  getmachineadaptationtype(machinetype:string,spindletype:string)
  {        
    return  this.httpClient.get(environment.API_HOST + this.API_ROUTE + 'machine-adaptatation-type/' +machinetype + '/'+spindletype);
  }
   public  getmachineadaptationsize(units:string)
  {        
    return  this.httpClient.get(environment.API_HOST + this.API_ROUTE + 'machine-adaptatation-size/' + units);
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
    let str:string;
    str=environment.API_HOST + this.API_ROUTE +  'machines-update/' + machineid +
    '/'+ machinetype +'/' +machinename +'/' +units +'/'+ machinetype1 + '/' + costperhour +'/' + currency;   
    return  this.httpClient.post(environment.API_HOST + this.API_ROUTE +  'machines-update/' + machineid +
      '/'+ machinetype +'/' +machinename +'/' +units +'/'+ machinetype1 + '/' + costperhour +'/' + currency, inputparam ).catch((err: HttpErrorResponse) => {   
      console.error('An error occurred:', err.error);   
      return "error";
    });  

  }
  
  public  machine_update_name(machineid:string,machine_name:string,userid:string)
  {        
    return  this.httpClient.get(environment.API_HOST + this.API_ROUTE + 'machines-update-name/' + machineid + '/'  + machine_name + '/'+ userid);
  }
}