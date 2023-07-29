import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UniteAttendeesComponent } from './unite-attendees.component';

describe('UniteAttendeesComponent', () => {
  let component: UniteAttendeesComponent;
  let fixture: ComponentFixture<UniteAttendeesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UniteAttendeesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UniteAttendeesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
