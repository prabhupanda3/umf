import { TestBed } from '@angular/core/testing';

import { DataShairingService } from './data-shairing.service';

describe('DataShairingService', () => {
  let service: DataShairingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DataShairingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
