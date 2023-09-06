import { Component } from '@angular/core';
import { DbService } from '@services/db.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  isUnite = false;

  constructor(db: DbService) {
    db.createCurrentDayAttendeesTotalsDB();
    if (this.isUnite) {
      db.createUniteCurrentDayAttendeesTotalsDB();
    }
  }
}
