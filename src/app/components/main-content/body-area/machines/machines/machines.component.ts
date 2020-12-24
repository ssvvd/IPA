import { Component, OnInit } from '@angular/core';
import { AppsettingService} from '../../../../../services/appsetting.service';

@Component({
  selector: 'machines',
  templateUrl: './machines.component.html',
  styleUrls: ['./machines.component.scss']
})
export class MachinesComponent implements OnInit {

  constructor(public srv_appsetting:AppsettingService) { }

  ngOnInit(): void {
  }

}
