import { TestBed } from '@angular/core/testing';

import { RolecreationService } from './rolecreation.service';

describe('RolecreationService', () => {
  let service: RolecreationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RolecreationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
