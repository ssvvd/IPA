
export class MachineFilter{
  IsMachiningCenter:boolean=true;
  IsLathe:boolean=true;
  IsMultiTask:boolean=true;
  IsMultiSpindle:boolean=true;
  IsSwissType:boolean=true;
  SpeedMin:number;
  SpeedMax:number;
  PowerMin:number;
  PowerMax:number;
  TorqueMin:number;
  TorqueMax:number;  
  SearchText:string="";
  IsMachineTypeStandard:boolean;
  IsMachineTypeHeavyDuty:boolean;
  IsMachineTypeHighSpeed:boolean;
  AdaptationType:string;
  AdaptationSize:string;
  IsMostRecommended:boolean;
  ShowOnlyFavorites:boolean;
  IsSliderPower:boolean;
  IsSliderSpeed:boolean;
  IsSliderTorque:boolean;

  constructor() { 
    this.IsMachiningCenter=true;
    this.IsLathe=true;
    this.IsMultiTask=true;
    this.IsMultiSpindle=true;
    this.IsSwissType=true;
  }
}
 

