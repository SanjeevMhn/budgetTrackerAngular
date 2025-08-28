import { TestBed } from '@angular/core/testing';

import { BudgetCheck } from './budget-check';

describe('BudgetCheck', () => {
  let service: BudgetCheck;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BudgetCheck);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
