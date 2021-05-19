import { Component,Input, ElementRef, ChangeDetectorRef, DoCheck, OnInit, Output } from '@angular/core';
import { Options, ChangeContext } from 'ng5-slider';
import { HardnessLimit } from 'src/app/models/materials/hardness-limit';
import { HardnessConversion } from 'src/app/models/materials/hardness-conversion';
import { MaterialService } from 'src/app/services/material.service';
import { Subject } from 'rxjs';
import {debounceTime, distinctUntilChanged} from "rxjs/internal/operators";

@Component({
  selector: 'app-hardness-slider',
  templateUrl: './hardness-slider.component.html',
  styleUrls: ['./hardness-slider.component.scss']
})
export class HardnessSliderComponent implements OnInit, DoCheck {

  modal_mat_id:number;
  modal_hardness:number;
  origin_hardness:number;
  dangMsg:string = '';
  curRadioChecked: string ;
  radioList:string[] = ['HB','HV','HRC','N/mm2'];
  value: number;
  valueChanged: Subject<number> = new Subject<number>();
  minValue: number;
  maxValue: number;
  finishOnInit:boolean = false;
  leftPosition: number ;
  options: Options = {
    floor: 1,
    ceil: 1000,
    hideLimitLabels:true,
    showSelectionBar: true
  };
  hardnessLimit:HardnessLimit;
  hardnessConv:HardnessConversion[]

  constructor(private elem: ElementRef,private cdr: ChangeDetectorRef,private serv: MaterialService) { 

    this.valueChanged
   .pipe(debounceTime(300),distinctUntilChanged())
   .subscribe(model => {
    
       // api call

      //    else
      if (model || model == 0){
        this.value = +model; 
          let b:number = this.value;
  
          if (+model < this.options.floor)
            b = this.options.floor
         else if (+model> this.options.ceil)
            b = this.options.ceil 
  
          this.onSearchChange(b);
      }
      else{
        this.dangMsg = '    ';
      }


   });

    setInterval(() => {
      if (!this.cdr['destroyed']) {
        this.cdr.detectChanges()
    }
     
    }, 1);
  }

  setInetialParameters(id:number,hardness:number,origHardness:number,units:string){
    this.modal_mat_id = id;
    this.modal_hardness = hardness;
    this.origin_hardness = origHardness;
    this.curRadioChecked = units;
   }

  onSearchChange(v:number): void {  
    // if (v.toString().length > 1)
    //   this.value = v;
    console.log(v);
     this.valueChanged.next(v);
    
  }

     ngOnInit() {

      // this.curRadioChecked = 'HB';
      this.value = this.modal_hardness;

      this.serv.getmaterialhardness().subscribe((res:any)=>{
        this.hardnessConv=JSON.parse(res);
      })

        this.serv.getmaterialimits(this.modal_mat_id).subscribe((res:any)=>{
          this.hardnessLimit=JSON.parse(res)[0];
          // const newOptions: Options = Object.assign({}, this.options);
          // newOptions.floor = this.hardnessLimit.min0;
          // newOptions.ceil = this.hardnessLimit.max0;
          // this.options = newOptions;
          this.findLimits(this.curRadioChecked);
          this.finishOnInit = true;
        })

    }

  ngDoCheck(): void {
    if (this.finishOnInit){
      let leftPositionSlider =  window.getComputedStyle(this.elem.nativeElement.querySelectorAll('.ng5-slider-pointer-min').item(0)).getPropertyValue('left');
      // console.log(leftPositionSlider);
      this.leftPosition = +leftPositionSlider.replace('px','') - 22;
    }
      //  this.cdr.detectChanges();
    }



    onUserChangeEnd(changeContext: ChangeContext): void {
      console.log('onUserChangeEnd');
      let curHBValue: number = this.value;
      let msg: string = 'At this hardness level, please change to material group ';
      if (this.curRadioChecked != 'HB'){
        curHBValue = this.findHardness(this.curRadioChecked,this.value,'HB')
      }
      if(this.hardnessLimit!=null)
      {
        if (curHBValue >= this.hardnessLimit.min1 && curHBValue <= this.hardnessLimit.max1)
        this.dangMsg = msg + this.hardnessLimit.grp1
      else if (curHBValue >= this.hardnessLimit.min2 && curHBValue <= this.hardnessLimit.max2)
        this.dangMsg = msg + this.hardnessLimit.grp2
      else if (curHBValue >= this.hardnessLimit.min3 && curHBValue <= this.hardnessLimit.max3)
        this.dangMsg = msg + this.hardnessLimit.grp3
      else if (curHBValue >= this.hardnessLimit.min4 && curHBValue <= this.hardnessLimit.max4)
        this.dangMsg = msg + this.hardnessLimit.grp4
      else
        this.dangMsg = '';
      }
      /* if (curHBValue >= this.hardnessLimit.min1 && curHBValue <= this.hardnessLimit.max1)
        this.dangMsg = msg + this.hardnessLimit.grp1
      else if (curHBValue >= this.hardnessLimit.min2 && curHBValue <= this.hardnessLimit.max2)
        this.dangMsg = msg + this.hardnessLimit.grp2
      else if (curHBValue >= this.hardnessLimit.min3 && curHBValue <= this.hardnessLimit.max3)
        this.dangMsg = msg + this.hardnessLimit.grp3
      else if (curHBValue >= this.hardnessLimit.min4 && curHBValue <= this.hardnessLimit.max4)
        this.dangMsg = msg + this.hardnessLimit.grp4
      else
        this.dangMsg = ''; */


  }

  onRadioButtonClick(type:string){

    this.findLimits(type);
    this.value = this.findHardness(this.curRadioChecked,this.value,type);
    this.curRadioChecked = type;
  
  }

  findLimits(type:string){
    let min: number;
    let max: number;

    if (type == 'HB'){
      min = this.hardnessLimit.min0;
      max = this.hardnessLimit.max0;
    }
    else{
      min = Math.min.apply(Math, this.hardnessConv.map(function(o) { return o[type]; }).filter(function(val) { return val !== null }))
      max = Math.max.apply(Math, this.hardnessConv.map(function(o) { return o[type]; }).filter(function(val) { return val !== null }))
    }

    const newOptions: Options = Object.assign({}, this.options);
    newOptions.floor = min;
    newOptions.ceil = max;
    this.options = newOptions;
  }
  findHardness(prevType:string,prevValue:number,curType:string):number{
    let newValue: number;
    let hc:HardnessConversion;
    let hcMin:HardnessConversion;
    let hcMax:HardnessConversion;

    hc = this.hardnessConv.find( hc => hc[prevType] === prevValue)

    if (hc){
      newValue = hc[curType];
    }

    if (hc == null || newValue == null){
      hcMin = this.hardnessConv.filter(elm => (elm[curType] !== null && elm[prevType] !== null)).reduce(function(res, obj) { return (obj[curType] < res[curType]) ? obj : res; });
      hcMax = this.hardnessConv.filter(elm => (elm[curType] !== null && elm[prevType] !== null)).reduce(function(res, obj) { return (obj[curType] > res[curType]) ? obj : res; });
          if (prevValue <= hcMin[prevType])
            newValue = hcMin[curType];
          else if (prevValue >= hcMax[prevType])
            newValue = hcMax[curType];
          else{
              let nearestLowest = this.hardnessConv.reduce((prev, current) => {
              return (Math.abs(current[prevType] - prevValue) < Math.abs(prev[prevType] - prevValue) && current[prevType] < prevValue ? current : prev);
            })
              let nearestUpper = this.hardnessConv.reduce((prev, current) => {
              return (Math.abs(current[prevType] - prevValue) < Math.abs(prev[prevType] - prevValue) && current[prevType] > prevValue ? current : prev);
            })

            newValue = Math.round(nearestUpper[curType] - (nearestUpper[prevType] - prevValue ) * (nearestUpper[curType] - nearestLowest[curType]) / (nearestUpper[prevType] - nearestLowest[prevType]))
              //res = Math.round (HB[i] - (HRC[i] - valueHRC) * (HB[i] - HB[i - 1]) / (HRC[i] - HRC[i - 1]));



          }
  }

  return newValue;
  }




  reset(){
    this.curRadioChecked = 'HB';
    this.findLimits(this.curRadioChecked);
    this.value = this.origin_hardness;
    this.dangMsg = '';
  }

  getCurValue(){
    let curHBValue: number = 0;
    let result:string = "";
    if (this.dangMsg == ''){
       curHBValue = this.value;
       result = curHBValue + "," + this.curRadioChecked
      if (this.curRadioChecked != 'HB'){
        curHBValue = this.findHardness(this.curRadioChecked,this.value,'HB')
        result = result + "," + curHBValue;
      }
    }

    return result;
  }



}

