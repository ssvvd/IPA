import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InnerTabsTableComponent } from './inner-tabs-table.component';

describe('InnerTabsTableComponent', () => {
  let component: InnerTabsTableComponent;
  let fixture: ComponentFixture<InnerTabsTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InnerTabsTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InnerTabsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
