import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient,HttpHeaders  } from '@angular/common/http';
//import { Observable } from 'rxjs/Observable';

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

  public  setinputparameters(inputparam:{ name: string, value: string }[]) {        
    return this.httpClient.post(environment.API_HOST + this.API_ROUTE + 'set-parameters', inputparam);               
  }
  
   public  setinputparameters1(inputparam:string) {
    return this.httpClient.post(environment.API_HOST + this.API_ROUTE + 'set-parameters', inputparam);       
  }

}
