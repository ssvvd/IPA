import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MachinesPpLoginComponent } from './machines-pp-login.component';

describe('MachinesPpLoginComponent', () => {
  let component: MachinesPpLoginComponent;
  let fixture: ComponentFixture<MachinesPpLoginComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MachinesPpLoginComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MachinesPpLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
