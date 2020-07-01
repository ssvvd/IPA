import { Injectable } from '@angular/core';
import { CookiesService } from  'src/app/services/cookies.service' ; 
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})

export class LoginService {

  constructor(private srv_cook:CookiesService) { }

  set_user()
  {
    //todo:
    let u:User=new User;
    u.FirstName ="Sveta";
    u.LastName ="Dubovoy";
    
  }
  
  LogIn()
  {
    
  }
  

}
