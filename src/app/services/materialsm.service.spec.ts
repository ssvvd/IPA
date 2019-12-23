import { TestBed } from '@angular/core/testing';

import { MaterialsmService } from './materialsm.service';

describe('MaterialsmService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MaterialsmService = TestBed.get(MaterialsmService);
    expect(service).toBeTruthy();
  });
});
