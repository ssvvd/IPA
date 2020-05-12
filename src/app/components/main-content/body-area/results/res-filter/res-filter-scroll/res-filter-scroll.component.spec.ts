import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResFilterScrollComponent } from './res-filter-scroll.component';

describe('ResFilterScrollComponent', () => {
  let component: ResFilterScrollComponent;
  let fixture: ComponentFixture<ResFilterScrollComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResFilterScrollComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResFilterScrollComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
