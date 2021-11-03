import { TestBed } from '@angular/core/testing';

import { UphsGuardService } from './uphs-guard.service';

describe('UphsGuardService', () => {
  let service: UphsGuardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UphsGuardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
