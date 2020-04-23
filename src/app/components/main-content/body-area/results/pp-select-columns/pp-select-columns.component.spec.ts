import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PpSelectColumnsComponent } from './pp-select-columns.component';

describe('PpSelectColumnsComponent', () => {
  let component: PpSelectColumnsComponent;
  let fixture: ComponentFixture<PpSelectColumnsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PpSelectColumnsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PpSelectColumnsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
