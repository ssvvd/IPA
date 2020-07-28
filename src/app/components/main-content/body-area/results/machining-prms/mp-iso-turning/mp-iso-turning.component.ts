import { Component, OnInit } from '@angular/core';
import { StateManagerService} from 'src/app/services/statemanager.service' ;
import { throws } from 'assert';

@Component({
  selector: 'mp-iso-turning',
  templateUrl: './mp-iso-turning.component.html',
  styleUrls: ['./mp-iso-turning.component.scss']
})
export class MpIsoTurningComponent implements OnInit {


  Di:number
  LP:number
  LR:number
  DPT:number
  Df:number
  LA:number

  constructor(private srv_StMng:StateManagerService) { }

  ngOnInit(): void {
  }

  fillParams(){
    this.reset()

    this.Di = +this.srv_StMng.IPL.GetItem('WorkpieceDiameter').value

    if (this.srv_StMng.SecApp=='890' || this.srv_StMng.SecApp=='860' || this.srv_StMng.SecApp=='850')
      this.LP = +this.srv_StMng.IPL.GetItem('GroovePosition').value
    else if (this.srv_StMng.SecApp=='880')
      this.LP = +this.srv_StMng.IPL.GetItem('GroovePositionRad').value

      if (this.srv_StMng.SecApp=='890' || this.srv_StMng.SecApp=='850' || this.srv_StMng.SecApp=='990'){
      this.LR = +this.srv_StMng.IPL.GetItem('DepthAxial').value
      this.Df = this.Di - (2 * this.LR)//Di - 2*LR
      }
    else if (this.srv_StMng.SecApp=='880'  || this.srv_StMng.SecApp=='980'){
      this.LR = +this.srv_StMng.IPL.GetItem('CutLengthRadial').value
      this.Df = this.Di - (2 * this.LR)//Di - 2*LR
    }
    else if (this.srv_StMng.SecApp=='860'  || this.srv_StMng.SecApp=='960'){
      this.DPT = +this.srv_StMng.IPL.GetItem('DepthAxial').value
      this.Df = this.Di - (2 * this.DPT)//Di - 2*DPT
    }
      
    if (this.srv_StMng.SecApp=='980' || this.srv_StMng.SecApp=='890' || this.srv_StMng.SecApp=='990' || this.srv_StMng.SecApp=='850')
      this.LA = +this.srv_StMng.IPL.GetItem('CutLengthAxial').value
    else if (this.srv_StMng.SecApp=='880')
      this.LA = +this.srv_StMng.IPL.GetItem('DepthRadial').value



  }
  reset(){
    this.Di = 0
    this.LP = 0
    this.LR = 0
    this.DPT = 0
    this.Df = 0
    this.LA = 0

  }

}
