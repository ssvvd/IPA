import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResFilterListComponent } from './res-filter-list.component';

describe('ResFilterListComponent', () => {
  let component: ResFilterListComponent;
  let fixture: ComponentFixture<ResFilterListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResFilterListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResFilterListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
