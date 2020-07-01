import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient,HttpHeaders,HttpErrorResponse  } from '@angular/common/http';
import 'rxjs/add/operator/catch'

@Injectable({
  providedIn: 'root'
})
export class ResultsService {

  private API_ROUTE = 'api/results/';

  constructor(private httpClient: HttpClient) {
   }

  public  getresults(secapp:string,units:string,inputparam:string)
  {    
    return  this.httpClient.post(environment.API_HOST + this.API_ROUTE +  'get-results/' + secapp + '/'+units  , inputparam ).catch((err: HttpErrorResponse) => {   
      console.error('An error occurred:', err.error);   
      return "error";
    });  
  }

  public  getoolproperties(secapp:string,units:string,inputparam:string)
  {    
    return  this.httpClient.post(environment.API_HOST + this.API_ROUTE +  'get-tool-properties/' + secapp + '/'+units  , inputparam ).catch((err: HttpErrorResponse) => {      
      console.error('An error occurred:', err.error);
      return "error";
    });
  }

  public  getgroups(secapp:string)
  {        
    return  this.httpClient.get(environment.API_HOST + this.API_ROUTE + 'get-groups/' + secapp ).catch((err: HttpErrorResponse) => {      
      console.error('An error occurred:', err.error);
      return "error";
    });
  }

  public  getdefaultfields(secapp:string)
  {        
    return  this.httpClient.get(environment.API_HOST + this.API_ROUTE + 'get-default-fields/' + secapp ).catch((err: HttpErrorResponse) => {      
      console.error('An error occurred:', err.error);
      return "error";
    });
  }

  public  Getfamilymovies()
  {        
    return  this.httpClient.get(environment.API_HOST + this.API_ROUTE + 'GetFamilyMovies' ).catch((err: HttpErrorResponse) => {     
      console.error('An error occurred:', err.error); 
      return "error";
    });
  }

  public  getfzminf(catNo:string)
  {        
    return  this.httpClient.get(environment.API_HOST + this.API_ROUTE + 'GetFzMin_F/' + catNo).catch((err: HttpErrorResponse) => {      
      console.error('An error occurred:', err.error);
      return "error";
    });
  }

  public  GetRatioLD(catNo:string)
  {        
    return  this.httpClient.get(environment.API_HOST + this.API_ROUTE + 'GetRatioLD/' + catNo).catch((err: HttpErrorResponse) => {      
      console.error('An error occurred:', err.error);
      return "error";
    });
  }

  public  getitemtype(catNo:string)
  {        
    return  this.httpClient.get(environment.API_HOST + this.API_ROUTE + 'GetItemType/' + catNo).catch((err: HttpErrorResponse) => {      
      console.error('An error occurred:', err.error);
      return "error";
    });
  }

  public  GetPromotionFamilies()
  {        
    return  this.httpClient.get(environment.API_HOST + this.API_ROUTE + 'GetPromotionFamilies' ).catch((err: HttpErrorResponse) => {     
      console.error('An error occurred:', err.error); 
      return "error";
    });
  }


  public  GetItemParameterValueSpecial(catNo:string,param:string,units:string)
  {        
    return  this.httpClient.get(environment.API_HOST + this.API_ROUTE + 'GetItemParameterValueSpecial/' + catNo + '/'+param + '/'+units).catch((err: HttpErrorResponse) => {      
      console.error('An error occurred:', err.error);
      return "error";
    });
  }


  public  GetPivotParamValue(catNo:string,param:number,sucApp:string)
  {        
    return  this.httpClient.get(environment.API_HOST + this.API_ROUTE + 'GetPivotParamValue/' + catNo + '/'+param + '/'+sucApp).catch((err: HttpErrorResponse) => {      
      console.error('An error occurred:', err.error);
      return "error";
    });
  }


  public  GetMPowerParams77(material:number,  Units:string,  KappaLeadAngle:number,  Flutes:number,  Feed:number,  catalogNoList:String)
  {        
    return  this.httpClient.get(environment.API_HOST + this.API_ROUTE + 'GetMPowerParams77/' + material + '/' + Units + '/' + KappaLeadAngle + '/' + Flutes + '/' + Feed + '/' + catalogNoList).catch((err: HttpErrorResponse) => {      
      console.error('An error occurred:', err.error);
      return "error";
    });
  }


  public  GetCuttingForcesDrilling(insertType:string,DD:number,d:number,z:number,f:number,n:number,Kc:number,Mc:number,ɣ:number,k:number,edgeGeometry:string)
  {        
    return  this.httpClient.get(environment.CalcReq_Host + 'F-CuttingForces/Drilling/' + insertType + '/' + + DD + '/' + d + '/' + z + '/' + f + '/' + n + '/' + Kc + '/' + Mc + '/' + ɣ + '/' + k + '/' + edgeGeometry).catch((err: HttpErrorResponse) => {      
      console.error('An error occurred:', err.error);
      return "error";
    });
  }
  // public  checkItemImgExists()
  // {        
  //   return  this.httpClient.get(environment.API_HOST + this.API_ROUTE + 'checkItemPicExists' ).catch((err: HttpErrorResponse) => {      
  //     console.error('An error occurred:', err.error);
  //     return "error";
  //   });
  // }

}
