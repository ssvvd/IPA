import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-pp-request-material',
  templateUrl: './pp-request-material.component.html',
  styleUrls: ['./pp-request-material.component.scss']
})
export class PpRequestMaterialComponent implements OnInit {

  registerForm: FormGroup;
  submitted = false;
  subAndValid = false;

  constructor(public activeModal: NgbActiveModal,private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.registerForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      desc: ['', Validators.required],    
      grp: [''],
      stndrd: [''],
      cond: [''],
      hardness: [''],
      manf: ['']
  });
  }

  get f() { return this.registerForm.controls; }
  get k() { return this.registerForm; }

  onSubmit(){
    this.submitted = true;
    
    // stop here if form is invalid
    if (this.registerForm.invalid) {
        return;
    }
    this.subAndValid = true;
    // display form values on success
    alert('SUCCESS!! :-)\n\n' + JSON.stringify(this.registerForm.value, null, 4));
  }

}
