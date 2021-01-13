import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BrowersComponent } from './browers.component';

describe('BrowersComponent', () => {
  let component: BrowersComponent;
  let fixture: ComponentFixture<BrowersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BrowersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BrowersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
