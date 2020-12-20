import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { clsMaterial } from 'src/app/models/materials/material'
import { MaterialService } from 'src/app/services/material.service'
import { AppsettingService} from 'src/app/services/appsetting.service';
import { NgxSpinnerService } from "ngx-spinner"; 

@Component({
  selector: 'app-pp-add-favorit',
  templateUrl: './pp-add-favorit.component.html',
  styleUrls: ['./pp-add-favorit.component.scss']
})
export class PpAddFavoritComponent implements OnInit {

  @Input() modal_group;
  @Input() selectedMat:clsMaterial;
  @Input() edit:boolean;
  favName:string = ''

  constructor(public activeModal: NgbActiveModal,private serv: MaterialService,public srv_appsetting:AppsettingService,private SpinnerService: NgxSpinnerService) { }

  ngOnInit() {
    if (this.edit)
      this.favName = this.selectedMat.FavName
    else
      this.favName = ''
  }



  AddToFav(){
    if (!this.edit){
      this.SpinnerService.show();
      let FavoritName:string = this.modal_group.trim()
      if (this.favName != '')
      FavoritName = FavoritName + '-' +  this.favName 
      //AddMaterialFavorit( userID:string,  ISO:string,  Group:number,  FavoritName:string,  Standard:string,  Condetion:string,  Hardness:number,  HardnessUnits:string,  HardnessOrig:number)
  
      this.serv.AddMaterialFavorit(this.srv_appsetting.UserIDencode || 'HIBAHAWARI',  this.selectedMat.Category,  this.selectedMat.id,  FavoritName, this.selectedMat.Standard || '-',  this.selectedMat.Condition,  this.selectedMat.Hardness,  this.selectedMat.HardnessUnits || 'HB',  this.selectedMat.HardnessOrigin || this.selectedMat.Hardness,this.selectedMat.HardnessHBValue || this.selectedMat.Hardness, this.selectedMat.material || '').subscribe((data: any) => {
        this.SpinnerService.hide();
        this.activeModal.close('GoToMyMaterials')

      }); 
  
      
    }
    else{
      this.SpinnerService.show();
      this.serv.EditMaterialFavorit( this.srv_appsetting.UserIDencode || 'HIBAHAWARI',  this.selectedMat.FavName,  this.favName ,  this.selectedMat.Hardness,  this.selectedMat.HardnessUnits || 'HB',this.selectedMat.HardnessHBValue || this.selectedMat.Hardness).subscribe((data: any) => {
        this.SpinnerService.hide();
        this.activeModal.close('refresh')
      });
  
    }

  }

  Delete(){
    this.SpinnerService.show();
    this.serv.DeleteMaterialFavorit( this.srv_appsetting.UserIDencode || 'HIBAHAWARI',  this.selectedMat.FavName).subscribe((data: any) => {
      this.SpinnerService.hide();
      this.activeModal.close('refresh')
    });
    
  }

}
