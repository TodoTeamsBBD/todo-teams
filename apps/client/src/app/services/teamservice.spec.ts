import { TestBed } from '@angular/core/testing';

import { Teamservice } from './teamservice';

describe('Teamservice', () => {
  let service: Teamservice;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Teamservice);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
