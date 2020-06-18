import { Component, OnInit, OnDestroy,ViewChild  } from '@angular/core';
import { Machineheader } from 'src/app/models/machines/machineheader';
import { MachineFilter } from 'src/app/models/machines/machinefilter';
import { MachineService } from 'src/app/services/machine.service';
import { StateManagerService } from 'src/app/services/statemanager.service';
import { CookiesService } from 'src/app/services/cookies.service';
import { AppsettingService} from 'src/app/services/appsetting.service';
import {MachinePpAddFavoriteComponent} from 'src/app/components/main-content/body-area/machines/machine-pp-add-favorite/machine-pp-add-favorite.component';
import { environment } from 'src/environments/environment';
import { DataTableDirective } from 'angular-datatables';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { Subject, Subscription } from 'rxjs';


@Component({
  selector: 'app-machines-list',
  templateUrl: './machines-list.component.html',
  styleUrls: ['./machines-list.component.scss']
})

export class MachinesListComponent implements OnInit, OnDestroy {

  @ViewChild(DataTableDirective, {static: false}) dtElement: DataTableDirective;
  isDtInitialized:boolean = false;

  //myVar: any;
  dtOptions: DataTables.Settings = {};
  listmachines: Machineheader[] = [];
  listmachines_sorted: Machineheader[] = [];
  MachineFilter: MachineFilter;
  environment = environment;
  MachineIDSelected = 0;
  datatableElement: DataTableDirective;
  dtTrigger: Subject<any> = new Subject();
  allSubs$: Subscription;
  isLoaded:boolean =false;
  countrow:string='';
  public msrv_appsetting:AppsettingService =this.srv_appsetting;

  constructor(private srv_machine: MachineService, private srv_statemanage: StateManagerService, 
          private srv_appsetting:AppsettingService,private srv_cook:CookiesService,private modalService: NgbModal) {   
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
    this.allSubs$ = this.srv_machine.getmachines(this.srv_appsetting.Units)
      .subscribe((data: any) => {

        this.listmachines = JSON.parse(data);          
        this.listmachines_sorted = JSON.parse(data);

        if(this.srv_statemanage.SelectedMachine!=null)
        {
          this.UpdateListBySelectedMachineValues(this.listmachines);
          this.UpdateListBySelectedMachineValues(this.listmachines_sorted);         
        }         
        this.myMachineSettings();
        
                
       
      });  
       //this.srv_statemanage.ReloadMachineTab.subscribe(arr => this.ReloadMe());  // todo: 
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

  /* openAddToFavM(m:Machineheader) {
    const modalRef = this.modalService.open(MachinePpAddFavoriteComponent, { centered: true });
    modalRef.componentInstance.MachineName = m.MachineName;
    modalRef.componentInstance.passName.subscribe((name) => {
      alert(name);
      }) 
     
  }*/

/*   ReloadMe()
  {
      //alert('ReloadMe');
      this.allSubs$ = this.srv_machine.getmachines(this.srv_appsetting.Units)
      .subscribe((data: any) => {

        this.listmachines = JSON.parse(data);          
        this.listmachines_sorted = JSON.parse(data);

        if(this.srv_statemanage.SelectedMachine!=null)
        {
          this.UpdateListBySelectedMachineValues(this.listmachines);
          this.UpdateListBySelectedMachineValues(this.listmachines_sorted);         
        }          
        this.myMachineSettings();       
        //this.UpdateStateSelectedMachine(this.srv_statemanage.SelectedMachine.MachineID); 
        this.isLoaded =true;
        this.dtTrigger.next();
      });      
  } */

  UpdateListBySelectedMachineValues(list:Machineheader[])
  {
    let mach:Machineheader;
    mach=list.find(m=> m.MachineID == this.srv_statemanage.SelectedMachine.MachineID);
    mach.AdaptationType=this.srv_statemanage.SelectedMachine.AdaptationType;
    mach.AdaptationSize=this.srv_statemanage.SelectedMachine.AdaptationSize;
    mach.Power=this.srv_statemanage.SelectedMachine.Power;
    mach.SpindleSpeed=this.srv_statemanage.SelectedMachine.SpindleSpeed;
    mach.Torque=this.srv_statemanage.SelectedMachine.Torque;

  }
  
  myMachineSettings() {
    let stfilter: MachineFilter;
    stfilter = this.srv_statemanage.SelectMachineFilter;
    if (typeof (stfilter) !== 'undefined' && stfilter !== null) {
      this.MachineFilter = stfilter;
      this.ApplyFilter(stfilter);
    } 
    if (this.srv_statemanage.SelectedMachine == null) {  
      let m_id:string;
      if(this.srv_cook.get_cookie("sel_mach")=='')
        m_id='53';
      else
        m_id=this.srv_cook.get_cookie("sel_mach");   
      this.srv_statemanage.SelectedMachine= this.listmachines_sorted.find(m=> m.MachineID.toString() == m_id);           
    } 
    this.UpdateStateSelectedMachine(this.srv_statemanage.SelectedMachine.MachineID);   
    this.BuildMachineUserByCookies();
    this.listmachines=this.listmachines.sort((a,b)=> this.sort_arr(a,b));
    this.listmachines_sorted=this.listmachines_sorted.sort((a,b)=> this.sort_arr(a,b));
    this.isLoaded =true;
    this.dtTrigger.next();
    //this.SortTableData();
  }
  
  ngOnDestroy() {
    this.allSubs$.unsubscribe();
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
        this.srv_cook.remove_fav_machine(mach.MachineID);
      }
      else
          if(result== mach.MachineName)
          {
            mach.isFavorite =true;
            this.srv_cook.add_fav_machine(mach.MachineID);
          }
          else
          {
            mach.isFavorite =true;
            this.srv_cook.add_fav_machine(mach.MachineID);

            //todo:remove temp
            //this.AddMachineFavoriteUserToCookie(mach,result);
            //this.BuildMachineUserByCookies();

            //todo: with user
            /* this.srv_machine.machine_copy(mach.MachineID.toString(),mach.MachineType,mach.MachineName,result).subscribe((newid: any) => {              
            }); */
          }         
  } );
} 

AddMachineFavoriteUserToCookie(m:Machineheader,name_new:string)
{  
  this.srv_cook.add_item_to_cookielist('fav_machine_user',(m.MachineID.toString() + '~' + name_new));  
}

BuildMachineUserByCookies() 
{
  let arr:string[] = this.srv_cook.get_cookielist("fav_machine_user");  
  for (let m of arr) 
  {
    let id:string=m.split('~')[0];
    let name_new:string=m.split('~')[1];
    let m_old:Machineheader;
    let m_new:Machineheader;
    m_old=this.listmachines.find(a=> a.MachineID.toString()==id);
    if(typeof (m_old) !== 'undefined')
    {
      m_new=Object.assign({}, m_old);
      m_new.MachineName = name_new;
      m_new.isFavorite = true;
      this.listmachines.push(m_new);  
      this.listmachines_sorted.push(m_new); 
    }
  }
  
}

UpdateStateSelectedMachine(MachineID: number) {       
    let arr_fav:string[]=this.srv_cook.get_cookielist("fav_machines");
    this.listmachines.forEach((m) => {
      m.DescSelect = "Select";
      if (MachineID == m.MachineID)
        m.IsSelected = true;
      else
        m.IsSelected = false;  
        
      if( arr_fav.indexOf( m.MachineID.toString() )==-1)      
        m.isFavorite =false;                      
      else      
        m.isFavorite =true;             
    });
       this.listmachines_sorted.forEach((m) => {
      m.DescSelect = "Select";
      if (MachineID == m.MachineID)
        m.IsSelected = true;
      else
        m.IsSelected = false;  
        
      if( arr_fav.indexOf( m.MachineID.toString() )==-1)      
        m.isFavorite =false;                      
      else      
        m.isFavorite =true;             
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
      //this.isDtInitialized = true
      //this.dtTrigger.next();
    }
  }

  onMachineFilterClear() {       
    this.isLoaded=true;
    this.listmachines =  this.listmachines_sorted;
    this.countrow =this.listmachines.length.toString();
    this.UpdateStateSelectedMachine(this.srv_statemanage.SelectedMachine.MachineID);
    this.SortTableData();
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
        ((!filter.IsSwissType && m.MachineType != "swiss type") || filter.IsSwissType) &&
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
        ));
    this.srv_statemanage.SelectMachineFilter = filter;
    this.countrow =this.listmachines.length.toString(); 
    
    this.SortTableData();
    //this.dtTrigger.next();
  }

  SortTableData()
  {
    //TODO: error - remove the scroll and icons of sorting !!!!!  
   /*  this.isLoaded=false;
    let arr:Machineheader[];
    //arr=Object.assign({}, this.listmachines);
    arr = JSON.parse(JSON.stringify(this.listmachines));
    arr.sort((a,b)=> {if(a.IsSelected && !b.IsSelected) return -1; else return 0;});
    //this.listmachines=Object.assign({}, arr);
    this.listmachines = JSON.parse(JSON.stringify(arr));
    //this.listmachines=Object.assign({},this.listmachines.sort((a,b)=> {if(a.IsSelected && !b.IsSelected) return -1; else return 0;}));      
    this.isLoaded=true;  */
  }

}

