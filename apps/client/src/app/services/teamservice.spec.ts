import { TestBed } from '@angular/core/testing';

import { TeamService } from './teamservice';

describe('Teamservice', () => {
  let service: TeamService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TeamService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
