import { Component, OnInit ,Input} from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'machine-pp-add-favorite',
  templateUrl: './machine-pp-add-favorite.component.html',
  styleUrls: ['./machine-pp-add-favorite.component.scss']
})
export class MachinePpAddFavoriteComponent implements OnInit {

  @Input() MachineName:string;
  @Input() IsDelete:boolean;
  Description:string;
 
  MachineNameNew:string;
  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit() {
    this.MachineNameNew= this.MachineName;
    if(this.IsDelete)
      this.Description ='Remove ' + this.MachineName + ' from my machines:';
    else
      this.Description ='Add ' + this.MachineName + ' to my machines:';
  }

  GetName() {    
    if(this.MachineNameNew.replace(/\s/g, "").toUpperCase()!=this.MachineName.replace(/\s/g, "").toUpperCase()) 
      this.activeModal.close(this.MachineNameNew);
  }
}

