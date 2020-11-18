import { Component, OnInit ,HostListener } from '@angular/core';
import { AppsettingService} from './../../services/appsetting.service';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  host: {
    '[style.height.px]':'innerheight',
    '[style.max-height.px]':'innerheight',
    '[style.min-height.px]':'innerheight'
  }
})
export class HomeComponent implements OnInit {
  
  constructor(private srv_appsetting:AppsettingService)
   { }

  public innerheight: any;
  public innerheightmaincontent:any;
  public msrv_appsetting:AppsettingService;
  ngOnInit() {
    this.msrv_appsetting=this.srv_appsetting;
     /* this.innerheight = window.innerHeight-30; */
     this.innerheightmaincontent= window.innerHeight-140;   
     this.msrv_appsetting.innerheightmaincontent=this.innerheightmaincontent;
     this.msrv_appsetting.innerheightmaincontent1=this.innerheightmaincontent-15;  
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {  
     /*  this.innerheight = window.innerHeight-30; */
      this.innerheightmaincontent= window.innerHeight-140;

      this.msrv_appsetting.innerheightmaincontent=this.innerheightmaincontent;
      this.msrv_appsetting.innerheightmaincontent1=this.innerheightmaincontent-15;
      //alert(this.innerheightmaincontent);
  }
}
