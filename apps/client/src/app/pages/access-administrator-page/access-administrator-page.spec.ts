import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccessAdministratorPage } from './access-administrator-page';

describe('AccessAdministratorPage', () => {
  let component: AccessAdministratorPage;
  let fixture: ComponentFixture<AccessAdministratorPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccessAdministratorPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AccessAdministratorPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
