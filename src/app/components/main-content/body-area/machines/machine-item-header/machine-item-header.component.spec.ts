import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MachineItemHeaderComponent } from './machine-item-header.component';

describe('MachineItemHeaderComponent', () => {
  let component: MachineItemHeaderComponent;
  let fixture: ComponentFixture<MachineItemHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MachineItemHeaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MachineItemHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
