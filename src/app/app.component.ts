import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'IscarToolAdvisor';
  
  constructor(router:Router) {
    router.navigate(['/machines']); 
  }
}

