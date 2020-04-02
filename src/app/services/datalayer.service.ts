import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient,HttpHeaders  } from '@angular/common/http';
//import { HttpParameterCodec } from '@angular/common/http';
  
@Injectable({
  providedIn: 'root'
})

export class DatalayerService {

  private API_ROUTE = 'api/datalayer/';
  
  //public aaa:Function;

  constructor(private httpClient: HttpClient) 
  {           
     //this.aaa=function(par:string){ console.log('http://localhost:17586/' + 'api/datalayer/' + 'td-get-brandname-list/' + par);return  this.httpClient.get('http://localhost:17586/' + 'api/datalayer/' +  'td-get-brandname-list/' + par);}
  }

   public  getinputparameters(secapp:string,units:string)
  {        
    return  this.httpClient.get(environment.API_HOST + this.API_ROUTE + 'input-parameters/' + secapp + '/' + units);
  }

  public  getresult(secapp:string,requestid:string)
  {        
    return  this.httpClient.get(environment.API_HOST + this.API_ROUTE + 'get-result/' + secapp + '/' + requestid);
  }

  public  td_brandname_list(par:string)
  {           
    return  this.httpClient.get(environment.API_HOST + this.API_ROUTE + 'td-get-brandname-list/' + par);
  }

  public  td_tool_list(par:string)
  {           
    return  this.httpClient.get(environment.API_HOST + this.API_ROUTE + 'td-get-tool-list/' + par);
  }
  public  dictionarygetlanguage()
  {           
    return  this.httpClient.get(environment.API_HOST + this.API_ROUTE + 'dictionary-get-language');
  }


  
}
