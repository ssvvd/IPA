import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { MaterialService } from 'src/app/services/material.service';
import { clsMaterial } from 'src/app/models/materials/material';
import { HardnessSliderComponent } from 'src/app/components/main-content/body-area/materials/hardness-slider/hardness-slider.component';

@Component({
  selector: 'app-pp-request-material',
  templateUrl: './pp-request-material.component.html',
  styleUrls: ['./pp-request-material.component.scss']
})
export class PpRequestMaterialComponent implements OnInit {

  @ViewChild(HardnessSliderComponent,{ static: true }) slider: HardnessSliderComponent ; 
  registerForm: FormGroup;
  submitted = false;
  subAndValid = false;
  environment= environment;
  matStandard:string[]=[];
  ddlCondition:clsMaterial[]=[];
  materialsResult:clsMaterial[]=[];

  constructor(public activeModal: NgbActiveModal,private formBuilder: FormBuilder,private serv: MaterialService) { }

  ngOnInit() {
    this.slider.setInetialParameters(0,225,225);
    this.registerForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      desc: ['', Validators.required],    
      grp: [''],
      stndrd: [''],
      cond: [''],
      hardness: [''],
      manf: ['']
  });

  this.fillMainTable();
  this.fillStandard();
  //fill group
  //fill condetion
  }

  get f() { return this.registerForm.controls; }
  get k() { return this.registerForm; }

  fillStandard(){
    this.serv.getmaterialstandard().subscribe((res:any)=>{
      this.matStandard=JSON.parse(res);})
  }

  fillMainTable(){
    
    this.serv.getmaterialsbygrp('EN','').subscribe((res:any)=>{
      this.materialsResult=JSON.parse(res);

      this.ddlCondition = this.materialsResult.filter((obj, pos, arr) => {
        return arr.map(mapObj => mapObj.Condition).indexOf(obj.Condition) === pos;
    }).sort((a, b) => a.Condition.localeCompare(b.Condition));

    })
  }

  onSubmit(){
    this.submitted = true;
    
    // stop here if form is invalid
    if (this.registerForm.invalid) {
        return;
    }
    this.subAndValid = true;
    let cur_hb_hardness = this.slider.getCurValue();//if not zero then the value is avilable.
    // display form values on success
    // alert('SUCCESS!! :-)\n\n' + JSON.stringify(this.registerForm.value, null, 4));
  }

}
