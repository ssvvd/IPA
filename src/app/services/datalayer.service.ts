import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient,HttpHeaders  } from '@angular/common/http';
import { HttpParameterCodec } from '@angular/common/http';
  
@Injectable({
  providedIn: 'root'
})

/* export declare class HttpUrlEncodingCodec implements HttpParameterCodec {
    encodeKey(k: string): string;
    encodeValue(v: string): string;
    decodeKey(k: string): string;
    decodeValue(v: string): string;
} */
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

  public  getresults(secapp:string,units:string,inputparam:string)
  {    
    //let tst:string;
    //tst="http://localhost:17586/api/datalayer/get-results/get-result-test/760/M/mat=10/lenth=2/ppp=4/mmm=sss dddd/nnn=ddd dddd/par6=122 333/par7=4/par8=5/par10=333/par10=ooo/par11=aa ss/par12=777/par13=jj/par14=fff dd/par15=ddd" ;
    return  this.httpClient.get(environment.API_HOST + this.API_ROUTE + 'get-results/' + secapp + '/'+units + "/" + inputparam);
     //return  this.httpClient.get(environment.API_HOST + this.API_ROUTE + 'get-results-test/' + secapp + '/'+units + "/" + inputparam);
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

  public  td_tool_list(par:string)
  {           
    return  this.httpClient.get(environment.API_HOST + this.API_ROUTE + 'td-get-tool-list/' + par);
  }

  public  setinputparameters1() {
    
     const testparam={'Name':'sveta','Value':'123'};
     //let ss:string= this.p.encodeValue ("'Name':'sveta','Value':'12.3'"); 
     //const config = { headers: new HttpHeaders().set('Content-Type', 'application/json') };
    return this.httpClient.post(environment.API_HOST + this.API_ROUTE +'set-parameters', "[{'name':'sveta','value':'12.3'},{'name':'sveta1','value':'12.3'}");       
     //return this.httpClient.post('http://www.iscar.com/ita_api/api/datalayer/set-parameters',"adadadadad" );       
  }

  test() {
      const data = {'username': 'sveta', 'password': '12345'};
      const config = { headers: new HttpHeaders().set('Content-Type', 'application/json') };
      //return this.httpClient.post(environment.API_HOST + this.API_ROUTE + 'set-parameters', data, config);
      let JSONParams = JSON.stringify(data); 
      
    return this.httpClient.post(environment.API_HOST + this.API_ROUTE + 'set-parameters-test',"test string");
    }
  

}
