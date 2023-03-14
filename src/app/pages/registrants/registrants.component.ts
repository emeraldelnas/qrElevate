import { Component, OnInit } from '@angular/core';
import { Registrant } from '@models/registrant.model';
import { DbService } from '@services/db.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-registrants',
  templateUrl: './registrants.component.html',
  styleUrls: ['./registrants.component.scss'],
})
export class RegistrantsComponent implements OnInit {
  registrants!: Observable<Registrant[]>;

  constructor(private db: DbService) {
    this.registrants = this.db.oGetMenRegistrants();
  }

  ngOnInit(): void {}

  identify(index: number, item: any): number {
    return item.created_at;
  }
}
