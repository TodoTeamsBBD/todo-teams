import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateTeamForm } from './create-team-form';

describe('CreateTeamForm', () => {
  let component: CreateTeamForm;
  let fixture: ComponentFixture<CreateTeamForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateTeamForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateTeamForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
