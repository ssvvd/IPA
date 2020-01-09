import { Component,Input, ElementRef, ChangeDetectorRef, DoCheck, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Options, ChangeContext } from 'ng5-slider';
import { HardnessLimit } from 'src/app/models/materials/hardness-limit';
import { HardnessConversion } from 'src/app/models/materials/hardness-conversion';
import { MaterialService } from 'src/app/services/material.service';

@Component({
  selector: 'app-pp-edit-params',
  templateUrl: './pp-edit-params.component.html',
  styleUrls: ['./pp-edit-params.component.scss']
})
export class PpEditParamsComponent implements OnInit, DoCheck{

  @Input() modal_mat_id;
  @Input() modal_hardness;
  @Input() modal_group;
  curRadioChecked: string = 'HB';
  value: number;
  minValue: number;
  maxValue: number;
  finishOnInit:boolean = false;
  leftPosition: string ;
  options: Options = {
    floor: 1,
    ceil: 1000,
    hideLimitLabels:true,
    showSelectionBar: true
  };
  hardnessLimit:HardnessLimit;
  hardnessConv:HardnessConversion[]



  constructor(public activeModal: NgbActiveModal, private elem: ElementRef,private cdr: ChangeDetectorRef,private serv: MaterialService) { 
    setInterval(() => {
      this.cdr.detectChanges()
    }, 1);
  }

     ngOnInit() {

      this.value = this.modal_hardness;

      this.serv.getmaterialhardness().subscribe((res:any)=>{
        this.hardnessConv=JSON.parse(res);
      })
      this.serv.getmaterialimits(this.modal_mat_id).subscribe((res:any)=>{
        this.hardnessLimit=JSON.parse(res)[0];
        const newOptions: Options = Object.assign({}, this.options);
        newOptions.floor = this.hardnessLimit.min0;
        newOptions.ceil = this.hardnessLimit.max0;
        this.options = newOptions;
        this.finishOnInit = true;
      })


    }

  ngDoCheck(): void {
    if (this.finishOnInit){
      let leftPositionSlider =  window.getComputedStyle(this.elem.nativeElement.querySelectorAll('.ng5-slider-pointer-min').item(0)).getPropertyValue('left');
      // console.log(leftPositionSlider);
      this.leftPosition = leftPositionSlider.replace('px','');
    }
      //  this.cdr.detectChanges();
    }



  onUserChange(changeContext: ChangeContext): void {
      // check show message
  }

  onRadioButtonClick(type:string){
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

    this.value = this.findHardness(this.curRadioChecked,this.value,type);
    this.curRadioChecked = type;
  
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


  onSearchChange(searchValue: string): void {  
    console.log(searchValue);
  }
}
