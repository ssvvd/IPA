import { Injectable } from '@angular/core';
import { CookiesService } from  'src/app/services/cookies.service' ;
import { DatalayerService} from 'src/app/services/datalayer.service' ;
import { AppsettingService} from 'src/app/services/appsetting.service';
import { User } from 'src/app/models/users/user';

@Injectable({
  providedIn: 'root'
})

export class LoginService {

  constructor(private srv_cook:CookiesService,private srv_DataLayer:DatalayerService,
              private srv_appsetting:AppsettingService,) { }
  
  GetToken():any
  {
    this.srv_DataLayer.get_token().subscribe((res: any)=>{
      let s='https://sign.ssl.imc-companies.com/signin?t=' +res;
      localStorage.setItem('token_login', res);
      window.open(s,'_self');
      return 'ok'    
    });
    return'ok';
  }

  LogIn()
  { 
    let userFN:string='';
    let userLN:string='';
    let usermail:string='';
    let country:string='';
    if(localStorage.getItem("userFN")!='null') userFN=localStorage.getItem("userFN");
    if(localStorage.getItem("userLN")!='null') userLN=localStorage.getItem("userLN");
    if(localStorage.getItem("usermail")!='null') usermail=localStorage.getItem("usermail");
    if(localStorage.getItem("country")!='null') country=localStorage.getItem("country");

    if (localStorage.getItem('token_login')!='null')
    {
      this.srv_DataLayer.login(localStorage.getItem('token_login')).subscribe ((r:any)=>
      {
        let u:User=new User;
        //todo:
        u.FirstName ="Sveta";
        u.LastName ="Dubovoy";
        u.Email ="svetlanad@iscar.co.il"
        this.srv_appsetting.User=u;
        localStorage.setItem('token_login',null);
        console.log();
      }); 
    }      
  }  

}
