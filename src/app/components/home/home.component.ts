import { Component, OnInit ,HostListener } from '@angular/core';

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

  constructor() { }

  public innerheight: any;
  public innerheightmaincontent:any;
  ngOnInit() {
     this.innerheight = window.innerHeight-30;
     this.innerheightmaincontent= window.innerHeight-140;    
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {  
      this.innerheight = window.innerHeight-30;
      this.innerheightmaincontent= window.innerHeight-140;
  }
}
