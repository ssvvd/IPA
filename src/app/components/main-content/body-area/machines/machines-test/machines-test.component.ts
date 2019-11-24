import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'machines-test',
  templateUrl: 'machines-test.component.html'
})
export class MachinesTestComponent implements OnInit {
  dtOptions: DataTables.Settings = {};

  ngOnInit(): void {
    this.dtOptions = {
      pagingType: 'full_numbers',
       "searching": false,
       "lengthChange": false
    };
  }
}