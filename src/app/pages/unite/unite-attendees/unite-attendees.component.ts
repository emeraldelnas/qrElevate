import { Component, OnInit } from '@angular/core';
import { Attendee, UniteAttendee } from '@models/attendee.model';
import { AttendeesTotals } from '@models/attendeesTotals.model';
import { DbService } from '@services/db.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-unite-attendees',
  templateUrl: './unite-attendees.component.html',
  styleUrls: ['./unite-attendees.component.scss'],
})
export class UniteAttendeesComponent implements OnInit {
  eventDate!: Date;
  attendees!: Observable<UniteAttendee[]>;
  totals!: Observable<AttendeesTotals>;

  constructor(private db: DbService) {
    this.attendees = this.db.oGetUniteAttendeesSpecificDay();
    this.totals = this.db.getUniteDayTotals();
  }

  ngOnInit(): void {}

  onEventDateChange(e: Date): void {
    const options: Intl.DateTimeFormatOptions = {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    };

    const selectedDay = e.toLocaleDateString('en-us', options);

    this.attendees = this.db.oGetUniteAttendeesSpecificDay(selectedDay);
    this.totals = this.db.getDayTotals(selectedDay);
  }

  identify(index: number, item: any): number {
    return item.created_at;
  }
}
