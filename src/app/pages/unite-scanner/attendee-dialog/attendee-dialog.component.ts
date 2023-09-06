import { Component, OnInit } from '@angular/core';
import { UniteRegistrant } from '@models/registrant.model';
import { NbDialogRef } from '@nebular/theme';

@Component({
  selector: 'app-attendee-dialog',
  templateUrl: './attendee-dialog.component.html',
  styleUrls: ['./attendee-dialog.component.scss'],
})
export class AttendeeDialogComponent implements OnInit {
  attendee!: UniteRegistrant;
  age!: number;
  isBirthdayToday = false;

  constructor(protected dialogRef: NbDialogRef<any>) {}

  ngOnInit(): void {}

  close(): void {
    this.dialogRef.close();
  }
}
