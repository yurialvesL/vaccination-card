import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatRippleModule } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { Router, RouterModule } from '@angular/router';
import { AuthStorageService } from '@app/services/auth/auth-storage-service';
import { Person } from '@app/services/person/models/person.model';
import { PersonService } from '@app/services/person/person-service';
import { PersonStorageService } from '@app/services/person/person-storage-service';
import { VaccinationSummaryDto } from '@app/services/vaccination/models/response/get-vaccination-by-personId-response.dto';
import { VaccinationService } from '@app/services/vaccination/vaccination-service';
import { Vaccine } from '@app/services/vaccine/models/vaccine.dto';
import { NgxMaskDirective, NgxMaskPipe } from 'ngx-mask';
import { map, Observable, startWith, from, switchMap, distinctUntilChanged, debounceTime, filter, catchError, of, tap, shareReplay, combineLatest, defer, take, Subject } from 'rxjs';
import { CreatePatientDialog } from './components/create-patient-dialog/create-patient-dialog';
import { CreatePersonRequestDto } from '@app/services/person/models/request/create-person-request.dto';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ConfirmExcludeDialog } from './components/confirm-exclude-dialog/confirm-exclude-dialog';
import { DeletePersonByIdRequestDto } from '@app/services/person/models/request/delete-person-by-id-request.dto';
import { VaccinationDetailDialog } from './components/vaccination-detail-dialog/vaccination-detail-dialog';
import { VaccineWithVaccinations } from '@app/services/vaccination/vaccination-detail.dto';
import { CreateVaccinationDialog } from './components/create-vaccination-dialog/create-vaccination-dialog';
import { VaccineService } from '@app/services/vaccine/vaccine-service';



type Sex = 'Masculine' | 'Feminine';



@Component({
  selector: 'app-home',
  imports: [CommonModule, RouterModule, ReactiveFormsModule,
    MatFormFieldModule, MatInputModule, MatIconModule,
    MatListModule, MatButtonModule, MatRippleModule, MatCardModule, NgxMaskDirective,
    NgxMaskPipe, MatSnackBarModule],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class Home {
  private refresh$ = new Subject<void>();
  personLoggedCpf: string | null = null;
  personLogged: boolean = true;
  readonly dialog = inject(MatDialog);
  search = new FormControl<string>('', { nonNullable: true });
  private snack = inject(MatSnackBar);
  token: string | null = null;
  vaccines: Vaccine[] = [
    { vaccineId: '1', name: 'Vaccine A', quantity: 1 },
    { vaccineId: '2', name: 'Vaccine B', quantity: 2 },
    { vaccineId: '3', name: 'Vaccine C', quantity: 3 }
  ];


  person$: Observable<Person | null> = this.search.valueChanges.pipe(
    startWith(this.search.value ?? ''),
    map(v => (v ?? '').replace(/\D/g, '')),
    debounceTime(300),
    distinctUntilChanged(),
    switchMap(cpf => this.findByCpfDigits$(cpf)),
    catchError(() => of(null)),
  );

  private token$: Observable<string> = defer(() => from(this.authStorageService.getToken())).pipe(
    map(t => t ?? ''),
    filter(t => !!t),
    shareReplay({ bufferSize: 1, refCount: true })
  );


  vaccinations$: Observable<VaccinationSummaryDto[]> = combineLatest([
    this.person$.pipe(
      filter((p): p is Person => !!p),
      distinctUntilChanged((a, b) => a.id === b.id)
    ),
    this.token$,
    this.refresh$.pipe(startWith(void 0))
  ]).pipe(
    switchMap(([p, token]) =>
      this.vaccinationService.getVaccinationByPersonId(p.id, token).pipe(
        map(res => res?.vaccinations ?? []),
        map(list => [...list].sort((a, b) => a.vaccine.vaccineId.localeCompare(b.vaccine.vaccineId))),
        catchError(() => of([]))
      )
    ),
    shareReplay({ bufferSize: 1, refCount: true })
  );


  vaccines$: Observable<Vaccine[]> = this.vaccinations$.pipe(
    map(list => {
      const acc = new Map<string, Vaccine>();
      for (const v of list) {
        const id = v.vaccine.vaccineId;
        const name = v.vaccine.name;
        const cur = acc.get(id) ?? { vaccineId: id, name, quantity: 0 };
        cur.quantity++;
        acc.set(id, cur);
      }
      return [...acc.entries()]
        .sort((a, b) => a[0].localeCompare(b[0]))
        .map(([, v]) => v);
    })
  );

  constructor(private readonly personStorageService: PersonStorageService,
    private readonly authStorageService: AuthStorageService,
    private readonly router: Router,
    private readonly personService: PersonService,
    private readonly vaccinationService: VaccinationService,
    private readonly vaccineService: VaccineService
  ) { }


  async ngOnInit() {

    await this.authStorageService.getToken().then(token => {
      if (token) {
        this.token = token;
      }
    });
    let cpf = '';
    await this.personStorageService.getPerson().then(p => {
      if (p !== null) {
        this.personLoggedCpf = p.cpf;
        this.personLogged = true;
        cpf = p.cpf;
        this.findByCpfDigits$(p.cpf);
      }
    });
     this.search.setValue(cpf);
  }


  findByCpfDigits$(cpfMasked: string | null): Observable<Person | null> {
    const token = this.token ?? '';
    const digits = (cpfMasked ?? '').replace(/\D/g, '');

    if (digits.length !== 11) return of(null);

    var person$ = this.personService.getPersonByCpf(digits, token).pipe(
      map(dto => dto ? ({
        id: dto.personId,
        name: dto.name,
        cpf: dto.cpf,
        birthDate: dto.dateOfBirth,
        sex: dto.sex,
        isAdmin: dto.isAdmin
      } as Person) : null),
      catchError(() => of(null))
    );

    person$.subscribe({
      next: person => {
        if (person) {
          var personSearch: Person = {
            id: person.id,
            name: person.name,
            cpf: person.cpf,
            birthDate: person.birthDate,
            sex: person.sex,
            isAdmin: person.isAdmin
          };
          
          this.personLogged = true;
          if (person.cpf !== this.personLoggedCpf)
            this.personLogged = false;

          this.findVaccinations(personSearch.id);

          this.vaccines$.subscribe({
            next: vaccines => {
              this.vaccines = vaccines;
            },
            error: () => {
              console.log('Error fetching vaccines');
            }
          });
          

        }
        return null;
      },
      error: () => {
        console.log('Person not found');
      }
    });

    return person$;
  }



  async findByCpfDigits(cpfMasked: string | null): Promise<Person | null> {
    let tokenValue = "";

    await this.authStorageService.getToken().then(token => {
      if (token) {
        tokenValue = token;
      }
    });

    const digits = (cpfMasked ?? '').replace(/\D/g, '');
    if (!digits) return null;

    if (digits.length < 11) return null;

    this.personService.getPersonByCpf(digits, tokenValue).subscribe({
      next: async person => {
        if (person) {
          var personSearch: Person = {
            id: person.personId,
            name: person.name,
            cpf: person.cpf,
            birthDate: person.dateOfBirth,
            sex: person.sex,
            isAdmin: person.isAdmin
          };

          this.findVaccinations(personSearch.id);

          await this.personStorageService.getPersonLoggedCpf().then(async cpfLogged => {
            this.personLogged = true;

            if (this.personLoggedCpf !== personSearch.cpf) {
              this.personLogged = false;
            }


            await this.personStorageService.setPerson(personSearch);
          });

          return person;
        }
        return null;
      },
      error: () => {
        console.log('Person not found');
      }
    });

    return null;
  }


  findVaccinations(personId: string): Observable<VaccineWithVaccinations[]> {
    return this.vaccinationService
      .getVaccinationByPersonId(personId, this.token ?? '')
      .pipe(
        map(res => {
          const acc = new Map<string, VaccineWithVaccinations>();
          const acd = new Map<string, Vaccine>();


          for (const v of res?.vaccinations ?? []) {
            const id = v.vaccine.vaccineId;
            const name = v.vaccine.name;
            const group = acc.get(id) ?? { vaccineId: id, name, vaccinations: [] };
            group.vaccinations.push(v);
            acc.set(id, group);


            const cur = acd.get(id) ?? { vaccineId: id, name, quantity: 0 };
            cur.quantity += 1;
            acd.set(id, cur);
          }

          this.vaccines$ = of([...acd.entries()]
            .sort((a, b) => a[0].localeCompare(b[0]))
            .map(([, v]) => v));

          const groups = Array.from(acc.values()).sort((a, b) =>
            a.name.localeCompare(b.name)
          );

          for (const g of groups) {
            g.vaccinations.sort((a, b) =>
              new Date(a.dateOfApplied).getTime() - new Date(b.dateOfApplied).getTime()
        )};

          return groups;
        }),
        catchError(() => of([]))
      );
  }


  initials(name: string) {
    return name.split(' ').filter(Boolean).slice(0, 2).map(n => n[0]!.toUpperCase()).join('');
  }

  prettyBirth(dateISO: string) {
    const d = new Date(dateISO);
    return isNaN(d.getTime())
      ? dateISO
      : d.toLocaleDateString('en-US', { day: '2-digit', month: 'long', year: 'numeric' });
  }



  remove(p: Person) {
    const dialogRef = this.dialog.open(ConfirmExcludeDialog, {
      width: '400px',
      data: { person: p }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        const deleteRequest: DeletePersonByIdRequestDto = {
          PersonId: p.id
        };

        this.personService.deletePersonById(deleteRequest, this.token ?? '').subscribe({
          next: () => {
            this.okSnack();
            this.search.setValue('');
          },
          error: (error) => {
            console.error('Error deleting person:', error);
          }
        });
      }
    });
  }



  openCreatePatientDialog(): void {
    const dialogRef = this.dialog.open(CreatePatientDialog, {
      width: '400px',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        let personToCreate: CreatePersonRequestDto = {
          Name: result.name,
          CPF: result.cpf,
          Password: result.password,
          Sex: result.sex,
          DateOfBirth: result.birthDate,
          IsAdmin: true
        };

        console.log('Creating person:', personToCreate);
        this.personService.createPerson(personToCreate).subscribe({
          next: (response) => {
            this.okSnack();
          },
          error: (error) => {
            console.error('Error creating person:', error);
          }
        });

      }
    });
  }

  okSnack() {
    this.snack.open('Patient created successfully!', 'Close', {
      duration: 3000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: ['snack-success']  // classe para estilizar
    });
  }

  okRemoveSnack() {
    this.snack.open('Patient removed successfully!', 'Close', {
      duration: 3000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: ['snack-success']  // classe para estilizar
    });
  }



  goToVaccinationDetail(c: Vaccine) {

    this.vaccinations$.pipe(
      take(1),
      map(list => (list ?? []).filter(v => v.vaccine.vaccineId === c.vaccineId))
    ).subscribe(items => {


      const dialogRef = this.dialog.open(VaccinationDetailDialog, {
        width: '640px',
        autoFocus: false,
        restoreFocus: false,
        data: items

      });

      dialogRef.afterClosed().subscribe(result => {
        if (result === true) {
          this.refresh$.next();
        }
      });
    });
  }


openCreateVaccinationDialog(): void {

  this.vaccineService.getAllVaccines(this.token ?? '').subscribe({
    next: (vaccines) => {

      console.log('Available vaccines:', vaccines.vaccines);
      const dialogRef = this.dialog.open(CreateVaccinationDialog, {
        width: '400px',
        data: vaccines.vaccines
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.refresh$.next();
          this.vaccines.push(result);
        }
      });
    }
  });
}


  async logOut() {
    await this.personStorageService.removePerson();
    this.router.navigate(['']);
  }

}