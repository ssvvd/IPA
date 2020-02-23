import { Component, OnInit, OnDestroy,ViewChild  } from '@angular/core';
import { Machineheader } from 'src/app/models/machines/machineheader';
import { MachineFilter } from 'src/app/models/machines/machinefilter';
import { MachineService } from 'src/app/services/machine.service';
import { StateManagerService } from 'src/app/services/statemanager.service';
import { environment } from 'src/environments/environment';
import { DataTableDirective } from 'angular-datatables';
import { Subject, Subscription } from 'rxjs';

@Component({
  selector: 'app-machines-list',
  templateUrl: './machines-list.component.html',
  styleUrls: ['./machines-list.component.scss']
})

export class MachinesListComponent implements OnInit, OnDestroy {

  @ViewChild(DataTableDirective, {static: false})dtElement: DataTableDirective;
  isDtInitialized:boolean = false;
  
  myVar: any;
  dtOptions: DataTables.Settings = {};
  listmachines: Machineheader[] = [];
  listmachines_sorted: Machineheader[] = [];
  MachineFilter: MachineFilter;
  environment = environment;
  MachineIDSelected = 0;
  datatableElement: DataTableDirective;
  dtTrigger: Subject<any> = new Subject();
  allSubs$: Subscription;
  constructor(private srv_machine: MachineService, private srv_statemanage: StateManagerService) {
  }

  ngOnInit() {
    this.dtOptions = {
      pagingType: 'full_numbers',
      "searching": false,
      "lengthChange": false,
      "paging": false,
    };        

    this.allSubs$ = this.srv_machine.getmachines()
      .subscribe((data: any) => {
        this.listmachines = JSON.parse(data);
        this.listmachines_sorted = this.listmachines;
        this.myMachineSettings();
        this.dtTrigger.next();
      });      
  }

  myMachineSettings() {
    let stfilter: MachineFilter;
    stfilter = this.srv_statemanage.SelectMachineFilter;
    if (typeof (stfilter) !== 'undefined' && stfilter !== null) {
      this.MachineFilter = stfilter;
      this.ApplyFilter(stfilter);
    }
    if (this.srv_statemanage.SelectedMachine == null) {
      this.UpdateStateSelectedMachine(-1);
    }
    else {
      this.UpdateStateSelectedMachine(this.srv_statemanage.SelectedMachine.MachineID);
    }
  }

  ngOnDestroy() {
    this.allSubs$.unsubscribe();
  }

  OnViewMachine(mach: Machineheader) {
    this.srv_statemanage.ViewMachine(mach);   
  }

  UpdateStateSelectedMachine(MachineID: number) {
    this.listmachines.forEach((m) => {
      m.DescSelect = "Select";
      if (MachineID == m.MachineID)
        m.IsSelected = true;
      else
        m.IsSelected = false;
    });
  }

  OnSelectMachine(mach: Machineheader) {
    this.UpdateStateSelectedMachine(mach.MachineID);
    this.srv_statemanage.SelectedMachine = mach;
    this.srv_statemanage.SelectMachineFilter = this.MachineFilter;
  }

  onMachineFilterChanged($event) {  
    this.MachineFilter = $event.filter;
    this.ApplyFilter($event.filter);
    if (this.srv_statemanage.SelectedMachine == null){
      this.UpdateStateSelectedMachine(-1);
      this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
        dtInstance.destroy();
        this.dtTrigger.next();
      });           

    }
    else{
      this.UpdateStateSelectedMachine(this.srv_statemanage.SelectedMachine.MachineID);
      this.isDtInitialized = true
      this.dtTrigger.next();

    }
  }

  onMachineFilterClear() {
    this.listmachines =  this.listmachines_sorted
  }

  ApplyFilter(filter: MachineFilter) {
    this.listmachines = this.listmachines_sorted.filter(
      m => m.SpindleSpeed >= filter.SpeedMin && m.SpindleSpeed <= filter.SpeedMax &&
        m.Power >= filter.PowerMin && m.Power <= filter.PowerMax &&
        m.Torque >= filter.TorqueMin && m.Torque <= filter.TorqueMax &&
        ((!filter.IsMachiningCenter && m.MachineType != "Machining center") || filter.IsMachiningCenter) &&
        ((!filter.IsLathe && m.MachineType != "Lathe") || filter.IsLathe) &&
        ((!filter.IsMultiTask && m.MachineType != "Multi task") || filter.IsMultiTask)
        && (m.MachineName.toUpperCase().indexOf(filter.SearchText.toUpperCase()) > -1
        ));
    this.srv_statemanage.SelectMachineFilter = filter;
  }
}

