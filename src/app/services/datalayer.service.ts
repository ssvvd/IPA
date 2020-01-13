import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DatalayerService {

  private API_ROUTE = 'api/datalayer/';
  constructor(private httpClient: HttpClient) 
  {   
  }

   public  getinputparameters(secapp:string,units:string)
  {        
    return  this.httpClient.get(environment.API_HOST + this.API_ROUTE + 'input-parameters/' + secapp + '/' + units);
  }

  public  setinputparameters(inputparam:string) {
    return this.httpClient.post<string>(environment.API_HOST + this.API_ROUTE + 'set-parameters', inputparam);
  
}  
}
