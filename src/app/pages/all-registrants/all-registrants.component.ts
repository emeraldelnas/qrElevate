import { Component, OnInit } from '@angular/core';
import { Registrant } from '@models/registrant.model';
import { DbService } from '@services/db.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-all-registrants',
  templateUrl: './all-registrants.component.html',
  styleUrls: ['./all-registrants.component.scss'],
})
export class AllRegistrantsComponent implements OnInit {
  registrants!: Observable<Registrant[]>;

  constructor(private db: DbService) {
    this.registrants = this.db.oGetRegistrants();
  }

  ngOnInit(): void {}

  identify(index: number, item: any): number {
    return item.created_at;
  }
}
