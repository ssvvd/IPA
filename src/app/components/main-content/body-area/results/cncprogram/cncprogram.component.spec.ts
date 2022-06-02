import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CncprogramComponent } from './cncprogram.component';

describe('CncprogramComponent', () => {
  let component: CncprogramComponent;
  let fixture: ComponentFixture<CncprogramComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CncprogramComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CncprogramComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
