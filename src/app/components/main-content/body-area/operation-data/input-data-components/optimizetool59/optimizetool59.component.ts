import { Component, OnInit ,Input} from '@angular/core';
import { StateManagerService } from 'src/app/services/statemanager.service';
import { AppsettingService} from 'src/app/services/appsetting.service';
import { PpSuccessfullyComponent} from 'src/app/components/maintenance/pp-successfully/pp-successfully.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Options } from 'ng5-slider';
import { Observable ,Subscription} from 'rxjs';

@Component({
  selector: 'app-optimizetool59',
  templateUrl: './optimizetool59.component.html',
  styleUrls: ['./optimizetool59.component.scss']
})
export class Optimizetool59Component implements OnInit {
    
  @Input() events: Observable<void>;
  private eventsSubscription: Subscription;
  public msrv_StMng:StateManagerService =this.srv_StMng;
  public msrv_appsetting:AppsettingService =this.srv_appsetting;
  coolant:string='0';
  isDisabledState:boolean=false;
  constructor(private srv_StMng:StateManagerService,private srv_appsetting:AppsettingService,
              private modalService: NgbModal) { }
  
   options_dc: Options = {
    floor: 0,
    ceil:  Number(this.srv_StMng.IPL.GetItem('TD_DCXMax').valuedefault),
    step: 0.1,
    showTicks: false
  };
  
   options_nof: Options = {
    floor: 0,
    ceil: Number(this.srv_StMng.IPL.GetItem('TD_NOFMax').valuedefault),
    step: 1,
    showTicks: false
  };
  
  options_radius: Options = {
    floor: 0,
    ceil: Number(this.srv_StMng.IPL.GetItem('MaxCornerRadius').valuedefault),
    step: 0.05,
    showTicks: false
  };
  
   options_chamfer: Options = {
    floor: 0,
    ceil: Number(this.srv_StMng.IPL.GetItem('MaxChamferRange').valuedefault),
    step: 0.1,
    showTicks: false
  };
  
  options_rampdown: Options = {
    floor: 0,
    ceil: 90,
    step: 0.5,
    showTicks: false
  };

  ngOnInit() {
     this.eventsSubscription = this.events.subscribe(() => this.ClearData());
     if(this.srv_StMng.GetMaterialSelected().id>20 && this.srv_StMng.GetMaterialSelected().id<38)               
        this.isDisabledState=true;
     else
        this.isDisabledState=false;
      
       // this.setCoolant();
     if(this.srv_StMng.IPL.GetItem('Coolant').value=='2' )
        if((this.srv_StMng.GetMaterialSelected().id>=1 && this.srv_StMng.GetMaterialSelected().id<=20) 
            || (this.srv_StMng.GetMaterialSelected().id>=38 && this.srv_StMng.GetMaterialSelected().id<=41) )
        {
          this.coolant="Dry";
          this.srv_StMng.IPL.GetItem('Coolant').value='0';           
        }
        else
        {
          this.coolant="Wet";
          this.srv_StMng.IPL.GetItem('Coolant').value='1';
        }
    else
      {
         if(this.srv_StMng.IPL.GetItem('Coolant').value=='0') this.coolant ="Dry";
         if(this.srv_StMng.IPL.GetItem('Coolant').value=='1') this.coolant ="Wet";
      } 
     
  }
  
  setCoolant()
  {
    if(this.srv_StMng.IPL.GetItem('Coolant').value=='2' )
      if((this.srv_StMng.GetMaterialSelected().id>=1 && this.srv_StMng.GetMaterialSelected().id<=20) 
          || (this.srv_StMng.GetMaterialSelected().id>=38 && this.srv_StMng.GetMaterialSelected().id<=41) )
      {
        this.coolant="Dry";
        this.srv_StMng.IPL.GetItem('Coolant').value='0';           
      }
      else
      {
        this.coolant="Wet";
        this.srv_StMng.IPL.GetItem('Coolant').value='1';
      }
  else
    {
      if(this.srv_StMng.IPL.GetItem('Coolant').value=='0') this.coolant ="Dry";
      if(this.srv_StMng.IPL.GetItem('Coolant').value=='1') this.coolant ="Wet";
    }
  }

  ngOnDestroy() {
    this.eventsSubscription.unsubscribe();
  }
  
  changeCoolant()
  {
    if(this.coolant=="Wet")  
      {
        if((this.srv_StMng.GetMaterialSelected().id>=1 && this.srv_StMng.GetMaterialSelected().id<=20) 
            || (this.srv_StMng.GetMaterialSelected().id>=38 && this.srv_StMng.GetMaterialSelected().id<=41) )                 
          this.srv_StMng.IPL.GetItem('Coolant').value='1'; 
          const modalRef = this.modalService.open(PpSuccessfullyComponent, { centered: true });
          modalRef.componentInstance.HeaderDescription = "Coolant";
          modalRef.componentInstance.Text = "Applying Wet Coolant is Possible but will Reduce Tool Life by up to 50%"; 
                                  
      };
    if(this.coolant=="Dry") 
    {       
        this.srv_StMng.IPL.GetItem('Coolant').value='0';                       
       
    }
  } 

  ClearData()
  {
    this.srv_StMng.IPL.GetItem('TD_DCXMin').value = this.srv_StMng.IPL.GetItem('TD_DCXMin').valuedefault;
    this.srv_StMng.IPL.GetItem('TD_DCXMax').value = this.srv_StMng.IPL.GetItem('TD_DCXMax').valuedefault;
    this.srv_StMng.IPL.GetItem('TD_DiameterFrom').value = this.srv_StMng.IPL.GetItem('TD_DiameterFrom').valuedefault;
    this.srv_StMng.IPL.GetItem('TD_DiameterTo').value = this.srv_StMng.IPL.GetItem('TD_DiameterTo').valuedefault;

    this.srv_StMng.IPL.GetItem('TD_NOFMin').value = this.srv_StMng.IPL.GetItem('TD_NOFMin').valuedefault;
    this.srv_StMng.IPL.GetItem('TD_NOFMax').value = this.srv_StMng.IPL.GetItem('TD_NOFMax').valuedefault;
    
    this.srv_StMng.IPL.GetItem('MinCornerRadius').value = this.srv_StMng.IPL.GetItem('MinCornerRadius').valuedefault;
    this.srv_StMng.IPL.GetItem('MaxCornerRadius').value = this.srv_StMng.IPL.GetItem('MaxCornerRadius').valuedefault;

    this.srv_StMng.IPL.GetItem('MinChamferRange').value = this.srv_StMng.IPL.GetItem('MinChamferRange').valuedefault;
    this.srv_StMng.IPL.GetItem('MaxChamferRange').value = this.srv_StMng.IPL.GetItem('MaxChamferRange').valuedefault;
    
    this.srv_StMng.IPL.GetItem('Coolant').value='2';
    this.setCoolant();

  }
}
