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

  public  getfzminf(catNo:string,secApp:string)
  {        
    return  this.httpClient.get(environment.API_HOST + this.API_ROUTE + 'GetFzMin_F/' + catNo + '/' + secApp).catch((err: HttpErrorResponse) => {      
      console.error('An error occurred:', err.error);
      return "error";
    });
  }

  public  GetRatioLD(catNo:string, units:string)
  {        
    return  this.httpClient.get(environment.API_HOST + this.API_ROUTE + 'GetRatioLD/' + catNo + '/' + units).catch((err: HttpErrorResponse) => {      
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

  public  GetPromotionFamilies(countryID:number)
  {        
    return  this.httpClient.get(environment.API_HOST + this.API_ROUTE + 'GetPromotionFamilies/' + countryID ).catch((err: HttpErrorResponse) => {     
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

  public  GetMPowerParamsTurning(Material:number,  Units:string,  Feed:number,  catalogNoList:String)
  {        
    return  this.httpClient.get(environment.API_HOST + this.API_ROUTE + 'GetMPowerParamsTurning/' + Material + '/' + Units +  '/' + Feed + '/' + catalogNoList).catch((err: HttpErrorResponse) => {      
      console.error('An error occurred:', err.error);
      return "error";
    });
  }

  public  GetMPowerParamsGrooving(Material:number,  Units:string,  Feed:number,  FeedG:number,  catalogNoList:String)
  {        
    return  this.httpClient.get(environment.API_HOST + this.API_ROUTE + 'GetMPowerParamsGrooving/' + Material + '/' + Units +  '/' + Feed +  '/' + FeedG + '/' + catalogNoList).catch((err: HttpErrorResponse) => {      
      console.error('An error occurred:', err.error);
      return "error";
    });
  }

  public  GetMPowerParams760(material:number,  Units:string,  KappaLeadAngle:number,  toolD:number,  ae:number,  Feed:number,  catalogNoList:String,  fNoList:String)
  {        
    return  this.httpClient.get(environment.API_HOST + this.API_ROUTE + 'GetMPowerParams760/' + material + '/' + Units + '/' + KappaLeadAngle + '/' + toolD + '/' + ae + '/' + Feed + '/' + catalogNoList + '/' + fNoList).catch((err: HttpErrorResponse) => {      
      console.error('An error occurred:', err.error);
      return "error";
    });
  }

  public  GetFlatDataField(field:string, item:string, secApp:string, units:string )
  {        
    return  this.httpClient.get(environment.API_HOST + this.API_ROUTE + 'GetFlatDataField/' + field + '/' + item + '/' + secApp + '/' + units ).catch((err: HttpErrorResponse) => {      
      console.error('An error occurred:', err.error);
      return "error";
    });
  }

  public  GetCuttingForcesDrilling(insertType:string,DD:number,d:number,z:number,f:number,n:number,Kc:number,Mc:number,ɣ:number,k:number,edgeGeometry:string)
  {        
    return  this.httpClient.get(environment.CalcReq_Host + 'F-CuttingForces/Drilling/' + insertType + '/' +  DD + '/' + d + '/' + z + '/' + f + '/' + n + '/' + Kc + '/' + Mc + '/' + ɣ + '/' + k + '/' + edgeGeometry).catch((err: HttpErrorResponse) => {      
      console.error('An error occurred:', err.error);
      return "error";
    });
  }

  //GET api/CalcReq/F-CuttingForces/Milling/Shouldering/Extflutemillingcutter/{DD}/{ae}/{z}/{fz}/{ap}/{Kc}/{Mc}/{rake}/{w}/{delta}/{alpha}
  //GET api/CalcReq/F-CuttingForces/Milling/Shouldering/FastFeedInsertType   /{DD}/{ae}/{z}/{fz}/{ap}/{Kc}/{Mc}/{rake}/{k}
  //GET api/CalcReq/F-CuttingForces/Milling/Shouldering/StraightEdge         /{DD}/{ae}/{z}/{fz}/{ap}/{Kc}/{Mc}/{rake}/{k}
  //GET api/CalcReq/F-CuttingForces/Milling/Shouldering/Solidcarbidecutter   /{DD}/{ae}/{z}/{fz}/{ap}/{Kc}/{Mc}/{rake}/{alpha}
  public  GetCuttingForcesMilling(subApp:string,insertType:string,DD:number,ae:number,z:number,fz:number,ap:number,Kc:number,Mc:number,rake:number,k:string,delta:string,alpha:string)
  {        
    return  this.httpClient.get(environment.CalcReq_Host + 'F-CuttingForces/Milling/'  + subApp + '/' + insertType + '/' +  DD + '/' + ae + '/' + z + '/' + fz + '/' + ap + '/' + Kc + '/' + Mc + '/' + rake + '/' + k + '/' + delta + '/' + alpha).catch((err: HttpErrorResponse) => {      
      console.error('An error occurred:', err.error);
      return "error";
    });
  }

  //CalcReq/F-CuttingForces/Turning/StraightEdge/{ap}/{f}/{Kc}/{Mc}/{rake}/{k}
  public  GetCuttingForcesTurning(ap:number,fr:number,Kc:number,Mc:number,rake:number,k:number)
  {        
    return  this.httpClient.get(environment.CalcReq_Host + 'F-CuttingForces/Turning/StraightEdge/'  +  ap + '/' + fr + '/' + Kc + '/' + Mc + '/' + rake + '/' + k ).catch((err: HttpErrorResponse) => {      
      console.error('An error occurred:', err.error);
      return "error";
    });
  }


  //GET api/CalcReq/F-CuttingForces/Grooving/StraightEdge/{w}/{f}/{Kc}/{Mc}/{rake}/{k}
  public  GetCuttingForcesGrooving(w:number,f:number,Kc:number,Mc:number,rake:number,k:number)
  {        
    return  this.httpClient.get(environment.CalcReq_Host + 'F-CuttingForces/Grooving/StraightEdge/'  +  w + '/' + f + '/' + Kc + '/' + Mc + '/' + rake + '/' + k ).catch((err: HttpErrorResponse) => {      
      console.error('An error occurred:', err.error);
      return "error";
    });
  }

//GET api/CalcReq/H-ChipThickness/Milling/Shouldering/StraightEdge         /{D}/{ae}/{fz}/{k}
//GET api/CalcReq/H-ChipThickness/Milling/Shouldering/FastFeedInsertType             /{D}/{ae}/{fz}/{ap}/{k}
//GET api/CalcReq/H-ChipThickness/Milling/Shouldering/ExtFluteMillingCutter/{D}/{ae}/{fz}/{ap}
//GET api/CalcReq/H-ChipThickness/Milling/Shouldering/SolidCarbidecutter   /{D}/{ae}/{fz}/{ap}
  public  GetChipThicknessMilling(subApp:string,insertType:string,D:number,ae:number,fz:number,ap:string,k:string)
  {        
    return  this.httpClient.get(environment.CalcReq_Host + 'H-ChipThickness/Milling/'  + subApp + '/' + insertType + '/' +  D + '/' + ae + '/' + fz + '/' + ap + '/' + k).catch((err: HttpErrorResponse) => {      
      console.error('An error occurred:', err.error);
      return "error";
    });
  }

  public  GetAvailabilityByCatalogNos(catalogs:string)
  {        
    return  this.httpClient.get(environment.API_HOST + this.API_ROUTE  + 'GetAvailabilityByCatalogNos/' +catalogs).catch((err: HttpErrorResponse) => {      
      console.error('An error occurred:', err.error);
      return "error";
    });
  }

  //api/CalcReq/Power/Torque/Turning/StraightEdge/{DD}/{ap}/{f}/{vc}/{Kc}/{Mc}/{rake}/{k}
  public  GetTorqueTurning(DD:number,ap:number,f:number,vc:number,kc:number,mc:number,rake:number,k:number)
  {        
    return  this.httpClient.get(environment.CalcReq_Host + 'Power/Torque/Turning/StraightEdge/'  + DD + '/' + ap + '/' + f + '/' +  vc + '/' + kc + '/' + mc + '/' + rake + '/' + k).catch((err: HttpErrorResponse) => {      
      console.error('An error occurred:', err.error);
      return "error";
    });
  }

  //GET api/CalcReq/Power/Torque/GroovingPartingOff/StraightEdge/{DD}/{w}/{f}/{vc}/{Kc}/{Mc}/{rake}/{k}
  public  GetTorqueGrooving(DD:number,w:number,f:number,vc:number,kc:number,mc:number,rake:number,k:number)
  {        
    return  this.httpClient.get(environment.CalcReq_Host + 'Power/Torque/GroovingPartingOff/StraightEdge/'  + DD + '/' + w + '/' + f + '/' +  vc + '/' + kc + '/' + mc + '/' + rake + '/' + k).catch((err: HttpErrorResponse) => {      
      console.error('An error occurred:', err.error);
      return "error";
    });
  }

  public  getiteminfoparamvalues(catalogno:string,units:string, lang:string)
  {     
    return  this.httpClient.get(environment.API_HOST + this.API_ROUTE + 'get-item-info-param-values/'+catalogno + '/' +units + '/' +lang );
  }
  public  getiteminfoparamheader(lang:string,family:string,units:string)
  {     
    return  this.httpClient.get(environment.API_HOST + this.API_ROUTE + 'get-item-info-param-header/'+lang + '/' +family + '/' +units  );
  }  
  
  public  getfamilydata(family:string,units:string,lang:string)
  {     
    return  this.httpClient.get(environment.API_HOST + this.API_ROUTE + 'get-family-data/'+family + '/' +units + '/' +lang  );
  }
  
  public  getbrandnamebyfamily(family:string)
  {     
    return  this.httpClient.get(environment.API_HOST + this.API_ROUTE + 'get-brandname-byfamily/'+family );
  }


  public  checkItemImgExists(item:string)
  {        
    return  this.httpClient.get(environment.API_HOST + this.API_ROUTE + 'checkItemPicExists/' + item ).catch((err: HttpErrorResponse) => {      
      console.error('An error occurred:', err.error);
      return "error";
    });
  }
/*   
  public  gettoolliferesults(units:string,SecApp:string,grade:string,material:string,itemtype:string,cuttingspeed:string,diameter:number=0)
  {        
    //{units}/{SecApp}/{grade}/{material}/{itemtype}/{cuttingspeed}/{diameter?}
    return  this.httpClient.get(environment.API_HOST + this.API_ROUTE + 'get-toollife-results/' + units + '/' + SecApp + 
    '/' + grade + '/' + material + '/' + itemtype + '/' + cuttingspeed + '/' + diameter).catch((err: HttpErrorResponse) => {      
      console.error('An error occurred:', err.error);
      return "error";
    });
  } */

   public gettoolliferesults(units:string, SecApp:string, grade:string, material:string, itemtype:string, cuttingspeed:string,mainapp:string, diameter:number){

    return  this.httpClient.get(environment.API_HOST + this.API_ROUTE + 'get-toollife-results/' + units + '/' + SecApp + '/' + grade + '/' + material + '/' + itemtype + '/' + cuttingspeed + '/' + mainapp + '/'+ diameter).catch((err: HttpErrorResponse) => {      
      console.error('An error occurred:', err.error);
      return "error";
    });
  } 

  public getAssemblyURL(itemsList:string,lang:string){
    return  this.httpClient.get(environment.wsMaterials + 'GetAssemblyURL?itemsList=' + itemsList + '&src=ITA&lang=' + lang, {responseType: 'text'}).catch((err: HttpErrorResponse) => {      
      console.error('An error occurred:', err.error);
      return "error";
    });
  }

  }





