import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MatMainTableComponent } from './mat-main-table.component';

describe('MatMainTableComponent', () => {
  let component: MatMainTableComponent;
  let fixture: ComponentFixture<MatMainTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MatMainTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MatMainTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
