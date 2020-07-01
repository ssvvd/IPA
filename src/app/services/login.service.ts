import { Injectable } from '@angular/core';
import { CookiesService } from  'src/app/services/cookies.service' ;
import { DatalayerService} from 'src/app/services/datalayer.service' ; 
import { User } from 'src/app/models/users/user';

@Injectable({
  providedIn: 'root'
})

export class LoginService {

  constructor(private srv_cook:CookiesService,private srv_DataLayer:DatalayerService) { }
  
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
    if (localStorage.getItem('token_login')!='null')
    {
      this.srv_DataLayer.login(localStorage.getItem('token_login')).subscribe ((r:any)=>
      {
        localStorage.setItem('token_login',null);
        console.log();
      }); 
    }
  }
  

  set_user()
  {
    //todo:
    let u:User=new User;
    u.FirstName ="Sveta";
    u.LastName ="Dubovoy";
    
  }
  

}
