import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserAuthForm } from './user-auth-form';

describe('UserAuthForm', () => {
  let component: UserAuthForm;
  let fixture: ComponentFixture<UserAuthForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserAuthForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserAuthForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
