import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ResultsStoreService {

  constructor() { }

  private secApp:string='';
  private units:string='';
  private inputParams:string='';

  private res1:any;
  private res2:any;
  private res3:any;
  private res4:any;
  private res5:any;
  private res6:any;

  checkChanged(_secApp:string,_units:string,_inputParams:string):boolean{

if (this.secApp != _secApp || this.units != _units || this.inputParams != _inputParams){
  return true;
}
else{
  return false;
}


  }
  
  setParams(_secApp:string,_units:string,_inputParams:string){
    this.secApp = _secApp 
    this.units = _units 
    this.inputParams = _inputParams
  }

  setResults(_res1:any, _res2:any, _res3:any, _res4:any,_res5:any, _res6:any){
    this.res1 = _res1
    this.res2 = _res2
    this.res3 = _res3
    this.res4 = _res4
    this.res5 = _res5
    this.res6 = _res6
  }

  getRes1(){
    return this.res1
  }

  getRes2(){
    return this.res2
  }

  getRes3(){
    return this.res3
  }

  getRes4(){
    return this.res4
  }

  getRes5(){
    return this.res5
  }

  getRes6(){
    return this.res6
  }

}


