import { Component, OnInit,Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AppsettingService} from '../../../../../services/appsetting.service';
import { MachineFilter } from '../../../../../models/machines/machinefilter';

@Component({
  selector: 'machines-filter-mobile',
  templateUrl: './machines-filter-mobile.component.html',
  styleUrls: ['./machines-filter-mobile.component.scss']
})
export class MachinesFilterMobileComponent implements OnInit {

  environment=environment;
  constructor(public activeModal: NgbActiveModal,public srv_appsetting:AppsettingService) { }
  
  eventsChangeFavorite: Subject<void> = new Subject<void>();
  eventsChangeMachineList: Subject<number[]> = new Subject<number[]>();
  eventsClearFilterMobile: Subject<void> = new Subject<void>();

  TabActive:number=1;
  @Input() sortfield:string="";
  @Input() sorttype:string="1";

  machFilter:MachineFilter;

  ngOnInit(): void {
  }

  Reset()
  {
    //this.eventsClearFilterMobile.next();
    //this.activeModal.close('cancel');

    let arr:any[]=[];
    arr.push('reset');
    arr.push(this.machFilter);
    this.activeModal.close(arr);
  }

  OpenSort()
  {
    this.TabActive=1;
  }

  OpenFilter()
  {
    this.TabActive=2;
  }

  onMachineFilterChanged($event) 
  { 
    this.machFilter = $event.filter;  
  }

  onMachineFilterClear() {   
  }

  setsort(field,type)
  {
    this.sortfield=field;
    this.sorttype=type;
  }

  Apply()
  {
    let arr:any[]=[];
    arr.push('apply');
    arr.push(this.sortfield) ;  
    arr.push(this.sorttype) ;
    arr.push(this.machFilter);
    this.activeModal.close(arr);
  }
}
