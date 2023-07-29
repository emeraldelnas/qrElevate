import { Component, OnInit, Renderer2 } from '@angular/core';
import { Registrant } from '@models/registrant.model';
import { DbService } from '@services/db.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-registrants',
  templateUrl: './men-registrants.component.html',
  styleUrls: ['./men-registrants.component.scss'],
})
export class MenRegistrantsComponent implements OnInit {
  registrants!: Observable<Registrant[]>;

  constructor(private db: DbService, private renderer: Renderer2) {
    this.registrants = this.db.oGetMenRegistrants();
  }

  ngOnInit(): void {}

  identify(index: number, item: any): number {
    return item.created_at;
  }

  copyToClipboard(phone: number, cellClass: string): void {
    navigator.clipboard.writeText(phone.toString());
    const element = document.getElementById(cellClass);

    this.renderer.addClass(element, 'copied');
  }
}
