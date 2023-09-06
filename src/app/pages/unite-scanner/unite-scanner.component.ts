import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-unite-scanner',
  templateUrl: './unite-scanner.component.html',
  styleUrls: ['./unite-scanner.component.scss'],
})
export class UniteScannerComponent implements OnInit {
  singleSelectGroupValue: Array<string> = [];
  currentRoute = 'attendee';

  constructor(private router: Router, private route: ActivatedRoute) {
    const routeSplit = this.router.url.split('/');
    const lastUrlPart = routeSplit[routeSplit.length - 1];
    this.singleSelectGroupValue = [lastUrlPart];
    this.currentRoute = lastUrlPart;
    // console.log(this.singleSelectGroupValue);
  }

  ngOnInit(): void {}

  updateSingleSelectGroupValue(value: any): void {
    this.singleSelectGroupValue = value;
    this.router.navigate([value[0]], {
      relativeTo: this.route,
    });
  }
}
