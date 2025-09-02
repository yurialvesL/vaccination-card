import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCard, MatCardModule } from '@angular/material/card';
import { MatRippleModule } from '@angular/material/core';
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
import { map, Observable, startWith, from, switchMap, distinctUntilChanged, debounceTime, filter, catchError, of, tap, shareReplay, combineLatest, defer } from 'rxjs';



type Sex = 'Masculine' | 'Feminine';



@Component({
  selector: 'app-home',
  imports: [CommonModule, RouterModule, ReactiveFormsModule,
    MatFormFieldModule, MatInputModule, MatIconModule,
    MatListModule, MatButtonModule, MatRippleModule, MatCardModule,NgxMaskDirective,
    NgxMaskPipe],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class Home {
  search = new FormControl<string>('', { nonNullable: true });
  token: string | null = null;
  vaccines: Vaccine[] = [
    { id: '1', name: 'Vaccine A', quantity: 1 },
    { id: '2', name: 'Vaccine B', quantity: 2 },
    { id: '3', name: 'Vaccine C', quantity: 3 }
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
  this.token$
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
      const cur = acc.get(id) ?? { id, name, quantity: 0 };
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
    private readonly vaccinationService: VaccinationService
  ) { }


  async ngOnInit() {

    await this.authStorageService.getToken().then(token => {
      if (token) {
        this.token = token;
      }
    });

    await this.personStorageService.getPerson().then(p => {
      if (p !== null) {
        this.search.setValue(p.cpf);
        this.findByCpfDigits$(p.cpf);
      }
    });
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
      tap(p => p && this.personStorageService.setPerson(p)),
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

          this.vaccines$ = this.findVaccinations(personSearch.id);

          this.vaccines$.subscribe({
            next: vaccines => {
              this.vaccines = vaccines;
              console.log('Vaccines found:', vaccines);
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
        console.log("Token found:", tokenValue);
      }
    });

    const digits = (cpfMasked ?? '').replace(/\D/g, '');
    if (!digits) return null;

    if (digits.length < 11) return null;

    this.personService.getPersonByCpf(digits, tokenValue).subscribe({
      next: person => {
        if (person) {
          var personSearch: Person = {
            id: person.personId,
            name: person.name,
            cpf: person.cpf,
            birthDate: person.dateOfBirth,
            sex: person.sex,
            isAdmin: person.isAdmin
          };

          this.vaccines$ = this.findVaccinations(personSearch.id);
          console.log('Person found:', personSearch);
          this.personStorageService.setPerson(personSearch);

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

  findVaccinations(personId: string): Observable<Vaccine[]> {

    console.log('Fetching vaccinations for personId:', personId, 'with token:', this.token);

    return this.vaccinationService.getVaccinationByPersonId(personId, this.token ?? '').pipe(
      map(res => {
        const acc = new Map<string, Vaccine>(); 
        for (const v of res?.vaccinations ?? []) {
          const id = v.vaccine.vaccineId;
          const name = v.vaccine.name;
          const cur = acc.get(id) ?? { id, name, quantity: 0 };
          cur.quantity += 1;
          acc.set(id, cur);
        }
        return [...acc.entries()]
          .sort((a, b) => a[0].localeCompare(b[0]))
          .map(([, v]) => v);
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

  goToPatientDetail(p: Person) {
    // ajuste a rota conforme seu app
    //this.router.navigate(['/patients', p.id]);
  }



  edit(p: Person) { /* editar */ }
  remove(p: Person) { /* remover */ }

  addPatient() { }

  goToVaccinationDetai(v: Vaccine) {
    // ajuste a rota conforme seu app
    //this.router.navigate(['/vaccinations', v.id]);
  }
}