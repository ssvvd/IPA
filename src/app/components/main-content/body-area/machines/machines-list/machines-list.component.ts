import { Component, OnInit, OnDestroy,ViewChild  } from '@angular/core';
import { Machineheader } from 'src/app/models/machines/machineheader';
import { MachineFilter } from 'src/app/models/machines/machinefilter';
import { MachineService } from 'src/app/services/machine.service';
import { StateManagerService } from 'src/app/services/statemanager.service';
import { CookiesService } from 'src/app/services/cookies.service';
import { AppsettingService} from 'src/app/services/appsetting.service';
import {MachinePpAddFavoriteComponent} from 'src/app/components/main-content/body-area/machines/machine-pp-add-favorite/machine-pp-add-favorite.component';
import {MachinesPpLoginComponent} from      'src/app/components/main-content/body-area/machines/machines-pp-login/machines-pp-login.component';
import { environment } from 'src/environments/environment';
import { DataTableDirective } from 'angular-datatables';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subject, Subscription } from 'rxjs';
import { NgxSpinnerService } from "ngx-spinner"; 
import { LoginService } from 'src/app/services/login.service';
//import { ENGINE_METHOD_DIGESTS } from 'constants';

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
  //allSubs$: Subscription;
  private eventsSubscription: Subscription=new Subscription();
  isLoaded:boolean =false;
  countrow:string='';
  defaultmachine:number=0;

  public msrv_appsetting:AppsettingService =this.srv_appsetting;
  
  eventsChangeFavorite: Subject<void> = new Subject<void>();

  constructor(private srv_machine: MachineService, private srv_statemanage: StateManagerService, 
          private srv_appsetting:AppsettingService,private srv_cook:CookiesService,
          private modalService: NgbModal,private srv_login:LoginService,private SpinnerService: NgxSpinnerService) {   
  }

  ngOnInit() {  
 
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
        "order": [[ 11, 'desc' ],[ 10, 'asc' ]] ,
        responsive: true
    };    
    this.isLoaded =false;
    this.Initializemachinelist(false);
 /*    this.allSubs$ = this.srv_machine.getmachines(this.srv_appsetting.Units,this.srv_appsetting.UserID)
      .subscribe((data: any) => {
        console.log(data);
        this.listmachines = JSON.parse(data);          
        this.listmachines_sorted = JSON.parse(data);
               
        this.myMachineSettings();
        if(this.srv_statemanage.SelectedMachine!=null)
        {
          this.UpdateListBySelectedMachineValues(this.listmachines);
          this.UpdateListBySelectedMachineValues(this.listmachines_sorted);         
        } 
                             
      });   */
       this.srv_statemanage.ReloadMachineTab.subscribe(arr => this.Initializemachinelist(false));  // todo: 
  }
  
  Initializemachinelist(withdestroy:boolean)
  {            
    this.eventsSubscription.add( this.srv_machine.getmachines(this.srv_appsetting.Units,this.srv_appsetting.UserID)
      .subscribe((data: any) => {               
        this.listmachines = JSON.parse(data);          
        this.listmachines_sorted = JSON.parse(data);
                
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
      if(a.IsSelected && !b.IsSelected) return -1;
      if(!a.IsSelected && b.IsSelected) return 1;
      
      if(!a.IsSelected && !b.IsSelected)
      {
        if(a.isFavorite && !b.isFavorite) return -1;
        if(!a.isFavorite && b.isFavorite) return 1;
      }
      return 0;
  }

  UpdateListBySelectedMachineValues(list:Machineheader[])
  {
    let mach:Machineheader;
    if(typeof (mach) !== 'undefined')
    {
      mach=list.find(m=> m.MachineID == this.srv_statemanage.SelectedMachine.MachineID);
      mach.AdaptationType=this.srv_statemanage.SelectedMachine.AdaptationType;
      mach.AdaptationSize=this.srv_statemanage.SelectedMachine.AdaptationSize;
      mach.Power=this.srv_statemanage.SelectedMachine.Power;
      mach.SpindleSpeed=this.srv_statemanage.SelectedMachine.SpindleSpeed;
      mach.Torque=this.srv_statemanage.SelectedMachine.Torque;
    }    
  }
  
  SetDefault(MachineID:number)  
  {
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
    } 
    this.UpdateStateSelectedMachine(this.srv_statemanage.SelectedMachine.MachineID);       
    this.listmachines=this.listmachines.sort((a,b)=> this.sort_arr(a,b));
    this.listmachines_sorted=this.listmachines_sorted.sort((a,b)=> this.sort_arr(a,b));
  }

  OnFavoriteMachine(mach: Machineheader)
  { 
    if(this.srv_appsetting.UserID=='')
    {
      //alert('Only for registered user');
      const modalRef = this.modalService.open(MachinesPpLoginComponent, { centered: true });
      //modalRef.componentInstance.MachineName = mach.MachineName;
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
          this.Initializemachinelist(true);
          this.eventsChangeFavorite.next();
        }
        else         
        {            
          if(mach.isFavorite) 
          {
              //change only machine name
              this.eventsSubscription.add(this.srv_machine.machine_update_name(
                mach.MachineID.toString(),result,this.srv_appsetting.UserID).subscribe((res: any) => { 
                  this.Initializemachinelist(true);
                  this.eventsChangeFavorite.next();               
             }));  
          }
          else
          {
            this.srv_machine.machine_add(mach.MachineID.toString(),result,this.srv_appsetting.UserID).subscribe((newid: any) => {     
              this.Initializemachinelist(true);
              this.eventsChangeFavorite.next();                   
              }); 
          }
          
          
        }         
    } );
    }   

} 

/* BuildMachineUser(id:number,id_new:number,name_new:string) 
{  
    let m_old:Machineheader;
    let m_new:Machineheader;
    m_old=this.listmachines_sorted.find(a=> a.MachineID==id);
    if(typeof (m_old) !== 'undefined')
    {
      m_new=Object.assign({}, m_old);
      m_new.MachineIDBase = +id;
      m_new.MachineID = +id_new;
      m_new.MachineName = name_new;
      m_new.isFavorite = true;
      this.listmachines.push(m_new);  
      this.listmachines_sorted.push(m_new); 
    }
  }  */ 

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

  OnSelectMachine(mach: Machineheader) {
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
      m => m.SpindleSpeed >= filter.SpeedMin && m.SpindleSpeed <= filter.SpeedMax &&
        m.Power >= filter.PowerMin && m.Power <= filter.PowerMax &&
        m.Torque >= filter.TorqueMin && m.Torque <= filter.TorqueMax &&
        ((!filter.IsMachiningCenter && m.MachineType != "Machining center") || filter.IsMachiningCenter) &&
        ((!filter.IsLathe && m.MachineType != "Lathe") || filter.IsLathe) &&
        ((!filter.IsMultiTask && m.MachineType != "Multi task") || filter.IsMultiTask) &&
        ((!filter.IsMultiSpindle && m.MachineType != "Multi spindle") || filter.IsMultiSpindle) &&
        ((!filter.IsSwissType && m.MachineType != "Swiss type") || filter.IsSwissType) &&
        ((!filter.IsMachineTypeStandard && m.MachineType1 != "Standard") || filter.IsMachineTypeStandard) &&
        ((!filter.IsMachineTypeHeavyDuty && m.MachineType1 != "Heavy Duty") || filter.IsMachineTypeHeavyDuty) &&
        ((!filter.IsMachineTypeHighSpeed && m.MachineType1 != "High speed") || filter.IsMachineTypeHighSpeed) && 
        ((filter.AdaptationType !='' && m.AdaptationType ==filter.AdaptationType) || filter.AdaptationType =='') && 
        ((filter.AdaptationSize !='' && m.AdaptationSize ==filter.AdaptationSize) || filter.AdaptationSize =='') &&
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
    
  }

  ApplyMostRecommended() {        
    this.listmachines = this.listmachines_sorted.filter(
      m => 
        ((m.isFavorite || m.IsMostRecommended)))
        ;
    //this.srv_statemanage.SelectMachineFilter = filter;
    this.countrow =this.listmachines.length.toString(); 
    
  }

}

