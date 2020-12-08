import { Component, OnInit ,ChangeDetectorRef, Output, EventEmitter, Input, ViewChildren, QueryList } from '@angular/core';
import { StateManagerService } from 'src/app/services/statemanager.service';
import { AppsettingService} from 'src/app/services/appsetting.service';
import { Subject } from 'rxjs';
import {ResFilterListComponent} from 'src/app/components/main-content/body-area/results/res-filter/res-filter-list/res-filter-list.component';
import { Options } from 'ng5-slider';

@Component({
  selector: 'app-res-filter',
  templateUrl: './res-filter.component.html',
  styleUrls: ['./res-filter.component.scss']
})
export class ResFilterComponent implements OnInit {
  
  @ViewChildren('filterList') 
    allFilterLists: QueryList<ResFilterListComponent>
    
  TD_IT_SolidTool:boolean;
  TD_IT_SolidHead:boolean;
  TD_IT_InsertTool:boolean;
  TD_IT_InsertHead:boolean;
  TypeFeed:string;
  TypeFeedDisabled:boolean;
  sortBy:string;
  filterBy:string;
  mainApp:string;
  public isCollapsed = true;
  // filterFields : Map<string, string[]> = new Map<string, string[]>();

  @Input() helpArr;
  @Output() filterEvent = new EventEmitter<any>();

  eventsSubject: Subject<void> = new Subject<void>();
  
  constructor(public srv_StMng:StateManagerService,private cdRef:ChangeDetectorRef,public srv_appsetting:AppsettingService) { }

  ngOnInit() {

    this.sortBy = "SortRec"
    this.filterBy = "FilterRec"

    if(this.srv_StMng.IPL.GetItem('TD_FASTFEED').value=='True'&& this.srv_StMng.IPL.GetItem('TD_REGULAR').value=='True')        
    {this.TypeFeed="BothFeed";     this.TypeFeedDisabled = false;}
  else             
      if (this.srv_StMng.IPL.GetItem('TD_FASTFEED').value=='True') 
        {this.TypeFeed="HightFeed"; this.TypeFeedDisabled = true;}
      else 
        {this.TypeFeed="NormalFeed"; this.TypeFeedDisabled = true;}  

    this.TD_IT_SolidTool=(this.srv_StMng.IPL.GetItem('TD_IT_SolidTool').value == 'True')
    this.TD_IT_SolidHead=(this.srv_StMng.IPL.GetItem('TD_IT_SolidHead').value == 'True')
    this.TD_IT_InsertTool=(this.srv_StMng.IPL.GetItem('TD_IT_InsertTool').value == 'True')
    this.TD_IT_InsertHead=(this.srv_StMng.IPL.GetItem('TD_IT_InsertHead').value == 'True')

    this.mainApp =  this.srv_StMng.SecAppSelected.MainApp;
  }


  change2(field:boolean,control:string):boolean
  {      
        let Res:boolean = field
        if(this.TD_IT_SolidTool==false && this.TD_IT_SolidHead==false && this.TD_IT_InsertTool==false && this.TD_IT_InsertHead==false){
          this.cdRef.detectChanges();
          Res =  true;
        }        
        else{
          this.filterEvent.emit({control,Res})
        }        
          return Res;
             
  }

  change(control:string,Res:string){
    this.filterEvent.emit({control,Res})
  }

  changeList(outPut){
    this.filterEvent.emit({control:outPut.control,Res:outPut.Res})
  }

  changeScroll(outPut){
    this.filterEvent.emit({control:outPut.control,Res:outPut.Res})
  }
  getListFields(filedName:string):string[]{
    let res:string[]
     let allValues:string[] = []

    let m = this.helpArr.map(a => a[filedName])

    m.forEach((cell) => {cell.forEach((value) => { 
      if ((!allValues.some(k=> (k === value))) && (value)) 
      {
        allValues.push(value)
       } 
      })})

     res = allValues.sort((one, two) => (one < two ? -1 : 1));


     let listControl = this.allFilterLists.find(list => list.controlName === filedName); 
      listControl.arrlistFields = res;
      listControl.arrlistFieldsAll = res;
      if(res.length <6) 
      {
        listControl.max_row_show =res.length;
        listControl.show_more = false;
      }
      else
      {
        listControl.max_row_show = 5;
        listControl.show_more = true;
      } 
    //  this.filterFields.set(filedName , res);

    return res;
  }

  getMin(filedName:string){
    if (this.helpArr.length > 0)
        return Math.min.apply(Math,this.helpArr.map(a => a[filedName]).filter(function(val) { if(typeof val ==='number' || typeof val ==='string'){return val;} }))
    else
      return null
  }

  getMax(filedName:string){
    if (this.helpArr.length > 0)
    return Math.max.apply(Math,this.helpArr.map(a => a[filedName]).filter(function(val) { if(typeof val ==='number' || typeof val ==='string'){return val;} }))
else
  return null
  }

  getOptions(filedName:string,step:number){
    let _options: Options = {
      floor: Math.min(this.helpArr.map(a => a[filedName])),
      ceil:  Math.max(this.helpArr.map(a => a[filedName])),
      step: step,
      showTicks: false
    };

    return _options;
  }

  ClearDataChild()
  {
    this.ngOnInit()
    this.filterEvent.emit({control:'ClearAll',Res:''})
    this.eventsSubject.next();
  }


  checkItem(value:string, event:boolean, controlName:string, timer: number = 0)
  {

    let checked:string;
    if (event)
      checked = "T"
    else
      checked = "F"

    
    setTimeout(() => {
      this.filterEvent.emit({control:'filterList',Res:[controlName,value,checked]});
    }, timer)
         
  }

}
