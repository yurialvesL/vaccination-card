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
import { NgxMaskDirective } from 'ngx-mask';
import { map, Observable, startWith, from } from 'rxjs';






type Sex = 'Masculine' | 'Feminine';
interface Vaccine { name: string; quantity: number; }



const MOCK: Person[] = [
  {
    id: '1',
    name: 'Albert Flores',
    cpf: '050.060.05-59',
    birthDate: new Date('1994-03-28'),
    sex: 'Masculine',
    isAdmin: false
  }
];


@Component({
  selector: 'app-home',
  imports: [CommonModule, RouterModule, ReactiveFormsModule,
    MatFormFieldModule, MatInputModule, MatIconModule,
    MatListModule, MatButtonModule, MatRippleModule, MatCardModule,
    NgxMaskDirective],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class Home {
  search = new FormControl<string>('', { nonNullable: true });
  token: string | null = null;
   vaccines: Vaccine[] = [
  { name: 'Vaccine A', quantity: 1 },
  { name: 'Vaccine B', quantity: 2 },
  { name: 'Vaccine C', quantity: 3 }
];

  /** muda entre encontrado e vazio conforme o CPF digitado */
  person$: Observable<Person | null> = this.search.valueChanges.pipe(
    startWith(this.search.value),
    map(v => this.findByCpfDigits(v))
  );

  constructor(private readonly personStorageService: PersonStorageService,
    private readonly authStorageService: AuthStorageService,
    private readonly router: Router,
    private readonly personService: PersonService
  ) { }


  ngOnInit() {

    this.authStorageService.getToken().then(token => {
      if (token) {
        this.token = token;
      }
    });

    console.log(this.token);

    this.personStorageService.getPerson().then(p => {
      if (p !==null) {
        this.search.setValue(p.cpf);
        this.person$
      }
    });

      //this.person$ =  from(this.personStorageService.getPerson());
      var p = this.personStorageService.getPerson();
      p.then(pp => {console.log(pp)});
      this.search.setValue("46298663886");
    }

   findByCpfDigits(cpfMasked: string | null): Person | null {
    let tokenValue = "";

    this.authStorageService.getToken().then(token => {
      if (token) {
        tokenValue = token;
      }
    });

    const digits = (cpfMasked ?? '').replace(/\D/g, '');
    if (!digits) return null;

    if(digits.length < 11) return null;

    this.personService.getPersonByCpf(digits, tokenValue).subscribe({
      next: person => {
        if (person) {
          var personSearch: Person = {
            id: person.PersonId,
            name: person.Name,
            cpf: person.CPF,
            birthDate: person.DateOfBirth,
            sex: person.Sex,
            isAdmin: person.IsAdmin
          };
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
}
