import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MatStandardTableComponent } from './mat-standard-table.component';

describe('MatStandardTableComponent', () => {
  let component: MatStandardTableComponent;
  let fixture: ComponentFixture<MatStandardTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MatStandardTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MatStandardTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
