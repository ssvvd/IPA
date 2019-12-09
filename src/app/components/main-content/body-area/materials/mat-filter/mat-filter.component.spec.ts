import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MatFilterComponent } from './mat-filter.component';

describe('MatFilterComponent', () => {
  let component: MatFilterComponent;
  let fixture: ComponentFixture<MatFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MatFilterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MatFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
