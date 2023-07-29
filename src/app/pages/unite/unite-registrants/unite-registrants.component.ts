import { Component, OnInit, Renderer2 } from '@angular/core';
import { Registrant, UniteRegistrant } from '@models/registrant.model';
import { DbService } from '@services/db.service';
import { Observable, tap } from 'rxjs';

@Component({
  selector: 'app-unite-registrants',
  templateUrl: './unite-registrants.component.html',
  styleUrls: ['./unite-registrants.component.scss'],
})
export class UniteRegistrantsComponent implements OnInit {
  registrants!: Observable<UniteRegistrant[]>;

  constructor(private db: DbService, private renderer: Renderer2) {
    this.registrants = this.db
      .oGetUniteRegistrants()
      .pipe(tap((s) => console.log(s)));
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
}
