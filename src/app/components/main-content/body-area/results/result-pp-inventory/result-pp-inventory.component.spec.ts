import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResultPpInventoryComponent } from './result-pp-inventory.component';

describe('ResultPpInventoryComponent', () => {
  let component: ResultPpInventoryComponent;
  let fixture: ComponentFixture<ResultPpInventoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResultPpInventoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResultPpInventoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
