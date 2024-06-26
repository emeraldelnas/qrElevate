import { take, Subscription, Subject, takeUntil, switchMap, tap } from 'rxjs';
import { AttendeeDialogComponent } from './attendee-dialog/attendee-dialog.component';
import { DbService } from '@services/db.service';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NbDialogService } from '@nebular/theme';
import { ZXingScannerComponent } from '@zxing/ngx-scanner';
import dayjs, { Dayjs } from 'dayjs';

@Component({
  selector: 'app-scanner',
  templateUrl: './scanner.component.html',
  styleUrls: ['./scanner.component.scss'],
})
export class ScannerComponent implements OnInit, OnDestroy {
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
          .findAttendee(resultString)
          .get()
          .pipe(take(1), takeUntil(this.ngUnsubscribe))
          .subscribe((attendee) => {
            this.oldResult = resultString;

            if (!attendee.exists) {
              this.getRegistrant$ = this.db
                .getRegistrant(resultString)
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
                      mobile: res.mobile,
                      sex: res.sex,
                      school: res.school || '',
                      invitedBy: res.invitedBy || '',
                      isFirstTimer: res.isFirstTimer,
                    };

                    this.db.addAttendee(resultString, attendee).then((res) => {
                      this.db.incrementAttendeesTotals(attendee, resultString);
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

  // onCodeResult(resultString: string) {
  //   if (!this.pauseScanner) {
  //     this.pauseScanner = true;
  //     if (resultString !== this.oldResult) {
  //       this.findAttendee$ = this.db
  //         .findAttendee(resultString)
  //         .get()
  //         .pipe(
  //           take(1),
  //           takeUntil(this.ngUnsubscribe),
  //           switchMap((attendee) => {
  //             this.oldResult = resultString;
  //             if (!attendee.exists) {
  //               return this.db.getRegistrant(resultString).pipe(
  //                 take(1),
  //                 tap((res) => {
  //                   if (!res.firstName) {
  //                     this.showAlreadyScanned = false;
  //                     this.showNotRegistered = true;
  //                   }
  //                 }),
  //                 switchMap((res) => {
  //                   if (res.firstName) {
  //                     const birthdate = dayjs(res.birthdate);
  //                     const age = dayjs().diff(birthdate, 'year');
  //                     this.isBirthdayToday = this.isToday(birthdate);

  //                     const attendeeData = {
  //                       age,
  //                       firstName: res.firstName,
  //                       lastName: res.lastName,
  //                       sex: res.sex,
  //                       school: res.school || '',
  //                       invitedBy: res.invitedBy || '',
  //                       isFirstTimer: res.isFirstTimer,
  //                     };

  //                     return this.dialogService
  //                       .open(AttendeeDialogComponent, {
  //                         context: {
  //                           attendee: {
  //                             ...res,
  //                             birthdate: birthdate.format('MMM D, YYYY'),
  //                           },
  //                           age,
  //                           isBirthdayToday: this.isBirthdayToday,
  //                         },
  //                       })
  //                       .onClose.pipe(
  //                         tap(() => {
  //                           this.pauseScanner = false;
  //                         }),
  //                         switchMap(() => {
  //                           return this.db.addAttendee(
  //                             resultString,
  //                             attendeeData
  //                           );
  //                         }),
  //                         tap(() => {
  //                           this.db.incrementAttendeesTotals(
  //                             attendeeData,
  //                             resultString
  //                           );
  //                         })
  //                       );
  //                   } else {
  //                     return [];
  //                   }
  //                 })
  //               );
  //             } else {
  //               return [];
  //             }
  //           })
  //         )
  //         .subscribe();
  //     } else {
  //       this.showNotRegistered = false;
  //       this.showAlreadyScanned = true;
  //     }
  //   }
  // }

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

    this.findAttendee$.unsubscribe();
    this.getRegistrant$.unsubscribe();
    this.attendeeDialog$.unsubscribe();
    this.scanner.reset();
  }
}
