import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UniteRaffleEntriesComponent } from './unite-raffle-entries.component';

describe('UniteRaffleEntriesComponent', () => {
  let component: UniteRaffleEntriesComponent;
  let fixture: ComponentFixture<UniteRaffleEntriesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UniteRaffleEntriesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UniteRaffleEntriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
