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
    //let headers = {headers: {'Content-Type': 'application/json'}};
    alert(inputparam);
    const testparam={"name":"ben"};
    return this.httpClient.post(environment.API_HOST + this.API_ROUTE + 'set-parameters', inputparam);    
    
    //return this.httpClient.post(environment.API_HOST + this.API_ROUTE + 'set-parameters', params, {headers: {'Content-Type': 'application/json'}});
    //alert(environment.API_HOST + this.API_ROUTE + 'set-parameters');       
  }
  
   public  setinputparameters1(inputparam:string) {
     const config = { headers: new HttpHeaders().set('Content-Type', 'application/json') };
    return this.httpClient.post(environment.API_HOST + this.API_ROUTE + 'set-parameters', inputparam);       
  }

  test() {
      const data = {'username': 'sveta', 'password': '12345'};
      const config = { headers: new HttpHeaders().set('Content-Type', 'application/json') };
      //return this.httpClient.post(environment.API_HOST + this.API_ROUTE + 'set-parameters', data, config);
      let JSONParams = JSON.stringify(data); 
    return this.httpClient.post(environment.API_HOST + this.API_ROUTE + 'set-parameters',"test string");
    }
  

}
