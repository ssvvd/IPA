import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient,HttpErrorResponse} from '@angular/common/http';
import 'rxjs/add/operator/catch'
/* import {HttpResponse} from '@angular/common/http';
import {Http, ResponseContentType} from '@angular/http'; */
import {Observable} from 'rxjs';
import { StringValueToken } from 'html2canvas/dist/types/css/syntax/tokenizer';
  
@Injectable({
  providedIn: 'root'
})

export class DatalayerService {

  private API_ROUTE = 'api/datalayer/';
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
  
  
  public  getcountry(countryid:string)
  {           
    return  this.httpClient.get(environment.API_HOST + this.API_ROUTE + 'get-country/' +countryid);
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
    let sitetype:string='global';
    if(environment.production)    
      sitetype ='global';   
    else
      sitetype ='local';
    let u:string;  
    //u=encodeURIComponent(environment.LoginURLTokenUrl).replace('.','***').replace('.','***').replace('.','***');
    u='u'; //temp
    let s:string=environment.API_HOST +'api/login/getToken/' + u+ '/' +sitetype;
    console.log(s);
    let url_current:string=window.location.href;
    let API_HOST:string=environment.API_HOST;
    if(sitetype=='local' && url_current.indexOf("https"))  API_HOST.replace ("http","https");
    return  this.httpClient.get(API_HOST +'api/login/getToken/' + u+ '/' +sitetype) 
    .catch((err: HttpErrorResponse) => {          
        return "e";
      });  
  } 
  
  public  checkgeneraluser(token:string)
  {    
    //getToken/{LoginURLReq}/{LoginURLTokenUrl}/{LoginURLTokenID}/{LoginURLTokenSecret}/{siteType}  
   /*  let sitetype:string;
    if(environment.production)    
      sitetype ='global';   
    else
      sitetype ='local'; */
  
    return  this.httpClient.get("https://sign.ssl.imc-companies.com/general/?t=" +token)
    .catch((err: HttpErrorResponse) => {      
        return "error";
      });  
  }

  public  login(token:any)
  {    
    //login/{LoginURLReq}/{LoginURLRes}/{token}/{siteType}    
    token='{ "token":"' + token + '"}';
    let sitetype:string;
    if(environment.production)    
      sitetype ='global';   
    else
      sitetype ='local';

    let u:string;  
    u=encodeURIComponent(environment.LoginURLRes).replace('.','***').replace('.','***').replace('.','***');
    return  this.httpClient.post(environment.API_HOST +'api/login/login/'+ u + '/' +sitetype,token) 
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
     return this.httpClient.get('https://ipinfo.io?token=197278fe32ac90') .catch((err: HttpErrorResponse) => {
      return 'e';
  });       
  } 

  getcountryNamebycountryCode(code:string) {    
   return this.httpClient.get('https://restcountries.eu/rest/v2/alpha/' +code)
   .catch((err: HttpErrorResponse) => {      
        return "e";
    });   
  }

  getcountryCodebycountryName(name:string) {    
    return this.httpClient.get('https://restcountries.eu/rest/v2/name/' +name)
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

  //mail-send-feedback/{country}/{answer1}/{answer2}/{message?}
  public  mailsendfeedback(country:string,answer1:string,answer2:string,message:string)
  {  
       
    return  this.httpClient.get(environment.API_HOST + this.API_ROUTE + 'mail-send-feedback/'+
                                country + '/' + answer1 + '/' + answer2 + '/'+ message);
  }

  public  mailsend(name:string,email:string,isjapaneversion:string,country:string,company:string,message:string)
  {     
    let strpar:string='';
    if(country=="") country='country';
    if(company=="") company='company';   
    strpar=strpar + '/'+ country ;
    strpar=strpar + '/'+ company;
    
    if (message!='')strpar=strpar + '/'+ message;

    return  this.httpClient.get(environment.API_HOST + this.API_ROUTE + 'mail-send/'+name + '/' +email +'/' +isjapaneversion + strpar);
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
  
  public  checkexistsp21(scatalogno:string):Observable<any>
  {        
    return  this.httpClient.get(environment.API_HOST + 'api/export/check-exists-p21/'+scatalogno);  
  }

  public  downloadfilepackage(scatalogno:string,units:string):Observable<any>
  {  
    let s:string;    
    s=environment.API_HOST +  'api/export/download-package-files/'+scatalogno + '/' +units;   
    return  this.httpClient.get(s, {responseType: 'blob'});
  }
  public  downloadfilezip(scatalogno:string,units:string,secapp:string,secappdesc:string,mainapp:string, 
    index:string , filename:string,
    input_par:any,outputdata:any):Observable<any>
  {  
    let s:string;     
    let strpar:string=JSON.stringify({input_par, outputdata});  
    //download-zip-files/{scatalogno}/{units}/{secapp}/{secappdesc}/{mainapp}/{index}  
    s=environment.API_HOST+'api/export/download-zip-files/'+scatalogno + '/' +units + '/' +secapp + '/' +secappdesc + '/'+ mainapp + '/' +index + '/'+ filename;   
    return  this.httpClient.post(s,strpar,{responseType: 'blob'});
  }

  public  addfeedback(q1:number,q2:number,msg:string)
  {     
    return  this.httpClient.get(environment.API_HOST + this.API_ROUTE + 'add-feedback/'+q1 + '/' +q2 + '/' +msg);
  }
  
  //GetThreadStandartInfo  
  public  getthreadstandartinfo(threadform:string)
  {     
    return  this.httpClient.get(environment.API_HOST + this.API_ROUTE + 'get-threadstandartinfo/'+threadform);
  }
}
