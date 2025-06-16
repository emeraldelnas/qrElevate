import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  AbstractControl,
  ValidationErrors,
  FormControl,
} from '@angular/forms';
import { DbService } from '@services/db.service';
import { QRCodeComponent } from 'angularx-qrcode';
import dayjs from 'dayjs';
import { Observable, map, of, startWith } from 'rxjs';

export interface Group {
  name: string;
  children: string[];
}

type District = 'OTHER' | 'CENTRAL' | 'EAST' | 'WEST' | 'HIGH';

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
  // centralIcon = './assets/central-district.png';
  // eastIcon = './assets/east-district.png';
  // westIcon = './assets/west-district.png';
  // highIcon = './assets/high-district.png';
  // othersIcon = './assets/others-district.png';
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
  // availableSchools: string[] = [];
  filteredGroups$!: Observable<Group[]>;

  currentYear = new Date().getFullYear();

  constructor(private fb: FormBuilder, private db: DbService) {}

  ngOnInit(): void {
    this.initRegisterForm();

    const d1 = dayjs('1998-01-08T16:00:00.000Z');
    const d2 = dayjs();
    // console.log(d2.diff(d1, 'year'));

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
          'Pilgrim Christian College',
        ],
      },
      {
        name: 'EAST',
        children: [
          'University of Science and Technology of Southern Philippines',
          'Southern Philippine College',
          'Capitol University',
        ],
      },
      {
        name: 'WEST',
        children: [
          'Liceo de Cagayan University',
          'Cagayan de Oro College - PHINMA Education Network',
          'Golden Heritage School',
        ],
      },
      {
        name: 'HIGH',
        children: [
          "Abba's Orchard",
          "Angelicum Learning Center",
          "City Central School",
          'Corpus Christi School',
          'Kong Hua School',
          'Misamis Oriental General Comprehensive High School',
          'National High School',
          'Oro Christian Grace School',
          'Pedro "Oloy" N. Roa Sr. High School',
          'Regional Science High School',
          'Shekinah Glory Christian Academy',
          "St. Mary's Academy",
          "St. Mary's School",

          // 'East City Central School',
          // 'Lapasan National High School',
          // 'Pedro "Oloy" N. Roa Sr. Elementary School',
          // 'Gusa National High School',
          // 'Cagayan de Oro Nation High School',
          // 'West City Central School',
          // 'Philippine Science High School',
        ],
      },
    ];

    // this.availableSchools = [
    //   'Xavier University - Ateneo de Cagayan',
    //   'Lourdes College',
    //   'Pilgrim College',
    //   'Misamis Oriental General Comprehensive High School',
    //   "Abba's Orchard",
    //   'Oro Christian Grace School',
    //   'Corpus Christi',
    //   'University of Science and Technology of Southern Philippines',
    //   'Southern Philippine College',
    //   'Capitol University',
    //   'East City Central School',
    //   'Lapasan National High School',
    //   'Regional Science High School',
    //   'Pedro "Oloy" N. Roa Sr. Elementary School',
    //   'Pedro "Oloy" N. Roa Sr. High School',
    //   'Liceo de Cagayan University',
    //   'Cagayan de Oro College - PHINMA Education Network',
    //   "St. Mary's Academy",
    //   'Angelicum Learning Center',
    //   'Informatics College',
    //   'Gusa National High School',
    //   'West City Central School',
    //   'Golden Heritage School',
    //   'Mindanao State University - Iligan Institute of Technology',
    //   'Philippine Science High School',
    // ];

    this.filteredGroups$ = of(this.schools);

    this.filteredGroups$ = this.school.valueChanges.pipe(
      startWith(''),
      map((filterString) => this.filter(filterString))
    );

    // console.log(this.findDistrict("St. Mary's Academy"));
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
      mobile: ['', Validators.required],
      facebookAcc: [''],
      school: ['', Validators.required],
      otherSchoolName: [''],
      birthdate: ['', Validators.required],
      sex: ['', Validators.required],
      ticketNo: [''],
      isFirstTimer: [false],
      leader: ['']
      // claimedFood: [false]
    }, { validator: this.requireIfSchoolIsSetToOther });
  }

  requireIfSchoolIsSetToOther(form: FormGroup) {
    const schoolControl = form.get('school');
    const otherSchoolNameControl = form.get('otherSchoolName');

    if (schoolControl && otherSchoolNameControl) {
      const schoolValue = schoolControl.value;
      if (schoolValue === 'Other' && !otherSchoolNameControl.value) {
        otherSchoolNameControl.setErrors({ required: true });
      } else {
        otherSchoolNameControl.setErrors(null);
      }
    }
  }

  async submit(): Promise<void> {
    this.submitted = true;

    if (this.registerForm.valid) {
      this.isLoading = true;

      const formValues = this.registerForm.value;

      if(this.school.value === 'Other') {
        formValues.school = formValues.otherSchoolName;
      }

      const { otherSchoolName, ...rest } = formValues;

      this.district = this.findDistrict(this.school.value);
      // this.qrIcon = this.getDistrictIcon(this.district);

      const payload = {
        ...rest,
        birthdate: dayjs(formValues.birthdate).toISOString(),
        district: this.district,
      };

      this.db
        .addUniteRegistrant(payload)
        .then((docRef) => {
          this.isLoading = false;
          this.generateQR = true;
          this.qrData = docRef.id;

          // this.db.incrementUniteRegistrantTotals(payload);
          // this.isUserCreated = true;
        })
        .catch((e: Error) => {
          console.log(e);
          this.isLoading = false;
          this.generateQR = false;
        })
        .finally(() => {
          this.isLoading = false;
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
    // console.log(
    //   new Date(dateString).toLocaleDateString('en-us', {
    //     month: 'long',
    //     day: 'numeric',
    //     year: 'numeric',
    //   })
    // );
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

  get firstName(): FormControl {
    return <FormControl>this.registerForm.get('firstName');
  }

  get lastName(): FormControl {
    return <FormControl>this.registerForm.get('lastName');
  }

  get mobile(): FormControl {
    return <FormControl>this.registerForm.get('mobile');
  }

  get school(): FormControl {
    return <FormControl>this.registerForm.get('school');
  }

  get otherSchoolName(): FormControl {
    return <FormControl>this.registerForm.get('otherSchoolName');
  }

  get birthdate(): FormControl {
    return <FormControl>this.registerForm.get('birthdate');
  }

  get sex(): FormControl {
    return <FormControl>this.registerForm.get('sex');
  }

  get ticketNo(): FormControl {
    return <FormControl>this.registerForm.get('ticketNo');
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

  // getDistrictIcon(district: string): string {
  //   switch (district) {
  //     case 'CENTRAL':
  //       return this.centralIcon;

  //     case 'EAST':
  //       return this.eastIcon;

  //     case 'WEST':
  //       return this.westIcon;

  //     case 'HIGH':
  //       return this.highIcon;

  //     case 'OTHER':
  //       return this.othersIcon;

  //     default:
  //       return this.defaultIcon;
  //   }
  // }
}
