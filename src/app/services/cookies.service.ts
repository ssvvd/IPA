import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class CookiesService {
  
  private obsMachineFavorite =new BehaviorSubject<string[]>([]);
  MachineFavorite = this.obsMachineFavorite.asObservable();   
  
  constructor(private srv_cock:CookieService) { }
  
  public delete_all()
  {
    this.srv_cock.deleteAll('/');
  }

  public delete_cookie(name:string)
  {
    if(this.srv_cock.check(name))
      this.srv_cock.delete(name,'/');
      this.srv_cock.set(name, '', new Date("Thu, 01 Jan 1970 00:00:01 GMT"));    
  }
  
  public get_cookielist(name:string):string[]
  {
    if(this.srv_cock.check(name))
      //return this.srv_cock.get(name);
      return this.srv_cock.get(name).split('**');
    else
      return [];
  }

  public get_cookie(name:string)
  {
    if(this.srv_cock.check(name))
      return this.srv_cock.get(name);
    else
      return "";
  }

  public set_cookie(name:string,value:string)
  {
    if(name=="notshowfeedback")
      this.srv_cock.set(name,value,365);
    else
      this.srv_cock.set(name,value);  
  }

/*   add_fav_machine(id:number)
  {        
    this.add_item_to_cookielist("fav_machines",id.toString()); 
    this.obsMachineFavorite.next(this.get_cookielist("fav_machines")); 
  } */

/*   remove_fav_machine(id:number)
  {
    this.remove_item_from_cookielist("fav_machines",id.toString()); 
    this.obsMachineFavorite.next(this.get_cookielist("fav_machines"));         
  } */

  add_item_to_cookielist(name,id:string)
  {        
    if(!this.srv_cock.check(name))
    {
      this.srv_cock.set(name,"");
    }    
    let str_val=this.srv_cock.get(name);
    let arr:string[]=[];
    if(str_val!='') arr=str_val.split('**');
           
    if(arr.indexOf(id)==-1)    
    {
      if(id!='')
      {
        str_val='';
        arr.push(id);
        arr.forEach(pp=>{str_val = str_val  + pp + '**';} );          
        if(str_val.substr(0,2)=='**') str_val=str_val.substr(2);
        if(str_val.substr(str_val.length-2)=='**') str_val=str_val.substr(0,str_val.length-2);
        this.srv_cock.set(name,str_val);
      }
    }     
  }

  remove_item_from_cookielist(name,id:string)
  {   
    if(this.srv_cock.check(name))
    {
      let str_val=this.srv_cock.get(name);
      let arr:string[]=[];
      arr=str_val.split('**'); 

      let updatedarr:string []= [];
      for (let el of arr) {
        if (el !== id) {
          updatedarr.push(el);
        }
      }
      arr = updatedarr;  
      str_val='';   
      arr.forEach(pp=>{str_val = str_val + pp +'**' ;} );
      if(str_val.substr(0,2)=='**') str_val=str_val.substr(2);
      if(str_val.substr(str_val.length-2)=='**') str_val=str_val.substr(0,str_val.length-2);
      this.srv_cock.set(name,str_val);    
    }            
  }

}
