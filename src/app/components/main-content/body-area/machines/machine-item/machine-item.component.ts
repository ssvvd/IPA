import { Component, OnInit, Input} from '@angular/core';
import { MachineService } from '../../../../../services/machine.service' ;
import { StateManagerService} from '../../../../../services/statemanager.service' ;
import { AppsettingService} from '../../../../../services/appsetting.service';
import { Machineheader } from '../../../../../models/machines/machineheader';
import { Machinespindle } from '../../../../../models/machines/machinespindle';
import { MachinePpAddFavoriteComponent} from '../machine-pp-add-favorite/machine-pp-add-favorite.component';
import { PpSuccessfullyComponent} from '../../../../maintenance/pp-successfully/pp-successfully.component';
import {MachinesPpLoginComponent} from      '../machines-pp-login/machines-pp-login.component';
import { LoginService } from '../../../../../services/login.service';
import { ActivatedRoute} from '@angular/router';
import { environment } from 'src/environments/environment';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from "ngx-spinner"; 
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-machineitem',
  templateUrl: './machine-item.component.html',
  styleUrls: ['./machine-item.component.scss']
})
export class MachineItemComponent implements OnInit {
 
  MachineID: number; 
  MachineName:string;
  machSpindleMain: Machinespindle;
  machSpindleTool: Machinespindle;
  arrMachineSpindle: Machinespindle[];
  machHeader:Machineheader;
  imgNameMachine:string; 
  environment = environment;  
  isLoading:boolean =false;
  lstCurrency:string[]=[];
  CostPerHour:number;
  @Input() pr_MachineID:number=0;
  @Input() pr_MachineName:string='';
  @Input() exportPDF:boolean=false;
  
  private eventsSubscription: Subscription=new Subscription();

  constructor(private srv_machine: MachineService, public srv_appsetting:AppsettingService,private SpinnerService: NgxSpinnerService,
              private activerouter: ActivatedRoute ,private router:Router,private srv_login:LoginService, public srv_statemanage:StateManagerService,private modalService: NgbModal) 
  {           
    this.eventsSubscription.add(this.activerouter.params.subscribe(params => {
    this.MachineID = parseInt(params["id"]);
    this.MachineName= params["name"];
    }));
  }
  public innerheight: any;

 /*  @HostListener('window:resize', ['$event'])
  onResize(event) {  
      this.innerheight = window.innerHeight-400;
     
  } */

  ngOnDestroy() {
    this.OnSelectMachine();
    this.eventsSubscription.unsubscribe();
  }

  FillListCurrency()
  {
    this.eventsSubscription.add(this.srv_appsetting.getexchangerate('').subscribe((res: any) => 
    {
     for (const d of JSON.parse(res)) 
     { 
       this.lstCurrency.push (d.CurrName);
     }
    }));
  }
  ngOnInit()
   {  
    this.eventsSubscription.add(this.srv_appsetting.RateChange.subscribe(res=>(this.ChangeRate(res))));
    this.FillMachineData();
  }
  
  ChangeRate(prev_rate:number)
  {
    if(this.machHeader!==undefined)
    {
      this.machHeader.Currency=this.srv_appsetting.Currency;            
      this.CostPerHour =  Math.round( this.CostPerHour* (Math.round(prev_rate*1000)/1000)/(Math.round(this.srv_appsetting.CurrRate*1000)/1000)*100)/100;      
    }    
  }

  FillMachineData()
  {
    if(this.pr_MachineID!=0)      this.MachineID=this.pr_MachineID;
    if(this.pr_MachineName!='')   this.MachineName=this.pr_MachineName;                                 
    if(this.srv_statemanage.SelectedMachine!=null && this.srv_statemanage.SelectedMachine.MachineID==this.MachineID)
    {
      this.machHeader=this.srv_statemanage.SelectedMachine;
      if(this.srv_statemanage.arrMachineSpindle!=null)      
        {    
          this.arrMachineSpindle =this.srv_statemanage.arrMachineSpindle;
          this.FillImageMachineType(); 
         
          this.isLoading =true;         
        }
      else
          this.eventsSubscription.add(this.srv_machine.getmachinedetailed(this.MachineID,this.srv_appsetting.Units).subscribe((res: any) => {
          this.arrMachineSpindle = JSON.parse(res);                   
          this.machSpindleMain = this.arrMachineSpindle[0]; 
          this.machHeader.SpindleSpeed = this.arrMachineSpindle[0].SpindleSpeed;
          this.machHeader.Torque = this.arrMachineSpindle[0].Torque;
          this.FillImageMachineType();
         
          
          this.isLoading =true;          
        }));
        this.CostPerHour = Math.round(this.machHeader.CostPerHour / ( Math.round(this.srv_appsetting.CurrRate*1000)/1000)*100)/100;            
    }         
    if(this.machHeader==null)
    {
        this.FillMachineDataFromServer(this.MachineID); 
    } 
    this.innerheight = window.innerHeight-200;
  }
  ChangeMachineCost()
  {
    //cast from local currency to USD
     this.machHeader.CostPerHour = Math.round(this.CostPerHour* ( Math.round(this.srv_appsetting.CurrRate*1000)/1000)*100)/100;
  }

  OnSaveMachine()
  {
    let s:string;
    s=JSON.stringify(this.arrMachineSpindle);
    //{MachineID}/{MachineType}/{MachineName}/{Units}/{MachineType1}/{CostPerHour}/{Currency}"
    this.eventsSubscription.add(this.srv_machine.machine_update(
       this.MachineID,this.machHeader.MachineType,
       this.machHeader.MachineName, this.srv_appsetting.Units,
       this.machHeader.MachineType1,this.machHeader.CostPerHour,this.machHeader.Currency,s).subscribe((res: any) => {
                
      const modalRef = this.modalService.open(PpSuccessfullyComponent, { backdrop:'static',centered: true });
      modalRef.componentInstance.HeaderDescription = "My Machines";
      modalRef.componentInstance.Text = "My Machines has been successfully saved";
    }));               
  }

  OnFavoriteMachine1(mach: Machineheader)
  { 
    //this.statusclick=1;
    if(this.srv_appsetting.UserID=='')
    {    
      const modalRef = this.modalService.open(MachinesPpLoginComponent, { backdrop:'static', centered: true });
      modalRef.componentInstance.title = "Add To My Machines";
      modalRef.componentInstance.Msg = 'Please login to add the machine to My Machines';
      modalRef.result.then((result) => {
        if(result=='cancel') return;
        if(result=='login')
        {
          this.SpinnerService.show();

          
          this.eventsSubscription.add(this.srv_login.GetToken().subscribe(res=>{this.SpinnerService.hide();})); 
          return;
        }});
      
    }    
    else
    {
      const modalRef = this.modalService.open(MachinePpAddFavoriteComponent, { backdrop:'static',centered: true });
      modalRef.componentInstance.MachineName = mach.MachineName;
      
      if(mach.isFavorite) modalRef.componentInstance.IsDelete = true;
          
      modalRef.result.then((result) => {
        if(result=='cancel') return;
        if(mach.isFavorite && result=='delete')
        {
          mach.isFavorite =false;
          this.eventsSubscription.add(this.srv_machine.machine_delete(mach.MachineID.toString(),this.srv_appsetting.UserIDencode).subscribe((data: any) => {
            this.router.navigate(['/home/machines']);
          }));         
          //this.Initializemachinelist(true);
          //this.eventsChangeFavorite.next();
        }
        else         
        {            
          if(mach.isFavorite) 
          {
              //change only machine name
              this.eventsSubscription.add(this.srv_machine.machine_update_name(
                mach.MachineID.toString(),result,this.srv_appsetting.UserIDencode).subscribe((res: any) => {  
                  this.machHeader.MachineName= result;
                  this.MachineName = this.machHeader.MachineName;                                           
             }));  
          }
          else
          {
            this.eventsSubscription.add(this.srv_machine.machine_add(mach.MachineID.toString(),result,this.srv_appsetting.UserID).subscribe((newid: any) => { 
              alert(newid); 
              this.pr_MachineID =newid;
              this.machHeader=null;
              this.FillMachineData();                               
              })); 
          }                    
        }         
    } );
    }   

} 


  OnFavoriteMachine(mach: Machineheader)
  {       
    const modalRef = this.modalService.open(MachinePpAddFavoriteComponent, { backdrop:'static',centered: true });
    modalRef.componentInstance.MachineName = mach.MachineName;
    
    if(mach.isFavorite) modalRef.componentInstance.IsDelete = true;
        
    modalRef.result.then((result) => {
      if(result=='cancel') return;
      if(mach.isFavorite && result=='delete')
      {
        mach.isFavorite =false;
        this.eventsSubscription.add(this.srv_machine.machine_delete(mach.MachineID.toString(),this.srv_appsetting.UserID).subscribe((data: any) => {}));         
        
      }
      else         
      {            
        //todo: with user
        this.eventsSubscription.add(this.srv_machine.machine_add(mach.MachineID.toString(),result,this.srv_appsetting.UserID).subscribe((newid: any) => {     
          this.FillMachineDataFromServer(newid);
          //this.srv_cook.add_fav_machine(mach.MachineID);         
        })); 
        
      }         
  } );
}

  FillImageMachineType()
  {
      this.imgNameMachine =environment.ImagePath +"no-image.svg";        
      if(this.machHeader.MachineType =='Lathe') this.imgNameMachine =environment.ImagePath +"lathe.png";
      if(this.machHeader.MachineType =='Multi task') this.imgNameMachine =environment.ImagePath +"MultiTask.png";
      if(this.machHeader.MachineType =='Machining center') this.imgNameMachine =environment.ImagePath +"MachiningCenter.png"; 
      if(this.machHeader.MachineType =='Swiss type') this.imgNameMachine =environment.ImagePath +"SwissType.png";
      if(this.machHeader.MachineType =='Multi spindle') this.imgNameMachine =environment.ImagePath +"MultiSpindle.png";                     
  }
 
  FillMachineDataFromServer(MachineID:number)
  {
     this.eventsSubscription.add(this.srv_machine.getmachineheader(MachineID).subscribe((res: any) => {                   
        this.machHeader =JSON.parse(res)[0];                
        this.eventsSubscription.add(this.srv_machine.getmachinedetailed(MachineID,this.srv_appsetting.Units).subscribe((res: any) => {
        this.arrMachineSpindle = JSON.parse(res);      
        this.machSpindleMain = this.arrMachineSpindle[0]; 
        this.machHeader.SpindleSpeed = this.arrMachineSpindle[0].SpindleSpeed;
        this.machHeader.Torque = this.arrMachineSpindle[0].Torque;
        this.FillImageMachineType();
        this.MachineName = this.machHeader.MachineName;
        this.isLoading =true;           
      }));   
    }));    
  }

  OnSelectMachine()
  {    
    let ms=  this.arrMachineSpindle.find(s=> s.SpindleType == this.machHeader.SpindleType )   
    this.machHeader.AdaptationType =ms.AdaptationType;
    this.machHeader.AdaptationSize =ms.AdaptationSize; 
    this.machHeader.Power =ms.Power;
    this.machHeader.SpindleSpeed =ms.SpindleSpeed;
    this.machHeader.Torque =ms.Torque;   
    this.machHeader.ExtMQL =ms.ExtMQL;   
    this.machHeader.IntMQL =ms.IntMQL; 
    this.machHeader.CostPerHour = Math.round(this.machHeader.CostPerHour *100)/100;  
    this.srv_statemanage.SelectedMachine = this.machHeader; 
    this.srv_statemanage.arrMachineSpindle =this.arrMachineSpindle;       
  /*   this.machHeader.AdaptationType =this.arrMachineSpindle[0].AdaptationType;
    this.machHeader.AdaptationSize =this.arrMachineSpindle[0].AdaptationSize; 
    this.machHeader.Power =this.arrMachineSpindle[0].Power;
    this.machHeader.SpindleSpeed =this.arrMachineSpindle[0].SpindleSpeed;
    this.machHeader.Torque =this.arrMachineSpindle[0].Torque;   
    this.machHeader.CostPerHour = Math.round(this.machHeader.CostPerHour *100)/100;  
    this.srv_statemanage.SelectedMachine = this.machHeader; 
    this.srv_statemanage.arrMachineSpindle =this.arrMachineSpindle;   */     
  } 
  
  Reset()
  {
    this.eventsSubscription.add(this.srv_machine.getmachinedetailed(this.MachineID,this.srv_appsetting.Units).subscribe((res: any) => {
      this.arrMachineSpindle = JSON.parse(res);      
      this.machSpindleMain = this.arrMachineSpindle[0]; 
      this.machHeader.SpindleSpeed = this.arrMachineSpindle[0].SpindleSpeed;
      this.machHeader.Torque = this.arrMachineSpindle[0].Torque;
      if(!this.machHeader.isFavorite) this.CostPerHour = Math.round(100/( Math.round(this.srv_appsetting.CurrRate*1000)/1000)*100)/100; 
      this.FillImageMachineType();
           
      this.isLoading =true;          
    }));
  }
  
  
}