import { Component, OnInit } from '@angular/core';
import { DbService } from '@services/db.service';
import { take } from 'rxjs';
import { UniteAttendee } from './../../../shared/models/attendee.model';

@Component({
  selector: 'app-unite-raffle-entries',
  templateUrl: './unite-raffle-entries.component.html',
  styleUrls: ['./unite-raffle-entries.component.scss']
})
export class UniteRaffleEntriesComponent implements OnInit {

  userTicketNo = true;
  userName = false;

  eventDate: Date = new Date();

  raffleEntries: string[] = [];
  text = '';

  constructor(private db: DbService) {

  }

  ngOnInit(): void {
  }

  formatDate(date: Date): string {
    const options: Intl.DateTimeFormatOptions = {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    };

    return date.toLocaleDateString('en-us', options);
  }

  toggleTicketNo(e: boolean): void {
    this.userTicketNo = e;
  }

  toggleName(e: boolean): void {
    this.userName = e;
  }

  copyToClipboard(text: string = ''): void {
    navigator.clipboard.writeText(text);
  }

  generateRaffleEntries(): void {
    this.db.oGetUniteAttendeesSpecificDay(this.formatDate(this.eventDate)).pipe(take(1)).subscribe((snapshot: UniteAttendee[]) => {
      const entries = snapshot.map((attendee) => {
        let entry = '';
        if(this.userTicketNo && this.userName) {
          entry = `${attendee.ticketNo} | ${attendee.firstName} ${attendee.lastName}`
        } else if(this.userTicketNo) {
          entry = `${attendee.ticketNo}`
        } else {
          entry = `${attendee.firstName} ${attendee.lastName}`
        }

        return entry;
      });

      this.text = '';
      entries.forEach(entry => {
        this.text += `${entry}\n`
      });
    });
  }
}
