import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TwoFactorAuthPage } from './two-factor-auth-page';

describe('TwoFactorAuthPage', () => {
  let component: TwoFactorAuthPage;
  let fixture: ComponentFixture<TwoFactorAuthPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TwoFactorAuthPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TwoFactorAuthPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
