import { Component, OnInit } from '@angular/core';
import { DatalayerService} from 'src/app/services/datalayer.service' ;

@Component({
  selector: 'contactus',
  templateUrl: './contactus.component.html',
  styleUrls: ['./contactus.component.scss']
})
export class ContactusComponent implements OnInit {

  constructor(private srv_DataLayer:DatalayerService) { }
  
  Name:string='';
  Email:string='';
  Country:string='';
  CompanyName:string='';
  Message:string='';
  ngOnInit(): void {
  }

  Submit()
  {
     this.srv_DataLayer.mailsend(this.Name,this.Email,this.Country,this.CompanyName,this.Message).subscribe((res:any)=>
    {
      alert(res);
    }); 
    
   /*  this.srv_DataLayer.getcurrencyeciw('ffff').subscribe((res:any)=>
    {
      alert(res);
    }); */
  }
}
