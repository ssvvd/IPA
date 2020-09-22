import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResultItemInfoComponent } from './result-item-info.component';

describe('ResultItemInfoComponent', () => {
  let component: ResultItemInfoComponent;
  let fixture: ComponentFixture<ResultItemInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResultItemInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResultItemInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
