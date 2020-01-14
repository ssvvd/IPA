
import { InputParameterItem } from 'src/app/models/operational-data/inputparameteritem';
 
export class InputParameterlist
{
   constructor()
   {     
       this.items = [];            
   }

   public items:InputParameterItem[];

   GetItem(name:string) :InputParameterItem
   {                       
      return this.items.find(e=> e.name ==name);
   }

    SetValue(name:string,value:string)
    {
        this.items.find(e=> e.name ==name).value=value;
    }  
}


