import { Component, OnInit } from '@angular/core';
import { DatalayerService} from 'src/app/services/datalayer.service' ;
import { AppsettingService} from 'src/app/services/appsetting.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PpSuccessfullyComponent} from 'src/app/components/maintenance/pp-successfully/pp-successfully.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { StateManagerService } from 'src/app/services/statemanager.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'contactus',
  templateUrl: './contactus.component.html',
  styleUrls: ['./contactus.component.scss']
})
export class ContactusComponent implements OnInit {

  constructor(private srv_DataLayer:DatalayerService, public srv_appsetting:AppsettingService,public activeModal: NgbActiveModal,
    private modalService: NgbModal,private formBuilder: FormBuilder,private router: Router,private srv_statemanage: StateManagerService) { }
  
  Name:string='';
  Email:string='';
  Country:string='';
  CompanyName:string='';
  Message:string='';

  registerForm: FormGroup;
  submitted = false;

  ngOnInit(): void {
    
  if (this.srv_appsetting.UserID!='')
  {      
    this.Name =this.srv_appsetting.User.displayName;
    this.Email =this.srv_appsetting.User.email;
    this.Country =this.srv_appsetting.User.CountryName;
    this.CompanyName =this.srv_appsetting.User.companyName;
  }

  this.registerForm = this.formBuilder.group({   
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email,Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
    country:[''],
    companyname:[''],
    message:['']
    

  });
  }
  
      // convenience getter for easy access to form fields
  get f() { return this.registerForm.controls; }

  onSubmit()
  { 
    
    this.submitted = true;

        // stop here if form is invalid
    if (this.registerForm.invalid) {
            return;
    }
               
    this.srv_DataLayer.mailsend(this.Name,this.Email,this.Country,this.CompanyName,this.Message).subscribe((res:any)=>
    {
      let resmessage:string;
      if(res=='ok')
        resmessage ="Email send successfully";
      else
      {
        resmessage=res;
        console.log(res);
      }
    }); 
    this.activeModal.close('cancel');    
  }  
}
