import { Component, OnInit, OnDestroy,ViewChild  } from '@angular/core';
import { Machineheader } from 'src/app/models/machines/machineheader';
import { MachineFilter } from 'src/app/models/machines/machinefilter';
import { MachineService } from 'src/app/services/machine.service';
import { StateManagerService } from 'src/app/services/statemanager.service';
import { CookiesService } from 'src/app/services/cookies.service';
import { AppsettingService} from 'src/app/services/appsetting.service';
import { environment } from 'src/environments/environment';
import { DataTableDirective } from 'angular-datatables';
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

  public msrv_appsetting:AppsettingService =this.srv_appsetting;

  constructor(private srv_machine: MachineService, private srv_statemanage: StateManagerService, 
          private srv_appsetting:AppsettingService,private srv_cook:CookiesService ) {   
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
        "info": "" },
        responsive: true
    };        
  
    this.allSubs$ = this.srv_machine.getmachines()
      .subscribe((data: any) => {

        this.listmachines = JSON.parse(data);          
        this.listmachines_sorted = JSON.parse(data);

        if(this.srv_statemanage.SelectedMachine!=null)
        {
          this.UpdateListBySelectedMachineValues(this.listmachines);
          this.UpdateListBySelectedMachineValues(this.listmachines_sorted);         
        }  
        //this.listmachines_sorted = Object.assign({}, this.listmachines);
        this.myMachineSettings();
        this.dtTrigger.next();
        this.isLoaded =true;
      });  
       //this.srv_statemanage.ReloadMachineTab.subscribe(arr => this.ReloadMe());  // todo: 
  }
  
  ReloadMe()
  {
      //alert('ReloadMe');
      this.allSubs$ = this.srv_machine.getmachines()
      .subscribe((data: any) => {

        this.listmachines = JSON.parse(data);          
        this.listmachines_sorted = JSON.parse(data);

        if(this.srv_statemanage.SelectedMachine!=null)
        {
          this.UpdateListBySelectedMachineValues(this.listmachines);
          this.UpdateListBySelectedMachineValues(this.listmachines_sorted);         
        }          
        this.myMachineSettings();
        this.dtTrigger.next();
        this.isLoaded =true;
      });      
  }

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
      this.srv_statemanage.SelectedMachine= this.listmachines_sorted.find(m=> m.MachineID == 12);           
    } 
    this.UpdateStateSelectedMachine(this.srv_statemanage.SelectedMachine.MachineID);   
    this.SortTableData();
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

  ngOnDestroy() {
    this.allSubs$.unsubscribe();
  }

  OnFavoriteMachine(mach: Machineheader)
  {
    if(mach.isFavorite)
    {
      mach.isFavorite =false;
      this.srv_cook.remove_fav_machine(mach.MachineID);
    }
    else
    {
      mach.isFavorite =true;
      this.srv_cook.add_fav_machine(mach.MachineID);
    }

    
  }  

  UpdateStateSelectedMachine(MachineID: number) {    
    let arr_fav:string[];
    let str_fav:string=this.srv_cook.get_cookie("fav_machines");
    arr_fav=str_fav.split(',');
    this.listmachines.forEach((m) => {
      m.DescSelect = "Select";
      if (MachineID == m.MachineID)
        m.IsSelected = true;
      else
        m.IsSelected = false;  
        
      if( arr_fav.indexOf(m.MachineID.toString())==-1)
        m.isFavorite =false;        
      else
        m.isFavorite =true;
    });

  }

  OnSelectMachine(mach: Machineheader) {
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
   /*  this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
        dtInstance.destroy();
        this.dtTrigger.next();
    });  */
    this.isLoaded=true;
    this.listmachines =  this.listmachines_sorted;
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
        ((!filter.IsMultiTask && m.MachineType != "Multi task") || filter.IsMultiTask &&
        ((!filter.IsMultiSpindle && m.MachineType != "MultiSpindle") || filter.IsMultiSpindle) &&
        ((!filter.IsSwissType && m.MachineType != "SwissType") || filter.IsSwissType))
        && (m.MachineName.toUpperCase().indexOf(filter.SearchText.toUpperCase()) > -1 || m.AdaptationType.toUpperCase().indexOf(filter.SearchText.toUpperCase()) > -1 
        || m.AdaptationSize.toString().indexOf(filter.SearchText.toUpperCase()) > -1
        || m.Power.toString().indexOf(filter.SearchText.toUpperCase()) > -1
        || m.Torque.toString().indexOf(filter.SearchText.toUpperCase()) > -1
        || m.SpindleSpeed.toString().indexOf(filter.SearchText.toUpperCase()) > -1
        ));
    this.srv_statemanage.SelectMachineFilter = filter;
    this.SortTableData();
    //this.dtTrigger.next();
  }
}

