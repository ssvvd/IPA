import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'IscarToolAdvisor';

  constructor(location: Location, router: Router) {
    if(location.path().toLowerCase() != '/materials'){
      router.navigate(['/home/machines']); 
    }
    // console.log(location.path());

  }


}

