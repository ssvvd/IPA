import { TestBed } from '@angular/core/testing';

import { StatemanagerService } from './statemanager.service';

describe('StatemanagerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: StatemanagerService = TestBed.get(StatemanagerService);
    expect(service).toBeTruthy();
  });
});
