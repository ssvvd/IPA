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

  public  getcountries()
  {           
    return  this.httpClient.get(environment.API_HOST + this.API_ROUTE + 'get-countries');
  }
  public  GetCountryLangBrifData()
  {           
    return  this.httpClient.get(environment.API_HOST + this.API_ROUTE + 'get-country-lang-brif');
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
    return  this.httpClient.get(environment.API_HOST +'api/login/getToken/local') 
    .catch((err: HttpErrorResponse) => {      
        return "error";
      });  
  }  
  public  login(token:any)
  {    
    //login/{LoginURLReq}/{LoginURLRes}/{token}/{siteType}    
    token='{ "token":"' + token + '"}';
    return  this.httpClient.post(environment.API_HOST +'api/login/login/local',token) 
    .catch((err: HttpErrorResponse) => {      
        return "error";
      });  
  } 

  public  exchangerate(currency:string)
  {   
    if(currency=='')  currency="all"            
    return  this.httpClient.get(environment.API_HOST + this.API_ROUTE + 'get-exchange-rate/'+currency);
  }

/*   getGEOLocation() {
    let d:any;
    d=this.httpClient
    .get('https://api.ipify.org/?format=json').subscribe ((d:any)=>
    {       
      let url = "https://api.ipgeolocation.io/ipgeo?apiKey=AIzaSyBBVxlnKCe7SziM_y46iFQjR80LGCJMH6k&ip="+d.ip; 
      alert(url);
      return this.httpClient
            .get(url);
    });     
  }  */

  getGEOLocation() {    
    return this.httpClient
    .get('http://ip-api.com/json');    
  } 
  
  public  countrybyglobalname(countryglobalname:string)
  {                 
    return  this.httpClient.get(environment.API_HOST + this.API_ROUTE + 'get-country-by-globalname/'+countryglobalname);
  }
 /*  public getGEOLocation1() {


    // Update your api key to get from https://ipgeolocation.io
    let url = "https://api.ipgeolocation.io/ipgeo?apiKey=YourAPIKEY&ip="+this.getIpAddress(); 
      return this.httpClient
            .get(url)
            .pipe(
              //catchError(this.handleError)
            );
    }   */ 
}
