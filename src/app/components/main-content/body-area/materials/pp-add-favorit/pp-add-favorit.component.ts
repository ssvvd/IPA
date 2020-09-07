import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { clsMaterial } from 'src/app/models/materials/material'
import { MaterialService } from 'src/app/services/material.service'
import { AppsettingService} from 'src/app/services/appsetting.service';

@Component({
  selector: 'app-pp-add-favorit',
  templateUrl: './pp-add-favorit.component.html',
  styleUrls: ['./pp-add-favorit.component.scss']
})
export class PpAddFavoritComponent implements OnInit {

  @Input() modal_group;
  @Input() selectedMat:clsMaterial;
  favName:string = ''

  constructor(public activeModal: NgbActiveModal,private serv: MaterialService,public srv_appsetting:AppsettingService) { }

  ngOnInit() {
    this.favName = ''
  }



  AddToFav(){
    let FavoritName:string = this.modal_group
    if (this.favName != '')
    FavoritName = this.favName + '-' + FavoritName
    //AddMaterialFavorit( userID:string,  ISO:string,  Group:number,  FavoritName:string,  Standard:string,  Condetion:string,  Hardness:number,  HardnessUnits:string,  HardnessOrig:number)

    this.serv.AddMaterialFavorit(this.srv_appsetting.UserID || 'HIBAHAWARI',  this.selectedMat.Category,  this.selectedMat.id,  FavoritName, this.selectedMat.Standard || '-',  this.selectedMat.Condition,  this.selectedMat.Hardness,  this.selectedMat.HardnessUnits || 'HB',  this.selectedMat.HardnessOrigin || this.selectedMat.Hardness,this.selectedMat.HardnessHBValue || this.selectedMat.Hardness, this.selectedMat.material || '').subscribe((data: any) => {}); 

    this.activeModal.close()
  }

}
