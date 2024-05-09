import { Component, OnInit, Renderer2 } from '@angular/core';
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

  constructor(private db: DbService, private renderer: Renderer2) {
    this.attendees = this.db.oGetUniteAttendeesSpecificDay();
    this.attendees.subscribe(res => console.log(res));
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

  copyMobileToClipboard(phone: number, cellClass: string): void {
    navigator.clipboard.writeText(phone.toString());
    const element = document.getElementById(cellClass);

    this.renderer.addClass(element, 'copied');
  }

  identify(index: number, item: any): number {
    return item.created_at;
  }
}
