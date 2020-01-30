import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient,HttpHeaders  } from '@angular/common/http';
//import { Observable } from 'rxjs/Observable';


  
@Injectable({
  providedIn: 'root'
})
export class DatalayerService {

  private API_ROUTE = 'api/datalayer/';
  
  public aaa:Function;

  constructor(private httpClient: HttpClient) 
  {       
     this.aaa=function(par:string){ console.log('http://localhost:17586/' + 'api/datalayer/' + 'td-get-brandname-list/' + par);return  this.httpClient.get('http://localhost:17586/' + 'api/datalayer/' +  'td-get-brandname-list/' + par);}
  }

   public  getinputparameters(secapp:string,units:string)
  {        
    return  this.httpClient.get(environment.API_HOST + this.API_ROUTE + 'input-parameters/' + secapp + '/' + units);
  }

  public  getresult(secapp:string,requestid:string)
  {        
    return  this.httpClient.get(environment.API_HOST + this.API_ROUTE + 'get-result/' + secapp + '/' + requestid);
  }

  public  setinputparameters(inputparam:{ name: string, value: string }[]) {      
    const testparam={"name":"ben"};
    return this.httpClient.post(environment.API_HOST + this.API_ROUTE + 'set-parameters', inputparam);               
  }
  
  /*  public  td_brandname_list(units:string,bTA:number,bSolid:number,secapp:string)
  {        
    return  this.httpClient.get(environment.API_HOST + this.API_ROUTE + 'td-get-brandname-list/' + units + '/' + bTA + '/' +bSolid+ '/' + secapp);
  } */
  
  public  td_brandname_list(par:string)
  {           
    return  this.httpClient.get(environment.API_HOST + this.API_ROUTE + 'td-get-brandname-list/' + par);
  }

  public  td_tools_list(par:string)
  {           
    return  this.httpClient.get(environment.API_HOST + this.API_ROUTE + 'td-get-brandname-list/' + par);
  }

   public  setinputparameters1() {
     const testparam={'Name':'sveta','Value':'123'};
     //const config = { headers: new HttpHeaders().set('Content-Type', 'application/json') };
    return this.httpClient.post(environment.API_HOST + this.API_ROUTE + 'set-parameters1',testparam);       
  }

  test() {
      const data = {'username': 'sveta', 'password': '12345'};
      const config = { headers: new HttpHeaders().set('Content-Type', 'application/json') };
      //return this.httpClient.post(environment.API_HOST + this.API_ROUTE + 'set-parameters', data, config);
      let JSONParams = JSON.stringify(data); 
    return this.httpClient.post(environment.API_HOST + this.API_ROUTE + 'set-parameters',"test string");
    }
  

}
