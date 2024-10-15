import { TestBed } from '@angular/core/testing';

import { TokenSericeService } from './token-serice.service';

describe('TokenSericeService', () => {
  let service: TokenSericeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TokenSericeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
