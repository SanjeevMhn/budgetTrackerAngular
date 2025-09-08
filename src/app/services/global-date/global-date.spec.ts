import { TestBed } from '@angular/core/testing';

import { GlobalDate } from './global-date';

describe('GlobalDate', () => {
  let service: GlobalDate;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GlobalDate);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
