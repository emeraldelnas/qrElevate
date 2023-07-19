import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { DbService } from '@services/db.service';
import { QRCodeComponent } from 'angularx-qrcode';
import dayjs from 'dayjs';
import { Observable, map, of, startWith } from 'rxjs';

export interface Group {
  name: string;
  children: string[];
}

type District = 'OTHER' | 'CENTRAL' | 'EAST' | 'WEST';

@Component({
  selector: 'app-unite-registration',
  templateUrl: './unite-registration.component.html',
  styleUrls: ['./unite-registration.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class UniteRegistrationComponent implements OnInit {
  registerForm!: FormGroup;
  submitted = false;
  signatureImg!: string;
  @ViewChild('qrImg') qrImg!: QRCodeComponent;
  qrData = '';
  qrImgWidth = 400;
  qrLogo = 75;

  defaultIcon = './assets/a-elevate.png';
  centralIcon = './assets/central-district.png';
  eastIcon = './assets/east-district.png';
  westIcon = './assets/west-district.png';
  othersIcon = './assets/others-district.png';
  qrIcon = this.defaultIcon;

  generateQR = false;
  isLoading = false;

  sexOptions = [
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
  ];

  uploadPercent!: Observable<number>;
  downloadUrl!: Observable<string>;

  district: District = 'OTHER';
  schools!: Group[];
  filteredGroups$!: Observable<Group[]>;

  constructor(private fb: FormBuilder, private db: DbService) {}

  ngOnInit(): void {
    this.initRegisterForm();

    const d1 = dayjs('1998-01-08T16:00:00.000Z');
    const d2 = dayjs();
    console.log(d2.diff(d1, 'year'));

    //

    this.schools = [
      {
        name: 'OTHER',
        children: ['Other'],
      },
      {
        name: 'CENTRAL',
        children: [
          'Xavier University - Ateneo de Cagayan',
          'Lourdes College',
          'Pilgrim College',
          'Misamis Oriental General Comprehensive High School',
          "Abba's Orchard",
          'Oro Christian Grace School',
          'Corpus Christi',
        ],
      },
      {
        name: 'EAST',
        children: [
          'University of Science and Technology of Southern Philippines',
          'Southern Philippine College',
          'Capitol University',
          'East City Central School',
          'Lapasan National High School',
          'Regional Science High School',
        ],
      },
      {
        name: 'WEST',
        children: [
          'Pedro "Oloy" N. Roa Sr. Elementary School',
          'Pedro "Oloy" N. Roa Sr. High School',
          'Liceo de Cagayan University',
          'Cagayan de Oro College - PHINMA Education Network',
          "St. Mary's Academy",
          'Angelicum Learning Center',
          'Informatics College',
          'Gusa National High School',
          'West City Central School',
          'Golden Heritage School',
          'Mindanao State University - Iligan Institute of Technology',
          'Philippine Science High School',
        ],
      },
    ];

    this.filteredGroups$ = of(this.schools);

    this.filteredGroups$ = this.school.valueChanges.pipe(
      startWith(''),
      map((filterString) => this.filter(filterString))
    );

    console.log(this.findDistrict("St. Mary's Academy"));
  }

  ngAfterViewInit() {
    const qrImgCurWidth = document.getElementById('qr-image')!.offsetWidth;
    this.qrImgWidth = qrImgCurWidth > 300 ? 300 : qrImgCurWidth;
    this.qrLogo = this.qrImgWidth * 0.2;
  }

  initRegisterForm(): void {
    this.registerForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      birthdate: ['', Validators.required],
      sex: ['', Validators.required],
      mobile: ['', Validators.required],
      school: ['', Validators.required],
      isFirstTimer: [false],
      claimedFood: [false],
    });
  }

  async submit(): Promise<void> {
    this.submitted = true;

    if (this.registerForm.valid) {
      this.isLoading = true;

      const formValues = this.registerForm.value;

      this.district = this.findDistrict(this.school.value);
      this.qrIcon = this.getDistrictIcon(this.district);

      const payload = {
        ...formValues,
        birthdate: dayjs(formValues.birthdate).toISOString(),
        district: this.district,
      };

      this.db.addUniteRegistrant(payload).then((docRef) => {
        this.isLoading = false;
        this.generateQR = true;
        this.qrData = docRef.id;

        this.db.incrementUniteRegistrantTotals(payload);
        // this.isUserCreated = true;
      });
    }
  }

  get fullName(): string {
    return `${this.registerForm.get('firstName')?.value} ${
      this.registerForm.get('lastName')?.value
    }`;
  }

  saveAsImage(parent: any): void {
    let parentElement = parent.qrcElement.nativeElement
      .querySelector('canvas')
      .toDataURL('image/png');

    let blobData = this.convertBase64ToBlob(parentElement);
    // saves as image
    const blob = new Blob([blobData], { type: 'image/png' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    // name of the file
    link.download = 'my-unite-qr-code';
    link.click();
  }

  private convertBase64ToBlob(Base64Image: string) {
    // split into two parts
    const parts = Base64Image.split(';base64,');
    // hold the content type
    const imageType = parts[0].split(':')[1];
    // decode base64 string
    const decodedData = window.atob(parts[1]);
    // create unit8array of size same as row data length
    const uInt8Array = new Uint8Array(decodedData.length);
    // insert all character code into uint8array
    for (let i = 0; i < decodedData.length; ++i) {
      uInt8Array[i] = decodedData.charCodeAt(i);
    }
    // return blob image after conversion
    return new Blob([uInt8Array], { type: imageType });
  }

  formatDate(dateString: string): string {
    console.log(
      new Date(dateString).toLocaleDateString('en-us', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    );
    return new Date(dateString).toLocaleDateString('en-us', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  }

  back(): void {
    this.submitted = false;
    this.generateQR = false;
    this.registerForm.reset();
  }

  get firstName(): AbstractControl {
    return <AbstractControl>this.registerForm.get('firstName');
  }

  get lastName(): AbstractControl {
    return <AbstractControl>this.registerForm.get('lastName');
  }

  get mobile(): AbstractControl {
    return <AbstractControl>this.registerForm.get('mobile');
  }

  get sex(): AbstractControl {
    return <AbstractControl>this.registerForm.get('sex');
  }

  get birthdate(): AbstractControl {
    return <AbstractControl>this.registerForm.get('birthdate');
  }

  get school(): AbstractControl {
    return <AbstractControl>this.registerForm.get('school');
  }

  private filterChildren(children: string[], filterValue: string) {
    return children.filter((optionValue) =>
      optionValue.toLowerCase().includes(filterValue)
    );
  }

  private filter(value: string): Group[] {
    const filterValue = value.toLowerCase();
    return this.schools
      .map((school) => {
        return {
          name: school.name,
          children: this.filterChildren(school.children, filterValue),
        };
      })
      .filter((school) => school.children.length);
  }

  trackByFn(index: any, item: any) {
    return item.name;
  }

  showError(control: AbstractControl): false | ValidationErrors | null {
    const { touched, dirty, errors } = control;
    return (touched || dirty || this.submitted) && errors;
  }

  findDistrict(school: string): District {
    let registrantDistrict: District = 'OTHER';

    this.schools.every((district) => {
      if (district.children.includes(school)) {
        registrantDistrict = district.name as District;
        return false;
      }

      return true;
    });

    return registrantDistrict;
  }

  getDistrictIcon(district: string): string {
    switch (district) {
      case 'CENTRAL':
        return this.centralIcon;

      case 'EAST':
        return this.eastIcon;

      case 'WEST':
        return this.westIcon;

      case 'OTHER':
        return this.othersIcon;

      default:
        return this.defaultIcon;
    }
  }
}
