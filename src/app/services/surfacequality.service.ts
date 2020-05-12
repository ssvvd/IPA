import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SurfacequalityService {
  
     N:number[];
     Rt:number[] ;
     Ra:number[] ;
     RMS:number[];    
    
  constructor() { 
    
  }

  public FillData(units:string)
  {
      this.N=[];
      this.Rt=[];
      this.Ra=[];
      this.RMS=[];

   if (units == 'M') {
        this.Rt[0] = 0.3;
        this.Rt[1] = 0.5;
        this.Rt[2] = 0.8;
        this.Rt[3] = 1.2;
        this.Rt[4] = 2;
        this.Rt[5] = 4;
        this.Rt[6] = 8;
        this.Rt[7] = 13;
        this.Rt[8] = 25;
        this.Rt[9] = 50;
        this.Rt[10] = 100;
        this.Rt[11] = 200;

        this.Ra[0] = 0.025;
        this.Ra[1] = 0.05;
        this.Ra[2] = 0.1;
        this.Ra[3] = 0.2;
        this.Ra[4] = 0.4;
        this.Ra[5] = 0.8;
        this.Ra[6] = 1.575;
        this.Ra[7] = 3.125;
        this.Ra[8] = 6.25;
        this.Ra[9] = 12.5;
        this.Ra[10] = 25;
        this.Ra[11] = 50;

        this.RMS[0] = 0.0275;
        this.RMS[1] = 0.055;
        this.RMS[2] = 0.11;
        this.RMS[3] = 0.22;
        this.RMS[4] = 0.44;
        this.RMS[5] = 0.88;
        this.RMS[6] = 1.7325;
        this.RMS[7] = 3.4375;
        this.RMS[8] = 6.875;
        this.RMS[9] = 13.75;
        this.RMS[10] = 27.5;
        this.RMS[11] = 55;
    }
    else {
        this.Rt[0]=12;
        this.Rt[1]=20;
        this.Rt[2]=32;
        this.Rt[3]=48;
        this.Rt[4]=80;
        this.Rt[5]=160;
        this.Rt[6]=320;
        this.Rt[7]=520;
        this.Rt[8]=1000;
        this.Rt[9]=2000;
        this.Rt[10]=4000;
        this.Rt[11]=8000;

        this.Ra[0]=1;
        this.Ra[1]=2;
        this.Ra[2]=4;
        this.Ra[3]=8;
        this.Ra[4]=16;
        this.Ra[5]=32;
        this.Ra[6]=63;
        this.Ra[7]=125;
        this.Ra[8]=250;
        this.Ra[9]=500;
        this.Ra[10]=1000;
        this.Ra[11]=2000;

        this.RMS[0]=1.1;
        this.RMS[1]=2.2;
        this.RMS[2]=4.4;
        this.RMS[3]=8.8;
        this.RMS[4]=17.6;
        this.RMS[5]=35.2;
        this.RMS[6]=69.3;
        this.RMS[7]=137.5;
        this.RMS[8]=275;
        this.RMS[9]=550;
        this.RMS[10]=1100;
        this.RMS[11]=2200;
    }
  }
  GetNMinMax(a:number) :number {        
        //if (Number(a)==NaN) return 0;
        if ( a == null || a > 12 || a < 0)
            return 0;        
        return a;
    }


 GetRtByN(Nc:number):number {     
      if (Nc == 0) return 0;
      return this.Rt[Nc - 1];
  }
GetRaByN(Nc:number) {
      if (Nc == 0) return 0;
      return  this.Ra[Nc - 1];
  }
GetRMSByN(Nc) {
      if (Nc == 0) return 0;
      return  this.RMS[Nc - 1];
  } 
GetRMSMinMax(a) {
      if (isNaN(a) || a == "undefined" || a == 0)
          return 0;
      if (a <  this.RMS[0]) a =  this.RMS[0];
      if (a >  this.RMS[11]) a =  this.RMS[11];
      return a;
  }

   GetRtMinMax(a) {

      if (isNaN(a) || a == "undefined" || a == 0)
          return 0;
      if (a <  this.Rt[0]) a =  this.Rt[0];
      if (a >  this.Rt[11]) a =  this.Rt[11];
      return a;
  }

   GetRaMinMax(a) {
      if (isNaN(a) || a == "undefined" || a == 0)
          return 0;
      if (a <  this.Ra[0]) a =  this.Ra[0];
      if (a >  this.Ra[11]) a =  this.Ra[11];
      return a;
  }

   GetRMS(Ra) {
      if (Ra == 0) return 0;
      return Math.round(Ra * 1.1*100)/100;
  }

  GetRaByRMS(RMS) {
      if (RMS == 0) return 0;
      return Math.round(RMS / 1.1 *100)/100;
  }

   GetRa(Rtc) {
      
      if (Rtc == 0) return 0;
      var nn = 0;
      var res;
      if (Rtc ==  this.Rt[0]) nn = 0;
      if ( this.Rt[0] < Rtc && Rtc <  this.Rt[1]) nn = 1;

      for (let i:number = 1 ; i < 11; i++) {
          if ( this.Rt[i] <= Rtc && Rtc <  this.Rt[i + 1])
              nn = i;
      }
      if (Rtc == this.Rt[11]) nn = 11;

      if (nn == 11)
          res = this.Ra[11]
      else
          res =  Math.round(((Rtc - this.Rt[nn]) * (this.Ra[nn + 1] - this.Ra[nn]) / (this.Rt[nn + 1] - this.Rt[nn]) + this.Ra[nn])*100)/100;

      return res;
  }

   GetRt(Rac) {
      if (Rac == 0) return 0;
      var nn = 0;
      var res;
      if (Rac == this.Ra[0]) nn = 0;
      if (this.Ra[0] < Rac && Rac < this.Ra[1]) nn = 1;

      for (let i:number = 1 ; i < 11; i++) {
          if (this.Ra[i] <= Rac && Rac < this.Ra[i + 1])
              nn = i;
      }
      if (Rac == this.Ra[11]) nn = 11;

      if (nn == 11)
          res = this.Rt[11]
      else
          res = Math.round((Rac - this.Ra[nn]) * (this.Rt[nn + 1] - this.Rt[nn]) / (this.Ra[nn + 1] - this.Ra[nn]) + this.Rt[nn]*100)/100;
      return res;
  }

   GetN(Rtc) {
      if (Rtc == 0) return 0;
      var nn = 0;

      if (Rtc == this.Rt[0]) return 1;
      if (this.Rt[0] < Rtc && Rtc <= this.Rt[1]) return 2;

      for (let i:number = 1 ; i < 11; i++) {
          if (this.Rt[i] < Rtc && Rtc <= this.Rt[i + 1])
              nn = i + 2;
      }
      if (Rtc == this.Rt[11]) nn = 12;
      return nn;
  }
}
