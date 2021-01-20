import { Component, OnInit, OnDestroy,ViewChild  } from '@angular/core';
import { Machineheader } from '../../../../../models/machines/machineheader';
import { MachineFilter } from '../../../../../models/machines/machinefilter';
import { MachineService } from '../../../../../services/machine.service';
import { StateManagerService } from '../../../../../services/statemanager.service';
import { CookiesService } from '../../../../../services/cookies.service';
import { AppsettingService} from '../../../../../services/appsetting.service';
import { LoginService } from '../../../../../services/login.service';
import {MachinePpAddFavoriteComponent} from '../machine-pp-add-favorite/machine-pp-add-favorite.component';
import {MachinesPpLoginComponent} from      '../machines-pp-login/machines-pp-login.component';
import { environment } from '../../../../../../environments/environment';
import { MaterialService } from '../../../../../services/material.service'
import { BrowersComponent } from '../../../../maintenance/browers/browers.component';

import { DataTableDirective } from 'angular-datatables';
import { NgbModal} from '@ng-bootstrap/ng-bootstrap';
import { Subject, Subscription } from 'rxjs';
import { NgxSpinnerService } from "ngx-spinner"; 
import { Router } from '@angular/router';

@Component({
  selector: 'app-machines-list',
  templateUrl: './machines-list.component.html',
  styleUrls: ['./machines-list.component.scss']
})

export class MachinesListComponent implements OnInit, OnDestroy {

  @ViewChild(DataTableDirective, {static: false}) dtElement: DataTableDirective;
  isDtInitialized:boolean = false;
  
  dtOptions: DataTables.Settings = {};
  listmachines: Machineheader[] = [];
  listmachines_sorted: Machineheader[] = [];
  MachineFilter: MachineFilter;
  environment = environment;
  MachineIDSelected = 0;
  datatableElement: DataTableDirective;
  dtTrigger: Subject<any> = new Subject();

  private eventsSubscription: Subscription=new Subscription();
  isLoaded:boolean =false;
  countrow:string='';
  countallrow:string='';
  defaultmachine:number=0;
  statusclick:number=0;
 
  public msrv_appsetting:AppsettingService =this.srv_appsetting;
  
  eventsChangeFavorite: Subject<void> = new Subject<void>();
  eventsChangeMachineList: Subject<number[]> = new Subject<number[]>();
  
  SortDesBySpindleType:string='asc';
  constructor(private serv: MaterialService,private router: Router,private srv_machine: MachineService, private srv_statemanage: StateManagerService, 
          private srv_appsetting:AppsettingService,private srv_cook:CookiesService,
          private modalService: NgbModal,private srv_login:LoginService,private SpinnerService: NgxSpinnerService) {   
  }

  ngOnInit() {  

   /*  if(this.srv_appsetting.AfterToken)
    { */
      if(this.getBrowserName()=='ie' && this.srv_cook.get_cookie("is_browser_ie")=='') 
     { 
      const modalRef = this.modalService.open(BrowersComponent, { backdrop:'static',centered: true });
      this.srv_cook.set_cookie("is_browser_ie",'1');
     }
 /*    } */

    let scrollYdiff:string='325px';
    //alert(window.devicePixelRatio);
    if(window.devicePixelRatio>1) scrollYdiff='375px';

    this.dtOptions = {
      pagingType: 'full_numbers',
      "searching": false,
      "lengthChange": false,
      "paging": false,       
       "autoWidth":false,
       "scrollY": 'calc(100vh - '+ scrollYdiff +')',
       "info": false,
       "scrollCollapse" : true,
        "language": {
        "emptyTable": "",
        "zeroRecords": "",
        "infoEmpty": "",
        "info": "",
        },        
        "order": [[ 11, 'desc' ],[ 10, 'asc' ]] ,
        responsive: true
    };  
    
    this.serv.getmaterialsbygrp('EN','P')
    .subscribe((data: any) => {
      this.srv_statemanage.SelectMaterial(JSON.parse(data)[6]);
    });
    
    this.isLoaded =false;
    this.Initializemachinelist(false);
    this.eventsSubscription.add(this.srv_statemanage.ReloadMachineTab.subscribe(arr => {this.Initializemachinelist(false);}));  // todo: 
  }
  
  public getBrowserName() {
    const agent = window.navigator.userAgent.toLowerCase()
    switch (true) {
      case agent.indexOf('edge') > -1:
        return 'edge';
      case agent.indexOf('opr') > -1 && !!(<any>window).opr:
        return 'opera';
      case agent.indexOf('chrome') > -1 && !!(<any>window).chrome:
        return 'chrome';
      case agent.indexOf('trident') > -1:
        return 'ie';
      case agent.indexOf('firefox') > -1:
        return 'firefox';
      case agent.indexOf('safari') > -1:
        return 'safari';
      default:
        return 'other';
    }
  }

  Initializemachinelist(withdestroy:boolean)
  {  
    //let userid_enc:string="";
    //if(this.srv_appsetting.UserID!='')userid_enc=this.srv_encrdecr.encryptData(this.srv_appsetting.UserID);              
    //if(this.srv_appsetting.UserID!='') userid_enc=encodeURIComponent(this.srv_appsetting.UserID);
    //userid_enc=userid_enc.replace('/\./g', '%2E'); 
    this.eventsSubscription.add( this.srv_machine.getmachines(this.srv_appsetting.Units,this.srv_appsetting.UserIDencode)
      .subscribe((data: any) => {               
        this.listmachines = JSON.parse(data);          
        this.listmachines_sorted = JSON.parse(data);
        this.countallrow=this.listmachines_sorted.length.toString();        
        this.myMachineSettings();
        if(this.srv_statemanage.SelectedMachine!=null)
        {
          this.UpdateListBySelectedMachineValues(this.listmachines);
          this.UpdateListBySelectedMachineValues(this.listmachines_sorted);   
          
        } 
        
        this.isLoaded =true;
        if (this.isDtInitialized) {
          this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
            dtInstance.destroy();
            this.dtTrigger.next();
          });
        } else {
          this.isDtInitialized = true
          this.dtTrigger.next();
        }  
        

       /* if(withdestroy)
          this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
            dtInstance.destroy();
            this.dtTrigger.next();
          });   */                                      
      }));  
       
  }
  sort_arr(a:Machineheader,b:Machineheader)
  {
          
      if(!a.IsSelected && !b.IsSelected)
      {
        if(a.isFavorite && !b.isFavorite) return -1;
        if(!a.isFavorite && b.isFavorite) return 1;
      }
      if(a.IsSelected && !b.IsSelected) return -1;
      if(!a.IsSelected && b.IsSelected) return 1;
      return 0;
  }
  
  sort_arr_by_spidletype(a:Machineheader,b:Machineheader)
  {    
      if(this.SortDesBySpindleType=='asc')
      {
        //this.SortDesBySpindleType="DESC";
        if(a.SpindleType > b.SpindleType) return -1;
        return 1;
      } 
      else
      {
        //this.SortDesBySpindleType="ASC";
        if(a.SpindleType > b.SpindleType) return 1;
        return -1;
      }         
  }

  UpdateListBySelectedMachineValues(list:Machineheader[])
  {
    let mach:Machineheader;
    
    mach=list.find(m=> m.MachineID == this.srv_statemanage.SelectedMachine.MachineID);
    if(typeof (mach) !== 'undefined')
    {
      mach.AdaptationType=this.srv_statemanage.SelectedMachine.AdaptationType;
      mach.AdaptationSize=this.srv_statemanage.SelectedMachine.AdaptationSize;     
      mach.Power=this.srv_statemanage.SelectedMachine.Power;
      mach.SpindleSpeed=this.srv_statemanage.SelectedMachine.SpindleSpeed;
      mach.Torque=this.srv_statemanage.SelectedMachine.Torque;

      mach.AdaptationType1=this.srv_statemanage.SelectedMachine.AdaptationType1;
      mach.AdaptationSize1=this.srv_statemanage.SelectedMachine.AdaptationSize1;      
      mach.Power1=this.srv_statemanage.SelectedMachine.Power1;
      mach.SpindleSpeed1=this.srv_statemanage.SelectedMachine.SpindleSpeed1;
      mach.Torque1=this.srv_statemanage.SelectedMachine.Torque1;
      mach.SpindleType=this.srv_statemanage.SelectedMachine.SpindleType;
    }    
  }
  
  SetDefault(MachineID:number)  
  {
    this.statusclick=1;
    this.srv_cook.set_cookie("def_mach",MachineID.toString());
    this.defaultmachine=MachineID;
  }

  myMachineSettings() {
    let stfilter: MachineFilter;
    stfilter = this.srv_statemanage.SelectMachineFilter;
    if (typeof (stfilter) !== 'undefined' && stfilter !== null) {
      this.MachineFilter = stfilter;
      this.ApplyFilter(stfilter);
    } 
    else
    {
      this.ApplyMostRecommended();
    } 
    if(this.srv_cook.get_cookie("def_mach")!='')
      this.defaultmachine =+this.srv_cook.get_cookie("def_mach");    

    if (this.srv_statemanage.SelectedMachine == null) {  
      let m_id:string;      
      if(this.srv_cook.get_cookie("def_mach")=='')
        m_id= '53' ; 
      else        
        m_id= this.srv_cook.get_cookie("def_mach");                                    
      this.srv_statemanage.SelectedMachine= this.listmachines_sorted.find(m=> m.MachineID.toString() == m_id); 
      if(this.srv_statemanage.SelectedMachine.MachineID==null)
      {
        this.srv_statemanage.SelectedMachine= this.listmachines_sorted.find(m=> m.MachineID.toString() == '53'); 
      }          
    } 
    this.UpdateStateSelectedMachine(this.srv_statemanage.SelectedMachine.MachineID);       
    this.listmachines=this.listmachines.sort((a,b)=> this.sort_arr(a,b));
    this.listmachines_sorted=this.listmachines_sorted.sort((a,b)=> this.sort_arr(a,b));
  }

  OnFavoriteMachine(mach: Machineheader)
  { 
    this.statusclick=1;
    if(this.srv_appsetting.UserID=='')
    {    
      const modalRef = this.modalService.open(MachinesPpLoginComponent, { backdrop:'static',centered: true });
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
          this.eventsSubscription.add(this.srv_machine.machine_delete(mach.MachineID.toString(),this.srv_appsetting.UserIDencode).subscribe((data: any) => {}));         
          this.Initializemachinelist(true);
          this.eventsChangeFavorite.next();
        }
        else         
        {            
          if(mach.isFavorite) 
          {
              //change only machine name
              this.eventsSubscription.add(this.srv_machine.machine_update_name(
                mach.MachineID.toString(),result,this.srv_appsetting.UserIDencode).subscribe((res: any) => { 
                  this.Initializemachinelist(true);
                  this.eventsChangeFavorite.next();               
             }));  
          }
          else
          {
            this.eventsSubscription.add(this.srv_machine.machine_add(mach.MachineID.toString(),result,this.srv_appsetting.UserIDencode).subscribe((newid: any) => {     
              this.Initializemachinelist(true);
              this.eventsChangeFavorite.next();                   
              })); 
          }
          
          
        }         
    } );
    }   

} 

ngOnDestroy() {
    this.eventsSubscription.unsubscribe();
  }

UpdateStateSelectedMachine(MachineID: number) {        
    this.listmachines.forEach((m) => {
      m.DescSelect = "Select";
      if (MachineID == m.MachineID)
        m.IsSelected = true;
      else
        m.IsSelected = false;  
      
      if (m.isFavorite)
        m.isFavorite = true;
      else
        m.isFavorite = false;                
    });
      this.listmachines_sorted.forEach((m) => {
      m.DescSelect = "Select";
      if (MachineID == m.MachineID)
        m.IsSelected = true;
      else
        m.IsSelected = false;                      
    }); 
  }

  OnSelectDefaultMachine(mach: Machineheader) {
    this.statusclick =1;
    this.srv_cook.set_cookie("sel_mach",mach.MachineID.toString());
    this.UpdateStateSelectedMachine(mach.MachineID);
    this.srv_statemanage.SelectedMachine = mach;
    this.srv_statemanage.SelectMachineFilter = this.MachineFilter;
  }

  onMachineFilterChanged($event) {    
   
    this.isLoaded=true;
    this.MachineFilter = $event.filter;            
    this.ApplyFilter($event.filter);      
    if (this.srv_statemanage.SelectedMachine == null){
      this.UpdateStateSelectedMachine(-1);
      this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
        dtInstance.destroy();
        this.dtTrigger.next();
      });           
    }
    else
    {      
      this.UpdateStateSelectedMachine(this.srv_statemanage.SelectedMachine.MachineID);
      this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
        dtInstance.destroy();
        this.dtTrigger.next();
      });    
      //this.isDtInitialized = true
      //this.dtTrigger.next();
    }
  }

  onMachineFilterClear() {       
    this.isLoaded=true;
    this.listmachines =  this.listmachines_sorted;
    this.countrow =this.listmachines.length.toString();
    this.UpdateStateSelectedMachine(this.srv_statemanage.SelectedMachine.MachineID);    
  }

  ApplyFilter(filter: MachineFilter) {            
    this.listmachines = this.listmachines_sorted.filter(
      m => ((m.SpindleSpeed >= filter.SpeedMin && m.SpindleSpeed <= filter.SpeedMax && filter.IsSliderSpeed ) || !filter.IsSliderSpeed)  &&
        ((m.Power >= filter.PowerMin && m.Power <= filter.PowerMax && filter.IsSliderPower ) || !filter.IsSliderPower) &&
        ((m.Torque >= filter.TorqueMin && m.Torque <= filter.TorqueMax && filter.IsSliderTorque ) ||  !filter.IsSliderTorque ) &&
        ((!filter.IsMachiningCenter && m.MachineType != "Machining center") || filter.IsMachiningCenter) &&
        ((!filter.IsLathe && m.MachineType != "Lathe") || filter.IsLathe) &&
        ((!filter.IsMultiTask && m.MachineType != "Multi task") || filter.IsMultiTask) &&
        ((!filter.IsMultiSpindle && m.MachineType != "Multi spindle") || filter.IsMultiSpindle) &&
        ((!filter.IsSwissType && m.MachineType != "Swiss type") || filter.IsSwissType) &&
        ((!filter.IsMachineTypeStandard && m.MachineType1 != "Standard") || filter.IsMachineTypeStandard) &&
        ((!filter.IsMachineTypeHeavyDuty && m.MachineType1 != "Heavy Duty") || filter.IsMachineTypeHeavyDuty) &&
        ((!filter.IsMachineTypeHighSpeed && m.MachineType1 != "High speed") || filter.IsMachineTypeHighSpeed) && 
        ((filter.AdaptationType !='' && (m.AdaptationType ==filter.AdaptationType || m.AdaptationType1 ==filter.AdaptationType)) || filter.AdaptationType =='') && 
        ((filter.AdaptationSize !='' && (m.AdaptationSize ==filter.AdaptationSize || m.AdaptationSize1 ==filter.AdaptationSize)) || filter.AdaptationSize =='') &&
        (m.MachineName.toUpperCase().indexOf(filter.SearchText.toUpperCase()) > -1 || m.AdaptationType.toUpperCase().indexOf(filter.SearchText.toUpperCase()) > -1 
        || m.AdaptationSize.toString().indexOf(filter.SearchText.toUpperCase()) > -1
        || m.Power.toString().indexOf(filter.SearchText.toUpperCase()) > -1
        || m.Torque.toString().indexOf(filter.SearchText.toUpperCase()) > -1
        || m.SpindleSpeed.toString().indexOf(filter.SearchText.toUpperCase()) > -1
        ) &&
        ((filter.ShowOnlyFavorites && m.isFavorite) || (!filter.ShowOnlyFavorites))  
        && 
        ((filter.IsMostRecommended && (m.isFavorite || m.IsMostRecommended)) || (!filter.IsMostRecommended))) 
        ;
    this.srv_statemanage.SelectMachineFilter = filter;
    this.countrow =this.listmachines.length.toString(); 
    
    let minPower:number=0;
    let maxPower:number=0;
    let minSpeed:number=0;
    let maxSpeed:number=0;
    let minTorque:number=0;
    let maxTorque:number=0;
    if(this.listmachines.length>0)
    {
      minPower = Math.min.apply(Math,this.listmachines.map(a => a['Power']).filter(function(val) { if(typeof val ==='number' || typeof val ==='string'){return val;} }))   
      maxPower = Math.max.apply(Math,this.listmachines.map(a => a['Power']).filter(function(val) { if(typeof val ==='number' || typeof val ==='string'){return val;} }))    
      minSpeed = Math.min.apply(Math,this.listmachines.map(a => a['SpindleSpeed']).filter(function(val) { if(typeof val ==='number' || typeof val ==='string'){return val;} }))    
      maxSpeed = Math.max.apply(Math,this.listmachines.map(a => a['SpindleSpeed']).filter(function(val) { if(typeof val ==='number' || typeof val ==='string'){return val;} }))    
      minTorque = Math.min.apply(Math,this.listmachines.map(a => a['Torque']).filter(function(val) { if(typeof val ==='number' || typeof val ==='string'){return val;} }))    
      maxTorque = Math.max.apply(Math,this.listmachines.map(a => a['Torque']).filter(function(val) { if(typeof val ==='number' || typeof val ==='string'){return val;} }))
      let nn:number[]=[];
      nn.push(minPower);nn.push(maxPower);nn.push(minSpeed);nn.push(maxSpeed);nn.push(minTorque);nn.push(maxTorque);
      this.eventsChangeMachineList.next(nn);
    }    
  }

  SortSpindleType()
  {  
    this.dtOptions = {
      pagingType: 'full_numbers',
      "searching": false,
      "lengthChange": false,
      "paging": false,       
       "autoWidth":false,
       "scrollY": '65vh',
       "scrollCollapse" : true,
        "language": {
        "emptyTable": "",
        "zeroRecords": "",
        "infoEmpty": "",
        "info": "",
        },        
        "order": [[ 2, this.SortDesBySpindleType ]] ,
        responsive: true
    };   
    
     this.listmachines=this.listmachines.sort((a,b)=> this.sort_arr_by_spidletype(a,b));  
    //this.listmachines_sorted=this.listmachines_sorted.sort((a,b)=> this.sort_arr_by_spidletype(a,b));
    if(this.SortDesBySpindleType=='asc') 
      this.SortDesBySpindleType='desc';
    else
      this.SortDesBySpindleType='asc';
 
    if (this.isDtInitialized) {
      this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
        dtInstance.destroy();
        this.dtTrigger.next();
      });
    } else {
      this.isDtInitialized = true
      this.dtTrigger.next();
    }  
  }
  ApplyMostRecommended() {        
    this.listmachines = this.listmachines_sorted.filter(
      m => 
        ((m.isFavorite || m.IsMostRecommended)))
        ;
    //this.srv_statemanage.SelectMachineFilter = filter;
    this.countrow =this.listmachines.length.toString();   
  }

  onclickrow(m:Machineheader)
  {
    if(this.statusclick ==0)
    {
    this.OnSelectMachine(m);
    this.router.navigate(['/home/machine-item/' + m.MachineIDBase + '/' + m.MachineName]); 
    }
    else
      this.statusclick =0;
    //this.router.navigate(['/home/machine-item/', { id: m.MachineIDBase ,name:m.MachineName}]); 
    //this.router.navigate(['/home/machine-item']); 
  }

  OnSelectMachine(mach: Machineheader) 
  {        
            
      this.srv_cook.set_cookie("def_mach",mach.MachineID.toString());          
      this.UpdateStateSelectedMachine(mach.MachineID);      
      if(this.srv_statemanage.SelectedMachine.MachineID != mach.MachineID)
      {        
        this.srv_statemanage.SelectedMachine = mach;
        this.srv_statemanage.arrMachineSpindle =null;
      }      
      this.srv_statemanage.SelectMachineFilter = this.MachineFilter; 
      this.srv_statemanage.GoMaterialTab=true;                    
  }

  setspindletype(mach:Machineheader,type:string)
  {
    let mm=this.listmachines.find(m=> m.MachineID == mach.MachineID);
    if(mm.SpindleType!=type)
    {
      mm.SpindleType=type;  
      
      let s=mm.SpindleSpeed1;
      let p=mm.Power1;
      let t=mm.Torque1;      
      let at=mm.AdaptationType1;
      let az=mm.AdaptationSize1;      

      mm.SpindleSpeed1=mm.SpindleSpeed;
      mm.Power1=mm.Power;
      mm.Torque1=mm.Torque;
      mm.AdaptationType1=mm.AdaptationType;
      mm.AdaptationSize1=mm.AdaptationSize;
      
      mm.SpindleSpeed=s;
      mm.Power=p;
      mm.Torque=t;
      mm.AdaptationType=at;
      mm.AdaptationSize=az;
      
      if(this.srv_statemanage.SelectedMachine!=null)
      {
        if(mm.MachineID==this.srv_statemanage.SelectedMachine.MachineID) 
        {        
          this.srv_statemanage.SelectedMachine = mm;
        }          
      }    
    }  
  }

}

