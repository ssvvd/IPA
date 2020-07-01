import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient,HttpErrorResponse} from '@angular/common/http';
import 'rxjs/add/operator/catch'
  
@Injectable({
  providedIn: 'root'
})

export class DatalayerService {

  private API_ROUTE = 'api/datalayer/';
  
  //public aaa:Function;

  constructor(private httpClient: HttpClient) 
  {                
  }

   public  getinputparameters(secapp:string,units:string)
  {        
    return  this.httpClient.get(environment.API_HOST + this.API_ROUTE + 'input-parameters/' + secapp + '/' + units);
  }

  public  dictionarygetlanguage()
  {           
    return  this.httpClient.get(environment.API_HOST + this.API_ROUTE + 'dictionary-get-language');
  }
  public  dictionarygetlinelanguage(lang:string)
  {           
    return  this.httpClient.get(environment.API_HOST + this.API_ROUTE + 'dictionaty-get-lines/'+lang);
  }

  public  holediameterdrilling(units:string)
  {           
    return  this.httpClient.get(environment.API_HOST + this.API_ROUTE + 'holediameter-drilling/'+units);
  }

  public  thread_form()
  {           
    return  this.httpClient.get(environment.API_HOST + this.API_ROUTE + 'thread-form');
  }
  
  public  thread_data_c(units:string,threadform:string)
  {           
    return  this.httpClient.get(environment.API_HOST + this.API_ROUTE + 'thread-data-c/'+units + '/'+ threadform);
  }
 
  public  thread_form_data(threadform:string,threadtype:string,units:string)
  {            
    return  this.httpClient.get(environment.API_HOST + this.API_ROUTE + 'thread-form-data/'+threadform + '/'+ threadtype + '/' +units);
  }
    
  public  thread_form_colname(threadtype:string)
  {            
    return  this.httpClient.get(environment.API_HOST + this.API_ROUTE + 'thread-form-colname/'+  threadtype );
  }

  public  get_tdlist(func:string,par:string)
  {           
    return  this.httpClient.get(environment.API_HOST + 'api/optimizetool/' + func + '/' + par) 
    .catch((err: HttpErrorResponse) => {      
        return "error";
      });  
  }  

  public  get_token()
  {    
    //getToken/{LoginURLReq}/{LoginURLTokenUrl}/{LoginURLTokenID}/{LoginURLTokenSecret}/{siteType}      
    return  this.httpClient.get(environment.API_HOST +'api/login/getToken/1/1/1/1/local') 
    .catch((err: HttpErrorResponse) => {      
        return "error";
      });  
  }  
  public  login(token:string)
  {    
    //login/{LoginURLReq}/{LoginURLRes}/{token}/{siteType}    
    return  this.httpClient.get(environment.API_HOST +'api/login/login/1/1/' + token + '/local') 
    .catch((err: HttpErrorResponse) => {      
        return "error";
      });  
  } 
}
