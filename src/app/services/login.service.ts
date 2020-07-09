import { Injectable } from '@angular/core';
import { CookiesService } from  'src/app/services/cookies.service' ;
import { DatalayerService} from 'src/app/services/datalayer.service' ;
import { AppsettingService} from 'src/app/services/appsetting.service';
import { User } from 'src/app/models/users/user';
import { Observable,of} from 'rxjs';

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
      //localStorage.setItem('token_login', res);
      window.open(s,'_self');
      return 'ok'    
    });
    return'ok';
  }

  LogIn(token:string):Observable<any>
  { 
    if(token!='')
    {      
      this.srv_DataLayer.login(token).subscribe ((data:any)=>
      {    
        console.log(data);         
        let d=JSON.parse(data);                                                         
        let u:User=
          {
            displayName:d[0].displayName,
            surname: d[0].surname,
            givenName: d[0].givenName,
            email: d[0].email,
            country:d[0].country,
            companyName:d[0].companyName,
            isImc:d[0].isImc}
            localStorage.setItem("displayName",d[0].displayName);
            localStorage.setItem("surname",d[0].surname);
            localStorage.setItem("givenName",d[0].givenName);
            localStorage.setItem("email",d[0].email);
            localStorage.setItem("country",d[0].country);
            localStorage.setItem("companyName",d[0].companyName);
            localStorage.setItem("isImc",d[0].isImc);     
            this.srv_appsetting.User=u;  
            this.srv_appsetting.isLoggedIn=true;               
      });    
      return of('ok');  
    }
    else
    {  
      let u=new User;  
      let displayName:string='';
      let surname:string='';
      let givenName:string='';
      let email:string=''
      let country:string='';
      let companyName:string='';
      let isImc:string='';
      if(localStorage.getItem("displayName")!=null) displayName=localStorage.getItem("displayName");
      if(localStorage.getItem("surname")!=null) surname=localStorage.getItem("surname");
      if(localStorage.getItem("givenName")!=null) givenName=localStorage.getItem("givenName");
      if(localStorage.getItem("email")!=null) email=localStorage.getItem("email");
      if(localStorage.getItem("country")!=null) country=localStorage.getItem("country");
      if(localStorage.getItem("companyName")!=null) companyName=localStorage.getItem("companyName");
      if(localStorage.getItem("isImc")!=null) isImc=localStorage.getItem("isImc");
      u.displayName=displayName;
      u.surname=surname;
      u.givenName=givenName;
      u.email=email;
      u.country=country;
      u.companyName=companyName;
      u.isImc=isImc;
      this.srv_appsetting.User=u;  
      this.srv_appsetting.isLoggedIn=true;     
    } 
    this.srv_appsetting.isLoggedIn=true;       
    return of('ok'); 
  }    
}
