import { Component, OnInit } from '@angular/core';
import { DatalayerService} from 'src/app/services/datalayer.service' ;
import { AppsettingService} from 'src/app/services/appsetting.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.scss']
})
export class FeedbackComponent implements OnInit {

  environment=environment;
  Message:string='';
  q1:number=0;
  q2:number=0;

  constructor(private srv_DataLayer:DatalayerService, public srv_appsetting:AppsettingService,
              public activeModal: NgbActiveModal
              ) { }

  ngOnInit(): void {
  }
  
  choise(type:number,answer:number)
  {
    if(type==1)  this.q1=answer;
    if(type==2)  this.q2=answer;
  }

  send()
  { 
    if(this.q1!=0 && this.q2!=0)
    {
      this.srv_DataLayer.addfeedback(this.q1,this.q2,this.Message).subscribe((res:any)=>
      {
        //this.srv_cook.set_cookie("notshowfeedback",'1');
        this.activeModal.close('send'); 
      });      
    }       
  }  

  notshow()
  {
    //this.srv_cook.set_cookie("notshowfeedback",'1');
    this.activeModal.close('send'); 
  }

      
}
