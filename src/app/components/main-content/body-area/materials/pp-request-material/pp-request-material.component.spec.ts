import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PpRequestMaterialComponent } from './pp-request-material.component';

describe('PpRequestMaterialComponent', () => {
  let component: PpRequestMaterialComponent;
  let fixture: ComponentFixture<PpRequestMaterialComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PpRequestMaterialComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PpRequestMaterialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
