import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParticipantSearchBar } from './participant-search-bar';

describe('ParticipantSearchBar', () => {
  let component: ParticipantSearchBar;
  let fixture: ComponentFixture<ParticipantSearchBar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ParticipantSearchBar]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ParticipantSearchBar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
