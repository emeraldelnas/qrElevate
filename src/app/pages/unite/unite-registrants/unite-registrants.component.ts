import { Component, OnInit, Renderer2 } from '@angular/core';
import { UniteRegistrant } from '@models/registrant.model';
import { NbDialogService } from '@nebular/theme';
import { DbService } from '@services/db.service';
import { Observable, tap } from 'rxjs';
import { DeletePromptComponent } from 'src/app/shared/components/delete-prompt/delete-prompt.component';

@Component({
  selector: 'app-unite-registrants',
  templateUrl: './unite-registrants.component.html',
  styleUrls: ['./unite-registrants.component.scss'],
})
export class UniteRegistrantsComponent implements OnInit {
  registrants!: Observable<UniteRegistrant[]>;

  eventDate!: Date;

  constructor(private db: DbService, private renderer: Renderer2, private dialogService: NbDialogService) {
    this.registrants = this.db.oGetUniteRegistrants();
  }

  ngOnInit(): void {}

  identify(index: number, item: any): number {
    return item.created_at;
  }

  copyMobileToClipboard(phone: number, cellClass: string): void {
    navigator.clipboard.writeText(phone.toString());
    const element = document.getElementById(cellClass);

    this.renderer.addClass(element, 'copied');
  }

  copyToClipboard(text: string = '', cellClass: string): void {
    navigator.clipboard.writeText(text);
    const element = document.getElementById(cellClass);

    this.renderer.addClass(element, 'copied');
  }

  onEventDateChange(date: Date): void {
    // const options: Intl.DateTimeFormatOptions = {
    //   month: 'long',
    //   day: 'numeric',
    //   year: 'numeric',
    // };

    // const selectedDay = e.toLocaleDateString('en-us', options);

    // this.attendees = this.db.oGetUniteAttendeesSpecificDay(selectedDay);
    // this.totals = this.db.getDayTotals(selectedDay);

    this.registrants = this.db.oGetUniteRegistrants(date);
  }

  deleteUniteRegistrant(registrant: UniteRegistrant) {
    this.dialogService.open(DeletePromptComponent)
      .onClose.subscribe(response => {
        if(response) {
          this.db.deleteUniteRegistrant(registrant);
        }
      });

    }
}
