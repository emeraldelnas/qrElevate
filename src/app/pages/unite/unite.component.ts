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

  tabs = [
    {
      title: 'Registrants',
      route: '/unite-dashboard/registrants',
      icon: 'people',
      responsive: true, // hide title before `$tabset-tab-text-hide-breakpoint` value
    },
    {
      title: 'Attendees',
      route: '/unite-dashboard/attendees',
      icon: 'checkmark-square-2',
      responsive: true,
    },
    {
      title: 'Generate QR Code',
      route: '/unite-dashboard/generate-qr',
      icon: 'image-2',
      responsive: true,
    },
    {
      title: 'Raffle Entries',
      route: '/unite-dashboard/raffle-entries',
      icon: 'list',
      responsive: true,
    }
  ];

  constructor() {}

  ngOnInit(): void {}
}
