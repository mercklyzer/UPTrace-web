import { TestBed } from '@angular/core/testing';

import { HeloGuardService } from './helo-guard.service';

describe('HeloGuardService', () => {
  let service: HeloGuardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HeloGuardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
