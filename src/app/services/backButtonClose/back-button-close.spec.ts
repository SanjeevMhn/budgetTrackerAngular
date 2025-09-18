import { TestBed } from '@angular/core/testing';

import { BackButtonClose } from './back-button-close';

describe('BackButtonClose', () => {
  let service: BackButtonClose;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BackButtonClose);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
