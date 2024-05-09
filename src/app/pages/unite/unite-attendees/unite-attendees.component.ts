import { Component, OnInit, Renderer2 } from '@angular/core';
import { Attendee, UniteAttendee } from '@models/attendee.model';
import { AttendeesTotals } from '@models/attendeesTotals.model';
import { NbDialogService } from '@nebular/theme';
import { DbService } from '@services/db.service';
import { Observable } from 'rxjs';
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

  constructor(private db: DbService, private renderer: Renderer2, private dialogService: NbDialogService) {
    this.attendees = this.db.oGetUniteAttendeesSpecificDay();
    this.totals = this.db.getUniteDayTotals();
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
