import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MachiningOperationComponent } from './machining-operation.component';

describe('MachiningOperationComponent', () => {
  let component: MachiningOperationComponent;
  let fixture: ComponentFixture<MachiningOperationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MachiningOperationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MachiningOperationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
