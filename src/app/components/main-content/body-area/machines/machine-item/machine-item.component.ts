import { Component, OnInit, HostListener, Input} from '@angular/core';
import { MachineService } from 'src/app/services/machine.service' ;
import { StateManagerService} from 'src/app/services/statemanager.service' ;
import { AppsettingService} from 'src/app/services/appsetting.service';
import { Machineheader } from 'src/app/models/machines/machineheader';
import { Machinespindle } from 'src/app/models/machines/machinespindle';
import { MachinePpAddFavoriteComponent} from 'src/app/components/main-content/body-area/machines/machine-pp-add-favorite/machine-pp-add-favorite.component';
import { PpSuccessfullyComponent} from 'src/app/components/maintenance/pp-successfully/pp-successfully.component';
import {MachinesPpLoginComponent} from      'src/app/components/main-content/body-area/machines/machines-pp-login/machines-pp-login.component';
import { LoginService } from 'src/app/services/login.service';
import { ActivatedRoute} from '@angular/router';
import { environment } from 'src/environments/environment';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from "ngx-spinner"; 
import { Subscription } from 'rxjs';

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
              private router: ActivatedRoute ,private srv_login:LoginService, private srv_statemanage:StateManagerService,private modalService: NgbModal) 
  {           
    this.eventsSubscription.add(this.router.params.subscribe(params => {
    this.MachineID = parseInt(params["id"]);
    this.MachineName= params["name"];
    }));
  }
  public innerheight: any;

  @HostListener('window:resize', ['$event'])
  onResize(event) {  
      this.innerheight = window.innerHeight-400;
     
  }

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
  ngOnInit() {  
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
        this.CostPerHour = Math.round(this.machHeader.CostPerHour / this.srv_appsetting.CurrRate*100)/100;            
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
     this.machHeader.CostPerHour = Math.round(this.CostPerHour* this.srv_appsetting.CurrRate*100)/100;
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
                
      const modalRef = this.modalService.open(PpSuccessfullyComponent, { centered: true });
      modalRef.componentInstance.HeaderDescription = "My Machines";
      modalRef.componentInstance.Text = "My Machines has been successfully saved";
    }));               
  }

  OnFavoriteMachine1(mach: Machineheader)
  { 
    //this.statusclick=1;
    if(this.srv_appsetting.UserID=='')
    {    
      const modalRef = this.modalService.open(MachinesPpLoginComponent, { centered: true });
      modalRef.componentInstance.title = "Add To My Machines";
      modalRef.componentInstance.Msg = 'Please login to add the machine to My Machines';
      modalRef.result.then((result) => {
        if(result=='cancel') return;
        if(result=='login')
        {
          this.SpinnerService.show();
          this.srv_login.GetToken().subscribe(res=>{this.SpinnerService.hide();}); 
          return;
        }});
      
    }    
    else
    {
      const modalRef = this.modalService.open(MachinePpAddFavoriteComponent, { centered: true });
      modalRef.componentInstance.MachineName = mach.MachineName;
      
      if(mach.isFavorite) modalRef.componentInstance.IsDelete = true;
          
      modalRef.result.then((result) => {
        if(result=='cancel') return;
        if(mach.isFavorite && result=='delete')
        {
          mach.isFavorite =false;
          this.srv_machine.machine_delete(mach.MachineID.toString(),this.srv_appsetting.UserID).subscribe((data: any) => {});         
          //this.Initializemachinelist(true);
          //this.eventsChangeFavorite.next();
        }
        else         
        {            
          if(mach.isFavorite) 
          {
              //change only machine name
              this.eventsSubscription.add(this.srv_machine.machine_update_name(
                mach.MachineID.toString(),result,this.srv_appsetting.UserID).subscribe((res: any) => { 
                  //this.Initializemachinelist(true);
                  //this.eventsChangeFavorite.next();               
             }));  
          }
          else
          {
            this.srv_machine.machine_add(mach.MachineID.toString(),result,this.srv_appsetting.UserID).subscribe((newid: any) => {     
              //this.Initializemachinelist(true);
              //this.eventsChangeFavorite.next();                   
              }); 
          }                    
        }         
    } );
    }   

} 


  OnFavoriteMachine(mach: Machineheader)
  {       
    const modalRef = this.modalService.open(MachinePpAddFavoriteComponent, { centered: true });
    modalRef.componentInstance.MachineName = mach.MachineName;
    
    if(mach.isFavorite) modalRef.componentInstance.IsDelete = true;
        
    modalRef.result.then((result) => {
      if(result=='cancel') return;
      if(mach.isFavorite && result=='delete')
      {
        mach.isFavorite =false;
        this.srv_machine.machine_delete(mach.MachineID.toString(),this.srv_appsetting.UserID).subscribe((data: any) => {});         
        
      }
      else         
      {            
        //todo: with user
        this.srv_machine.machine_add(mach.MachineID.toString(),result,this.srv_appsetting.UserID).subscribe((newid: any) => {     
          this.FillMachineDataFromServer(newid);
          //this.srv_cook.add_fav_machine(mach.MachineID);         
        }); 
        
      }         
  } );
}

  FillImageMachineType()
  {
      this.imgNameMachine =environment.ImagePath +"no-image.svg";        
      if(this.machHeader.MachineType =='Lathe') this.imgNameMachine =environment.ImagePath +"lathe.svg";
      if(this.machHeader.MachineType =='Multi task') this.imgNameMachine =environment.ImagePath +"MultiTask.svg";
      if(this.machHeader.MachineType =='Machining center') this.imgNameMachine =environment.ImagePath +"MachiningCenter.svg"; 
      if(this.machHeader.MachineType =='Swiss type') this.imgNameMachine =environment.ImagePath +"SwissType.svg";
      if(this.machHeader.MachineType =='Multi spindle') this.imgNameMachine =environment.ImagePath +"MultiSpindle.svg";                     
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
    this.machHeader.AdaptationType =this.arrMachineSpindle[0].AdaptationType;
    this.machHeader.AdaptationSize =this.arrMachineSpindle[0].AdaptationSize; 
    this.machHeader.Power =this.arrMachineSpindle[0].Power;
    this.machHeader.SpindleSpeed =this.arrMachineSpindle[0].SpindleSpeed;
    this.machHeader.Torque =this.arrMachineSpindle[0].Torque;   
    this.srv_statemanage.SelectedMachine = this.machHeader; 
    this.srv_statemanage.arrMachineSpindle =this.arrMachineSpindle;       
  } 
  
  Reset()
  {
    this.eventsSubscription.add(this.srv_machine.getmachinedetailed(this.MachineID,this.srv_appsetting.Units).subscribe((res: any) => {
      this.arrMachineSpindle = JSON.parse(res);      
      this.machSpindleMain = this.arrMachineSpindle[0]; 
      this.machHeader.SpindleSpeed = this.arrMachineSpindle[0].SpindleSpeed;
      this.machHeader.Torque = this.arrMachineSpindle[0].Torque;
      if(!this.machHeader.isFavorite) this.CostPerHour = Math.round(100 / this.srv_appsetting.CurrRate*100)/100; 
      this.FillImageMachineType();
           
      this.isLoading =true;          
    }));
  }
  
  
}