import { AttendeesTotals } from '@models/attendeesTotals.model';
import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreDocument,
  DocumentData,
} from '@angular/fire/compat/firestore';
import {
  AngularFireStorage,
  AngularFireUploadTask,
} from '@angular/fire/compat/storage';
import { Attendee, UniteAttendee } from '@models/attendee.model';
import { Registrant, UniteRegistrant } from '@models/registrant.model';
import firebase from 'firebase/compat/app';
import { lastValueFrom, map, Observable, take } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DbService {
  private currentDay!: string;
  private timestamp!: firebase.firestore.FieldValue;
  // public registrants!: Observable<Registrant[]>;
  // public attendees!: Observable<Attendee[]>;

  uploadPercent!: Observable<number>;
  downloadUrl!: Observable<string>;

  isUniteDayExistChecked = false;

  constructor(
    private afs: AngularFirestore,
    private storage: AngularFireStorage
  ) {
    this.timestamp = firebase.firestore.FieldValue.serverTimestamp();

    const today = new Date();
    const options: Intl.DateTimeFormatOptions = {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    };

    this.currentDay = today.toLocaleDateString('en-us', options);

    // this.registrants = this.oGetRegistrants();
    // this.attendees = this.oGetTodayAttendees();
  }

  oGetRegistrants(): Observable<Registrant[]> {
    return this.afs
      .collection('registrants', (ref) => {
        return ref.orderBy('created_at', 'asc');
      })
      .snapshotChanges()
      .pipe(
        map((actions) =>
          actions.map((a) => {
            const data = a.payload.doc.data() as Registrant;
            const id = a.payload.doc.id;
            return { docId: id, ...data };
          })
        )
      );
  }

  oGetMenRegistrants(): Observable<Registrant[]> {
    return this.afs
      .collection('registrants', (ref) => {
        return ref.where('sex', '==', 'male');
      })
      .snapshotChanges()
      .pipe(
        map((actions) =>
          actions.map((a) => {
            const data = a.payload.doc.data() as Registrant;
            const id = a.payload.doc.id;
            return { docId: id, ...data };
          })
        )
      );
  }

  oGetUniteRegistrants(): Observable<UniteRegistrant[]> {
    return this.afs
      .collection('uniteregistrants', (ref) => {
        return ref.orderBy('created_at', 'asc');
      })
      .snapshotChanges()
      .pipe(
        map((actions) =>
          actions.map((a) => {
            const data = a.payload.doc.data() as UniteRegistrant;
            const id = a.payload.doc.id;
            return { docId: id, ...data };
          })
        )
      );
  }

  // oGetTodayAttendees(): Observable<any> {
  //   return this.afs
  //     .collection('attendees')
  //     .doc('Y0eOmtUxabBZLXY18xWX')
  //     .collection(this.currentDay, (ref) => {
  //       return ref.orderBy('lastName', 'asc');
  //     })
  //     .valueChanges();
  //   // .pipe(
  //   //   map((attendee) => {
  //   //     return attendee.map((attendee) => {
  //   //       return attendee;
  //   //     });
  //   //   })
  //   // );
  // }

  oGetAttendeesSpecificDay(selectedDay = this.currentDay): Observable<any> {
    return this.afs
      .collection('attendees')
      .doc('Y0eOmtUxabBZLXY18xWX')
      .collection(selectedDay, (ref) => {
        return ref.orderBy('lastName', 'asc');
      })
      .valueChanges();
  }

  getDayTotals(selectedDay = this.currentDay): Observable<AttendeesTotals> {
    return this.afs
      .collection('attendees')
      .doc('Y0eOmtUxabBZLXY18xWX')
      .collection(selectedDay)
      .doc('totals')
      .valueChanges()
      .pipe(
        map((data) => {
          return data as AttendeesTotals;
        })
      );
  }

  async createCurrentDayAttendeesTotalsDB(): Promise<void> {
    if (await this.checkIfDayExists()) {
      return this.afs
        .collection('attendees')
        .doc('Y0eOmtUxabBZLXY18xWX')
        .collection(this.currentDay)
        .doc('totals')
        .set({});
    }
  }

  async checkIfDayExists(): Promise<boolean> {
    const doesMonthExist$ = this.afs
      .collection('attendees')
      .doc('Y0eOmtUxabBZLXY18xWX')
      .collection(this.currentDay, (ref) => ref.limit(1))
      .get();
    const doesMonthExist = await lastValueFrom(doesMonthExist$);
    return doesMonthExist.empty;
  }

  addRegistrant(registrant: Registrant): Promise<any> {
    // const res = await this.registrantAlreadyExists(registrant.mobile);

    // if (!res) {
    return this.afs
      .collection('registrants')
      .add({ ...registrant, created_at: this.timestamp });

    // }

    //
  }

  incrementRegistrantTotals(registrant: Registrant): void {
    const maleIncrement = registrant.sex === 'male' ? 1 : 0;
    const femaleIncrement = registrant.sex === 'female' ? 1 : 0;

    this.afs
      .collection('registrants')
      .doc('totals')
      .update({
        ['totalRegistrants']: firebase.firestore.FieldValue.increment(1),
        ['totalMale']: firebase.firestore.FieldValue.increment(maleIncrement),
        ['totalFemale']:
          firebase.firestore.FieldValue.increment(femaleIncrement),
      });
  }

  getRegistrant(id: string): Observable<Registrant> {
    const registrant = this.afs.doc<Registrant>('registrants/' + id);
    return registrant.snapshotChanges().pipe(
      map((changes) => {
        const data = changes.payload.data();
        const id = changes.payload.id;
        return { id, ...data } as Registrant;
      })
    );
  }

  async registrantAlreadyExists(mobile: number): Promise<boolean> {
    const exists$ = this.afs
      .collection('registrants', (ref) => ref.where('mobile', '==', mobile))
      .valueChanges()
      .pipe(
        take(1),
        map((arr) => (arr.length ? true : false))
      );

    return await lastValueFrom(exists$);
  }

  uploadSignature(
    base64Image: string,
    filename: string
  ): AngularFireUploadTask {
    return this.storage
      .ref(filename)
      .putString(base64Image, 'data_url', { contentType: 'image/jpg' });
  }

  addAttendee(id: string, attendee: Attendee): Promise<void> {
    // const productQuantity = `${this.getParsedName(
    //   transaction.product.name
    // )}.total_count`;
    // const productSales = `${this.getParsedName(
    //   transaction.product.name
    // )}.total_sales`;

    // console.log(productQuantity, productSales);

    const paylaod = { ...attendee, created_at: this.timestamp };
    paylaod.created_at = this.timestamp;

    return this.afs
      .collection('attendees')
      .doc('Y0eOmtUxabBZLXY18xWX')
      .collection(this.currentDay)
      .doc(id)
      .set(paylaod);
  }

  incrementAttendeesTotals(attendee: Attendee, docId: string): void {
    const isFirstTimer = attendee.isFirstTimer ? 1 : 0;
    const maleIncrement = attendee.sex === 'male' ? 1 : 0;
    const maleFirstTimerIncrement =
      attendee.sex === 'male' && attendee.isFirstTimer ? 1 : 0;
    const femaleIncrement = attendee.sex === 'female' ? 1 : 0;
    const femaleFirstTimerIncrement =
      attendee.sex === 'female' && attendee.isFirstTimer ? 1 : 0;
    this.afs
      .collection('attendees')
      .doc('Y0eOmtUxabBZLXY18xWX')
      .collection(this.currentDay)
      .doc('totals')
      .update({
        ['totalAttendees']: firebase.firestore.FieldValue.increment(1),
        ['totalFirstTimers']:
          firebase.firestore.FieldValue.increment(isFirstTimer),
        ['totalMale']: firebase.firestore.FieldValue.increment(maleIncrement),
        ['totalMaleFirstTimers']: firebase.firestore.FieldValue.increment(
          maleFirstTimerIncrement
        ),
        ['totalFemale']:
          firebase.firestore.FieldValue.increment(femaleIncrement),
        ['totalFemaleFirstTimers']: firebase.firestore.FieldValue.increment(
          femaleFirstTimerIncrement
        ),
      })
      .then((res) => {
        if (attendee.isFirstTimer) {
          this.afs
            .collection('registrants')
            .doc(docId)
            .update({
              ['isFirstTimer']: false,
            });
        }
      });
  }

  findAttendee(registrantId: string): AngularFirestoreDocument<DocumentData> {
    return this.afs
      .collection('attendees')
      .doc('Y0eOmtUxabBZLXY18xWX')
      .collection(this.currentDay)
      .doc(registrantId);
  }

  // UNITE /////////////////////////////////////////////////////////////////////////////////////////////////////

  getUniteDayTotals(
    selectedDay = this.currentDay
  ): Observable<AttendeesTotals> {
    return this.afs
      .collection('uniteattendees')
      .doc('sG5JbulSG3yfuGPiAVhB')
      .collection(selectedDay)
      .doc('totals')
      .valueChanges()
      .pipe(
        map((data) => {
          return data as AttendeesTotals;
        })
      );
  }

  oGetUniteAttendeesSpecificDay(
    selectedDay = this.currentDay
  ): Observable<any> {
    return this.afs
      .collection('uniteattendees')
      .doc('sG5JbulSG3yfuGPiAVhB')
      .collection(selectedDay, (ref) => {
        return ref.orderBy('lastName', 'asc');
      })
      .valueChanges();
  }

  addUniteRegistrant(registrant: UniteRegistrant): Promise<any> {
    // const res = await this.registrantAlreadyExists(registrant.mobile);

    // if (!res) {
    return this.afs
      .collection('uniteregistrants')
      .add({ ...registrant, created_at: this.timestamp });

    // }

    //
  }

  getUniteRegistrant(id: string): Observable<UniteRegistrant> {
    const registrant = this.afs.doc<UniteRegistrant>('uniteregistrants/' + id);
    return registrant.snapshotChanges().pipe(
      map((changes) => {
        const data = changes.payload.data();
        const id = changes.payload.id;
        return { id, ...data } as UniteRegistrant;
      })
    );
  }

  addUniteAttendee(id: string, attendee: UniteAttendee): Promise<void> {
    const paylaod = { ...attendee, created_at: this.timestamp };
    paylaod.created_at = this.timestamp;

    return this.afs
      .collection('uniteattendees')
      .doc('sG5JbulSG3yfuGPiAVhB')
      .collection(this.currentDay)
      .doc(id)
      .set(paylaod);
  }

  findUniteAttendee(
    registrantId: string
  ): AngularFirestoreDocument<DocumentData> {
    return this.afs
      .collection('uniteattendees')
      .doc('sG5JbulSG3yfuGPiAVhB')
      .collection(this.currentDay)
      .doc(registrantId);
  }

  getUniteAttendee(id: string): Observable<UniteAttendee> {
    const registrant = this.afs.doc<UniteRegistrant>(
      `uniteattendees/sG5JbulSG3yfuGPiAVhB/${this.currentDay}/` + id
    );
    return registrant.snapshotChanges().pipe(
      map((changes) => {
        const data = changes.payload.data();
        const id = changes.payload.id;
        return { id, ...data } as UniteAttendee;
      })
    );
  }

  async attendeeClaimedFood(registrantId: string): Promise<void> {
    this.afs
      .collection('uniteattendees')
      .doc('sG5JbulSG3yfuGPiAVhB')
      .collection(this.currentDay)
      .doc(registrantId)
      .update({
        ['claimedFood']: true,
      });
  }

  incrementUniteRegistrantTotals(registrant: UniteRegistrant): void {
    const maleIncrement = registrant.sex === 'male' ? 1 : 0;
    const femaleIncrement = registrant.sex === 'female' ? 1 : 0;

    this.afs
      .collection('uniteregistrants')
      .doc('totals')
      .update({
        ['totalRegistrants']: firebase.firestore.FieldValue.increment(1),
        ['totalMale']: firebase.firestore.FieldValue.increment(maleIncrement),
        ['totalFemale']:
          firebase.firestore.FieldValue.increment(femaleIncrement),
      });
  }

  async checkIfUniteDayExists(): Promise<boolean> {
    const doesMonthExist$ = this.afs
      .collection('uniteattendees')
      .doc('sG5JbulSG3yfuGPiAVhB')
      .collection(this.currentDay, (ref) => ref.limit(1))
      .get();
    const doesMonthExist = await lastValueFrom(doesMonthExist$);
    return doesMonthExist.empty;
  }

  async createUniteCurrentDayAttendeesTotalsDB(): Promise<void> {
    if (await this.checkIfUniteDayExists()) {
      return this.afs
        .collection('uniteattendees')
        .doc('sG5JbulSG3yfuGPiAVhB')
        .collection(this.currentDay)
        .doc('totals')
        .set({});
    }
  }

  incrementUniteAttendeesTotals(attendee: UniteAttendee, docId: string): void {
    const isFirstTimer = attendee.isFirstTimer ? 1 : 0;
    const maleIncrement = attendee.sex === 'male' ? 1 : 0;
    const maleFirstTimerIncrement =
      attendee.sex === 'male' && attendee.isFirstTimer ? 1 : 0;
    const femaleIncrement = attendee.sex === 'female' ? 1 : 0;
    const femaleFirstTimerIncrement =
      attendee.sex === 'female' && attendee.isFirstTimer ? 1 : 0;
    this.afs
      .collection('uniteattendees')
      .doc('sG5JbulSG3yfuGPiAVhB')
      .collection(this.currentDay)
      .doc('totals')
      .update({
        ['totalAttendees']: firebase.firestore.FieldValue.increment(1),
        ['totalFirstTimers']:
          firebase.firestore.FieldValue.increment(isFirstTimer),
        ['totalMale']: firebase.firestore.FieldValue.increment(maleIncrement),
        ['totalMaleFirstTimers']: firebase.firestore.FieldValue.increment(
          maleFirstTimerIncrement
        ),
        ['totalFemale']:
          firebase.firestore.FieldValue.increment(femaleIncrement),
        ['totalFemaleFirstTimers']: firebase.firestore.FieldValue.increment(
          femaleFirstTimerIncrement
        ),
      })
      .catch((e) => {
        console.log(e);
      });
  }
}
