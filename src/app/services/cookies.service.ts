import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})

export class CookiesService {
  //fav_machines: string ='';

  constructor(private srv_cock:CookieService) { }
  
  delete_cookie(name:string)
  {
    if(this.srv_cock.check(name))
    this.srv_cock.delete(name);
  }

  get_cookie(name:string)
  {
    if(this.srv_cock.check(name))
      return this.srv_cock.get(name);
    else
      return "";
  }
  add_fav_machine(id:number)
  {
    
    let id_str:string=id.toString();
    //this.delete_cookie("fav_machines");
    if(!this.srv_cock.check("fav_machines"))
    {
      this.srv_cock.set("fav_machines","");
    }    
    let str_machines=this.srv_cock.get("fav_machines");
    let arr:string[]=[];
    arr=str_machines.split(',');   
    
    if(arr.indexOf(id_str)==-1)    
    {
      arr.push(id_str);
      arr.forEach(pp=>{str_machines = str_machines +pp + ",";} );
      this.srv_cock.set("fav_machines",str_machines);
    }
  }

  remove_fav_machine(id:number)
  {
    let id_str:string=id.toString();
    if(this.srv_cock.check("fav_machines"))
    {
      let str_machines=this.srv_cock.get("fav_machines");
      let arr:string[]=[];
      arr=str_machines.split(','); 
      if( arr.indexOf(id_str)>-1) arr.splice( arr.indexOf(id_str));
      arr.forEach(pp=>{str_machines = str_machines +pp + ",";} );
      this.srv_cock.set("fav_machines",str_machines);
    }    
        
  }
}
