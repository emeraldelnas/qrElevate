import { Component, OnInit, ViewChild } from '@angular/core';
import { DbService } from '@services/db.service';
import { ZXingScannerComponent } from '@zxing/ngx-scanner';
import dayjs, { Dayjs } from 'dayjs';
import { Subscription, Subject, take, takeUntil } from 'rxjs';

@Component({
  selector: 'app-freebie-scanner',
  templateUrl: './freebie-scanner.component.html',
  styleUrls: ['./freebie-scanner.component.scss'],
})
export class FreebieScannerComponent implements OnInit {
  @ViewChild(ZXingScannerComponent) scanner!: ZXingScannerComponent;

  oldResult = '';
  pauseScanner = false;

  showSuccess = false;
  showAlreadyScanned = false;
  showNotAttended = false;

  findAttendee$!: Subscription;
  getRegistrant$!: Subscription;
  attendeeDialog$!: Subscription;

  private ngUnsubscribe = new Subject<void>();

  isBirthdayToday = false;

  constructor(private db: DbService) {}

  ngOnInit(): void {}

  onCodeResult(resultString: string) {
    if (!this.pauseScanner) {
      this.pauseScanner = true;
      if (resultString !== this.oldResult) {
        this.findAttendee$ = this.db
          .findUniteAttendee(resultString)
          .get()
          .pipe(take(1), takeUntil(this.ngUnsubscribe))
          .subscribe((attendee) => {
            this.oldResult = resultString;

            if (attendee.exists) {
              this.db
                .getUniteAttendee(resultString)
                .pipe(take(1), takeUntil(this.ngUnsubscribe))
                .subscribe((attendeeRecord) => {
                  // console.log(attendeeRecord.claimedFood);
                  if (!attendeeRecord.claimedFood) {
                    this.db.attendeeClaimedFood(resultString).then(() => {
                      this.showSuccess = true;
                    });
                  } else {
                    this.showAlreadyScanned = true;
                  }
                });
            } else {
              this.showNotAttended = true;
            }
          });
      } else {
        this.showAlreadyScanned = true;
      }
    }
  }

  hideSuccess(): void {
    this.showSuccess = false;
    this.pauseScanner = false;
  }

  hideAlreadyScanned(): void {
    this.showAlreadyScanned = false;
    this.pauseScanner = false;
  }

  hideNotAttended(): void {
    this.showNotAttended = false;
    this.pauseScanner = false;
  }

  isToday(someDate: Dayjs): boolean {
    const today = dayjs();

    return (
      someDate.get('date') == today.get('date') &&
      someDate.get('month') == today.get('month')
    );
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();

    // this.findAttendee$.unsubscribe();
    // this.getRegistrant$.unsubscribe();
    // this.attendeeDialog$.unsubscribe();
    this.scanner.reset();
  }
}
