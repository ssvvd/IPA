import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient,HttpHeaders  } from '@angular/common/http';
import { HttpParameterCodec } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ResultsService {

  private API_ROUTE = 'api/results/';

  constructor(private httpClient: HttpClient) { }

  public  getresults(secapp:string,units:string,inputparam:string)
  {    
    return  this.httpClient.post(environment.API_HOST + this.API_ROUTE +  'get-results/' + secapp + '/'+units  , inputparam );
  }

  public  getoolproperties(secapp:string,units:string,inputparam:string)
  {    
    return  this.httpClient.post(environment.API_HOST + this.API_ROUTE +  'get-tool-properties/' + secapp + '/'+units  , inputparam );
  }

  public  getgroups(secapp:string)
  {        
    return  this.httpClient.get(environment.API_HOST + this.API_ROUTE + 'get-groups/' + secapp );
  }

  public  getdefaultfields(secapp:string)
  {        
    return  this.httpClient.get(environment.API_HOST + this.API_ROUTE + 'get-default-fields/' + secapp );
  }
}
