import { Component, OnInit ,Output,Input,EventEmitter} from '@angular/core';
import { environment } from 'src/environments/environment';
import { MachinesComponent } from 'src/app/components/main-content/body-area/machines/machines.component';
import { MaterialsComponent } from 'src/app/components/main-content/body-area/materials/materials.component';
import { Router, Event, NavigationStart, NavigationEnd, NavigationError } from '@angular/router';

export class MainTab {
  TabID:number;
  Description: string;
  SelectedItemDesc: string;
  ImageURL:string;
  RouteName:string;
  IsSelected:boolean=false;

  constructor(public pTabID: number, public pDescription: string,public pRouteName:string, public pImageURL:string) { 
    this.TabID =pTabID;
    this.Description =pDescription;
    this.RouteName=pRouteName;
    this.ImageURL=pImageURL;   
  }
}

@Component({
  selector: 'app-main-menu',
  templateUrl: './main-menu.component.html',
  styleUrls: ['./main-menu.component.scss']
})

export class MainMenuComponent implements OnInit {

  //@Output() TabSelect = new EventEmitter();
  @Input () RouteSelected :string;

  Tabs:MainTab[]=[];

  constructor(private router: Router) { 
    this.router.events.subscribe((event: Event) => {
            if (event instanceof NavigationStart) {              
                this.TabSelected(event.url);       
                // Show loading indicator
            }

            if (event instanceof NavigationEnd) {
                // Hide loading indicator
            }

            if (event instanceof NavigationError) {
                // Hide loading indicator

                // Present error to user
                console.log(event.error);
            }
        });
  }

  ngOnInit()
  {    
    this.Tabs.push (new MainTab(1,"Machine","/machines", environment.ImagePath + "icon_Machinel.svg"));
    this.Tabs[0].IsSelected=true;
    this.Tabs.push (new MainTab(2,"Material","/material",environment.ImagePath + "icon_Material.svg"));
    this.Tabs.push (new MainTab(3,"Machining Operation","/machining-operation",environment.ImagePath + "icon_MachiningOp.svg"));
    this.Tabs.push (new MainTab(4,"Operational Data","/operation-data",environment.ImagePath +  "icon_OpData.svg"));
    this.Tabs.push (new MainTab(5,"Results","/results",environment.ImagePath + "icon_Resaults.svg")); 
  }
 
   TabSelected(RouteName:string) {       
    this.Tabs.forEach( (obj) => {     
      if(obj.RouteName==RouteName)         
          obj.IsSelected=true;      
      else
       obj.IsSelected=false;
    });
  }  
}
