import { Component, OnInit, Input, OnChanges, Output, EventEmitter } from '@angular/core';
import { AppsettingService} from 'src/app/services/appsetting.service';
import { Options , ChangeContext} from 'ng5-slider';
import { Observable, Subject, Subscription } from 'rxjs';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/switchMap';

@Component({
  selector: 'res-filter-scroll',
  templateUrl: './res-filter-scroll.component.html',
  styleUrls: ['./res-filter-scroll.component.scss']
})
export class ResFilterScrollComponent implements OnInit, OnChanges {

  @Output("change") change: EventEmitter<any> = new EventEmitter();

  @Input() prm:string;
  @Input() prmDesc:string;
  @Input() minValue:number;
  @Input() maxValue:number;
  @Input() step:number;
  @Input() controlName:string;
  @Input() events: Observable<void>;
  notInit:boolean

  textBoxMin:number;
  textBoxMax:number;

  termMin$ = new Subject<number>();
  termMax$ = new Subject<number>();
  private eventsSubscription: Subscription=new Subscription();
  isHidden:boolean
  constructor(public srv_appsetting:AppsettingService) { 

    this.termMin$
      .debounceTime(500)
      .distinctUntilChanged()
      .subscribe(term => {this.textBoxMin = term
        this.change.emit({control:'scrolList',Res:[this.controlName,this.textBoxMin,this.textBoxMax]});
      });
 

      this.termMax$
      .debounceTime(500)
      .distinctUntilChanged()
      .subscribe(term => {this.textBoxMax = term
        this.change.emit({control:'scrolList',Res:[this.controlName,this.textBoxMin,this.textBoxMax]});
      });
  
  }

  // _options: Options = {
  //   floor: this.minValue,
  //   ceil:  this.maxValue,
  //   step: this.step,
  //   showTicks: false
  // };
  options: Options = { floor: 0, ceil: 250 }; 
  ngOnInit() {
    this.eventsSubscription.add(this.events.subscribe(() => this.ClearData()));
    this.notInit = true
    this.isHidden = true
    // const newOptions: Options = Object.assign({}, this._options);
    // newOptions.floor = this.minValue;
    // newOptions.ceil = this.maxValue;
    // newOptions.step = this.step;
    // this._options = newOptions;
  }

  ngOnChanges() {
if (this.minValue && this.maxValue && this.step && this.notInit && (this.minValue != this.maxValue) && isFinite(this.minValue) && isFinite(this.maxValue)){
  this.isHidden = false
  this.notInit = false
  this.textBoxMin = JSON.parse(JSON.stringify(this.minValue));
  this.textBoxMax = JSON.parse(JSON.stringify(this.maxValue));
      const newOptions: Options = Object.assign({}, this.options);
    newOptions.floor = this.minValue;
    newOptions.ceil = this.maxValue;
    newOptions.step = this.step;
    this.options = newOptions;
}
  }


  onUserChangeEnd(changeContext: ChangeContext): void {
    this.change.emit({control:'scrolList',Res:[this.controlName,changeContext.value,changeContext.highValue]});
  }

 
  ngOnDestroy() {
    this.eventsSubscription.unsubscribe();
  }

  ClearData()
  {
    this.textBoxMin = JSON.parse(JSON.stringify(this.minValue));
    this.textBoxMax = JSON.parse(JSON.stringify(this.maxValue));
  }

}
