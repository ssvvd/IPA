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
        this.MailSendFeedback();
        this.activeModal.close('send'); 
      });      
    }       
  }  

  notshow()
  {
    this.activeModal.close('send'); 
  }

  MailSendFeedback()
  {    
    let a1="Did you receive relevant result : " + (this.q1==1?'green': this.q1==2? 'blue' :'red') + "\n";
    let a2= "Are you satisfied with the new Ingersoll Performance Advisor : " + (this.q2==1?'green': this.q2==2? 'blue' :'red') + "\n";
 
  if(this.Message!='')  
     this.srv_DataLayer.mailsendfeedback(this.srv_appsetting.Country.CountryName,a1,a2,this.Message).subscribe((res:any)=>
    {
    let resmessage:string;
    if(res=='ok')
      resmessage ="Email send successfully";
    else
    {
      resmessage=res;      
    }
  }); 
  }
    
}
