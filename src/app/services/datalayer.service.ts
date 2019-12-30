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

   public  getinputparameters()
  {        
    return  this.httpClient.get(environment.API_HOST + this.API_ROUTE + 'input-parameters');
  }
}
