import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResultsPdfComponent } from './results-pdf.component';

describe('ResultsPdfComponent', () => {
  let component: ResultsPdfComponent;
  let fixture: ComponentFixture<ResultsPdfComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResultsPdfComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResultsPdfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
