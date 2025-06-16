import { Component, OnInit, Renderer2 } from '@angular/core';
import { Attendee, UniteAttendee } from '@models/attendee.model';
import { AttendeesTotals } from '@models/attendeesTotals.model';
import { NbDialogService } from '@nebular/theme';
import { DbService } from '@services/db.service';
import { map, Observable } from 'rxjs';
import { DeletePromptComponent } from 'src/app/shared/components/delete-prompt/delete-prompt.component';

@Component({
  selector: 'app-unite-attendees',
  templateUrl: './unite-attendees.component.html',
  styleUrls: ['./unite-attendees.component.scss'],
})
export class UniteAttendeesComponent implements OnInit {
  eventDate!: Date;
  attendees!: Observable<UniteAttendee[]>;
  totals!: Observable<AttendeesTotals>;
  currentYear = new Date().getFullYear();

  totalAttendees$: Observable<number>;
  totalFirstTimers$: Observable<number>;
  totalMale$: Observable<number>;
  totalFemale$: Observable<number>;
  totalMaleFirstTimers$: Observable<number>;
  totalFemaleFirstTimers$: Observable<number>;

  constructor(private db: DbService, private renderer: Renderer2, private dialogService: NbDialogService) {
    this.attendees = this.db.oGetUniteAttendeesSpecificDay();
    // this.totals = this.db.getUniteDayTotals();

    this.totalAttendees$ = this.attendees.pipe(
      map(attendees => attendees.length)
    );

    this.totalFirstTimers$ = this.attendees.pipe(
      map(attendees => attendees.filter(attendee => attendee.isFirstTimer).length)
    );

    this.totalMale$ = this.attendees.pipe(
      map(attendees => attendees.filter(attendee => attendee.sex === 'male').length)
    );

    this.totalFemale$ = this.attendees.pipe(
      map(attendees => attendees.filter(attendee => attendee.sex === 'female').length)
    );

    this.totalMaleFirstTimers$ = this.attendees.pipe(
      map(attendees => attendees.filter(attendee => attendee.isFirstTimer && attendee.sex === 'male').length)
    );

    this.totalFemaleFirstTimers$ = this.attendees.pipe(
      map(attendees => attendees.filter(attendee => attendee.isFirstTimer && attendee.sex === 'female').length)
    );
  }

  ngOnInit(): void {}

  onEventDateChange(date: Date): void {
    const selectedDay = this.formatDate(date);

    this.attendees = this.db.oGetUniteAttendeesSpecificDay(selectedDay);
    this.totals = this.db.getDayTotals(selectedDay);
  }

  copyMobileToClipboard(phone: number, cellClass: string): void {
    navigator.clipboard.writeText(phone.toString());
    const element = document.getElementById(cellClass);

    this.renderer.addClass(element, 'copied');
  }

  deleteUniteAttendee(attendee: UniteAttendee) {
    let selectedDay = this.formatDate(new Date());

    if(this.eventDate) {
      selectedDay = this.formatDate(this.eventDate);
    }

    this.dialogService.open(DeletePromptComponent)
      .onClose.subscribe(response => {
        if(response) {
          this.db.deleteUniteAttendee(selectedDay, attendee);
        }
      });
  }

  formatDate(date: Date): string {
    const options: Intl.DateTimeFormatOptions = {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    };

    return date.toLocaleDateString('en-us', options);
  }

  identify(index: number, item: any): number {
    return item.created_at;
  }
}
