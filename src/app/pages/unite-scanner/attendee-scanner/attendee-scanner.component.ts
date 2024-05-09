import { Component, OnInit, ViewChild } from '@angular/core';
import { NbDialogService } from '@nebular/theme';
import { DbService } from '@services/db.service';
import { ZXingScannerComponent } from '@zxing/ngx-scanner';
import dayjs, { Dayjs } from 'dayjs';
import { Subscription, Subject, take, takeUntil } from 'rxjs';
import { AttendeeDialogComponent } from '../attendee-dialog/attendee-dialog.component';

@Component({
  selector: 'app-attendee-scanner',
  templateUrl: './attendee-scanner.component.html',
  styleUrls: ['./attendee-scanner.component.scss'],
})
export class AttendeeScannerComponent implements OnInit {
  @ViewChild(ZXingScannerComponent) scanner!: ZXingScannerComponent;

  oldResult = '';
  pauseScanner = false;
  showAlreadyScanned = false;
  showNotRegistered = false;

  findAttendee$!: Subscription;
  getRegistrant$!: Subscription;
  attendeeDialog$!: Subscription;

  private ngUnsubscribe = new Subject<void>();

  isBirthdayToday = false;

  constructor(private db: DbService, private dialogService: NbDialogService) {}

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

            if (!attendee.exists) {
              this.getRegistrant$ = this.db
                .getUniteRegistrant(resultString)
                .pipe(take(1), takeUntil(this.ngUnsubscribe))
                .subscribe((res) => {
                  if (res.firstName) {
                    const birthdate = dayjs(res.birthdate);
                    const age = dayjs().diff(birthdate, 'year');

                    this.isBirthdayToday = this.isToday(birthdate);

                    this.attendeeDialog$ = this.dialogService
                      .open(AttendeeDialogComponent, {
                        context: {
                          attendee: {
                            ...res,
                            birthdate: birthdate.format('MMM D, YYYY'),
                          },
                          age,
                          isBirthdayToday: this.isBirthdayToday,
                        },
                      })
                      .onClose.subscribe((res) => {
                        this.pauseScanner = false;
                      });

                    const attendee = {
                      age,
                      firstName: res.firstName,
                      lastName: res.lastName,
                      facebookAcc: res.facebookAcc,
                      mobile: res.mobile,
                      sex: res.sex,
                      school: res.school || '',
                      district: res.district || '',
                      ticketNo: res.ticketNo,
                      isFirstTimer: res.isFirstTimer || false,
                      // claimedFood: res.claimedFood,
                    };

                    this.db
                      .addUniteAttendee(resultString, attendee)
                      .then((res) => {
                        this.db.incrementUniteAttendeesTotals(
                          attendee,
                          resultString
                        );
                      });
                  } else {
                    this.showAlreadyScanned = false;
                    this.showNotRegistered = true;
                  }
                });
            } else {
              this.showNotRegistered = false;
              this.showAlreadyScanned = true;
            }
          });
      } else {
        this.showNotRegistered = false;
        this.showAlreadyScanned = true;
      }
    }
  }

  hideAlreadyScanned(): void {
    this.showAlreadyScanned = false;
    this.pauseScanner = false;
  }

  hideNotRegistered(): void {
    this.showNotRegistered = false;
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
