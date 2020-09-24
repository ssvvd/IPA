import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient,HttpErrorResponse} from '@angular/common/http';
import 'rxjs/add/operator/catch'
/* import {HttpResponse} from '@angular/common/http';
import {Http, ResponseContentType} from '@angular/http'; */
import {Observable} from 'rxjs';
  
@Injectable({
  providedIn: 'root'
})

export class DatalayerService {

  private API_ROUTE = 'api/datalayer/';
  
  //public aaa:Function;

  constructor(private httpClient: HttpClient) 
  {                
  }

   public  getinputparameters(secapp:string,units:string,machinetype:string)
  { 
    
    return  this.httpClient.get(environment.API_HOST + this.API_ROUTE + 'input-parameters/' + secapp + '/' + units +'/' +machinetype);
  }

  public  dictionarygetlanguage()
  {           
    return  this.httpClient.get(environment.API_HOST + this.API_ROUTE + 'dictionary-get-language');
  }

  public  getcountries()
  {           
    return  this.httpClient.get(environment.API_HOST + this.API_ROUTE + 'get-countries');
  }
  public  GetCountryLangBrifData(countrycode:string)
  {           
    if(countrycode=='') countrycode='all'
    return  this.httpClient.get(environment.API_HOST + this.API_ROUTE + 'get-country-lang-brif/' + countrycode);
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

  getGEOLocation() {    
    return this.httpClient.get('http://ip-api.com/json');    
  } 

  getcountryNamebycountryCode(code:string) {    
   return this.httpClient.get('https://restcountries.eu/rest/v2/alpha/' +code)
   .catch((err: HttpErrorResponse) => {      
        return "e";
    });   
  }

  public  countrybyglobalname(countryglobalname:string)
  {                 
    return  this.httpClient.get(environment.API_HOST + this.API_ROUTE + 'get-country-by-globalname/'+countryglobalname);
  }
  
  public  getcurrencyeciw(brifname:string)
  {                 
    return  this.httpClient.get(environment.API_HOST + this.API_ROUTE + 'get-currency-eciw/'+brifname);
  }

  
  public  mailsend(name:string,email:string,country:string,company:string,message:string)
  {     
    let strpar:string='';
    if (country!='')strpar=strpar + '/'+ country;
    if (company!='')strpar=strpar + '/'+ company;
    if (message!='')strpar=strpar + '/'+ message;

    return  this.httpClient.get(environment.API_HOST + this.API_ROUTE + 'mail-send/'+name + '/' +email + strpar);
  }

  public  gethtmlpage(url:string)
  {                 
    return  this.httpClient.get(environment.API_HOST + this.API_ROUTE + 'get-page-html/'+url)
    .catch((err: HttpErrorResponse) => {      
      return "e";
    });
  }
  public  mailsendReqMat(email:string,Description:string, Group:string, Standard:string,Condition:string,Hardness:string, Manufacture:string)
  {     
    return  this.httpClient.get(environment.API_HOST + this.API_ROUTE + 'mail-send-req-mat/'+email + '/' +Description + '/' +Group + '/' +Standard + '/' +Condition + '/' +Hardness + '/' +Manufacture);
  }
  
  
  public  downloadp21file(scatalogno:string,units:string):Observable<any>
  {  
    let s:string;    
    s=environment.API_HOST +  'api/export/download-p21-files/'+scatalogno + '/' +units;   
    return  this.httpClient.get(s, {responseType: 'blob'});
  }

}
