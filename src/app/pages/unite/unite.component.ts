import { Component, OnInit } from '@angular/core';
import { NbMenuItem } from '@nebular/theme';

@Component({
  selector: 'app-unite',
  templateUrl: './unite.component.html',
  styleUrls: ['./unite.component.scss'],
})
export class UniteComponent implements OnInit {
  items: NbMenuItem[] = [
    {
      title: 'Registrants',
      link: '/unite-dashboard/registrants',
      pathMatch: 'full',
    },
    {
      title: 'Attendees',
      link: '/unite-dashboard/attendees',
      pathMatch: 'full',
    },
    {
      title: 'Generate QR Code',
      link: '/unite-dashboard/generate-qr',
      pathMatch: 'full',
    },
  ];

  constructor() {}

  ngOnInit(): void {}
}
