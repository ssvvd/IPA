import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ResultsStoreService {

  constructor() { }

  private secApp:string='';
  private units:string='';
  private inputParams:string='';
  private countryID:number=1;

  public res1:any;
  private res2:any;
  private res3:any;
  // private res4:any;
  private res5:any;
  private res6:any;
 
  //thread turning 800,810
  private mSpindleSpeed:string='';
  private mCuttingSpeed:string='';
  private mInfeedMethod:string ='';
  private mRadialEn:string = '';
  private mController:string='';
  private mNoOfPasses:number=0;
  private mH:number=0;


  private obsRes1 = new BehaviorSubject<any>(null);
  Currentres1 = this.obsRes1.asObservable(); 

  private obsRes2 = new BehaviorSubject<any>(null);
  Currentres2 = this.obsRes2.asObservable(); 

  private obsRes3 = new BehaviorSubject<any>(null);
  Currentres3 = this.obsRes3.asObservable(); 

  // private obsRes4 = new BehaviorSubject<any>(null);
  // Currentres4 = this.obsRes4.asObservable(); 

  private obsRes5 = new BehaviorSubject<any>(null);
  Currentres5 = this.obsRes5.asObservable(); 

  private obsRes6 = new BehaviorSubject<any>(null);
  Currentres6 = this.obsRes6.asObservable(); 


  checkChanged(_secApp:string,_units:string,_inputParams:string, _countryID:number):boolean{

if (this.secApp != _secApp || this.units != _units || this.inputParams != _inputParams  || this.countryID != _countryID){
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

  setResults(_res1:any, _res2:any, _res3:any,_res5:any, _res6:any){
    this.res1 = _res1
    this.res2 = _res2
    this.res3 = _res3
    // this.res4 = _res4
    this.res5 = _res5
    this.res6 = _res6
    this.obsRes1.next(_res1)
    this.obsRes2.next(_res2)
    this.obsRes3.next(_res3)
    // this.obsRes4.next(_res4)
    this.obsRes5.next(_res5)
    this.obsRes6.next(_res6)
  }

  setNewDefaultFieldsProp(_res:any){
    this.res2 = _res
    this.obsRes2.next(_res)
  }

  getRes1():Observable<any> {
    return this.res1
  }

  getRes2():Observable<any>{
    return this.res2
  }

  getRes3():Observable<any>{
    return this.res3
  }

  // getRes4():Observable<any>{
  //   return this.res4
  // }

  getRes5():Observable<any>{
    return this.res5
  }

  getRes6():Observable<any>{
    return this.res6
  }

  get SpindleSpeed():string {
    return this.mSpindleSpeed;
  }
  set SpindleSpeed(s:string) {
    this.mSpindleSpeed = s;
  }

  get CuttingSpeed():string {
    return this.mCuttingSpeed;
  }
  set CuttingSpeed(s:string) {
    this.mCuttingSpeed = s;
  }

  get InfeedMethod():string {
    return this.mInfeedMethod;
  }
  set InfeedMethod(s:string) {
    this.mInfeedMethod = s;
  }

  get RadialEn():string {
    return this.mRadialEn;
  }
  set RadialEn(s:string) {
    this.mRadialEn = s;
  }

  get Controller():string {
    return this.mController;
  }
  set Controller(s:string) {
    this.mController = s;
  }

  get NoOfPasses():number {
    return this.mNoOfPasses;
  }
  set NoOfPasses(s:number) {
    this.mNoOfPasses = s;
  }

  get H():number {
    return this.mH;
  }
  set H(s:number) {
    this.mH = s;
  }
}


