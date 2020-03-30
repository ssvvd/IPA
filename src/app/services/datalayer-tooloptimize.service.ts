import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient,HttpHeaders,HttpErrorResponse } from '@angular/common/http';
import 'rxjs/add/operator/catch'

@Injectable({
  providedIn: 'root'
})
export class DatalayerOptimizeToolService {

  private API_ROUTE = 'api/optimizetool/';

  constructor(private httpClient: HttpClient) { }


  public  td_brandname_list(par:string)
  {           
    return  this.httpClient.get(environment.API_HOST + this.API_ROUTE + 'td-get-brandname-list/' + par)
    .catch((err: HttpErrorResponse) => {      
        return "error";
      });  
  }

  public  td_tool_designation_list(par:string)
  {           
    return  this.httpClient.get(environment.API_HOST + this.API_ROUTE + 'td-get-tool-designation-list/' + par)
    .catch((err: HttpErrorResponse) => {      
        return "error";
      });  
  }

  public  td_insert_designation_list(par:string)
  {     
    return  this.httpClient.get(environment.API_HOST + this.API_ROUTE + 'td-get-insert-designation-list/' + par)
    .catch((err: HttpErrorResponse) => {      
        return "error";
      });      
  }

  //td-get-tool-catalogno-list/{BrandName}/{DiaFrom}/{DiaTo}/{Insert}/{bTA}/{bSolid}/{pSecondaryApp}/{pUnits}/{Family}/{ToolDesignation}/}{Filter}/{Top}
  public  td_tool_catalogno_list(par:string)
  {           
    return  this.httpClient.get(environment.API_HOST + this.API_ROUTE + 'td-get-tool-catalogno-list/' + par)
    .catch((err: HttpErrorResponse) => {      
        return "error";
    }); 
  }
  //td-get-insert-catalogno-list/{BrandName}/{Designation}/{Units}/{bTA}/{bSolid}/{CarbideGrade}/{SecondaryApp}/{Tool}/{DiaFrom}/{DiaTo}/{Filter}/{Top}
  public  td_insert_catalogno_list(par:string)
  {      
       return  this.httpClient.get(environment.API_HOST + this.API_ROUTE + 'td-get-insert-catalogno-list/' + par)
       .catch((err: HttpErrorResponse) => {      
        return "error";
      });    
  }
  public  td_grade_list(par:string)
  {           
    return  this.httpClient.get(environment.API_HOST + this.API_ROUTE + 'td-get-grade-list/' + par) 
    .catch((err: HttpErrorResponse) => {      
        return "error";
      });  
  }
}
