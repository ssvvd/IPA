import { Component,OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { environment } from 'src/environments/environment';
import cssVars from 'css-vars-ponyfill';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'IscarToolAdvisor';
  environment=environment;
  
  constructor(location: Location, router: Router) {
    if(location.path().toLowerCase() != '/materials'){
      router.navigate(['/home/machines']); 
    }
    else{
      environment.internal = false;
    }
    // console.log(location.path());

  }

ngOnInit(){
  cssVars({
  onlyLegacy: false,
  watch: true,
  onComplete(cssText, styleNode, cssVariables) {
    //console.log(cssText);
  }});
}
}

