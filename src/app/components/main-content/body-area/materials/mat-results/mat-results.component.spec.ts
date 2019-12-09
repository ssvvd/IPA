import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MatResultsComponent } from './mat-results.component';

describe('MatResultsComponent', () => {
  let component: MatResultsComponent;
  let fixture: ComponentFixture<MatResultsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MatResultsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MatResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
