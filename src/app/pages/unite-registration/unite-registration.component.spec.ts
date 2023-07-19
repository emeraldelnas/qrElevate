import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UniteRegistrationComponent } from './unite-registration.component';

describe('UniteRegistrationComponent', () => {
  let component: UniteRegistrationComponent;
  let fixture: ComponentFixture<UniteRegistrationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UniteRegistrationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UniteRegistrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
