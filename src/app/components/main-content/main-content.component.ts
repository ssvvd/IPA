import { Component, OnInit } from '@angular/core';
import { AppsettingService} from 'src/app/services/appsetting.service';
@Component({
  selector: 'app-main-content',
  templateUrl: './main-content.component.html',
  styleUrls: ['./main-content.component.scss']
})

export class MainContentComponent implements OnInit { 
 
  constructor(public srv_appsetting:AppsettingService) {}
  public innerWidth: any;
  ngOnInit() {
     this.innerWidth = window.innerWidth;
  }
  
}
