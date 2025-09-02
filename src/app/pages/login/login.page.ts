import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { NgxMaskDirective, NgxMaskPipe } from 'ngx-mask';
import { MatDialog } from '@angular/material/dialog';
import { CreatePersonDialog } from './components/create-person-dialog/create-person-dialog';
import { AuthService } from '@app/services/auth/auth';
import { AuthStorageService } from '@app/services/auth/auth-storage-service';
import { PersonService } from '@app/services/person/person-service';
import { PersonStorageService } from '@app/services/person/person-storage-service';
import { CreatePersonRequestDto } from '@app/services/person/models/request/create-person-request.dto';
import { Person } from '@app/services/person/models/person.model';
import { LoginRequestDto } from '@app/services/auth/models/request/login-request.dto';
import { W } from '@angular/cdk/keycodes';

@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule, RouterModule,
    MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, NgxMaskDirective, NgxMaskPipe
  ],
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss']
})
export class LoginPage {
  hide = true;
  readonly dialog = inject(MatDialog);

  form = null as any;
  constructor(private fb: FormBuilder,
    private readonly authService: AuthService,
    private readonly authStorageService: AuthStorageService,
    private readonly router: Router,
    private readonly personService: PersonService,
    private readonly personServiceStorage: PersonStorageService) {
    this.form = this.fb.nonNullable.group({
      cpf: ['', [Validators.required, Validators.pattern(/^\d{11}$/)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const { cpf, password } = this.form.getRawValue(); 
    const loginRequest: LoginRequestDto = { cpf, password };
    this.authService.loginPerson(loginRequest).subscribe({
      next: async (response) => {
        this.authStorageService.setToken(response.token);
        console.log('Login successful:', response);
        await this.getDataPerson(cpf, response.token);
      },
      error: (error) => {
        console.error('Login failed:', error);
      }
    });

  }


  openCreatePersonDialog() {
    const dialogRef = this.dialog.open(CreatePersonDialog, {
      width: '100rem',
      data: {}
    });

    dialogRef.afterClosed().subscribe(async result => {
      if (result !== undefined) {
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
            let personLogin: LoginRequestDto = {
              cpf: result.cpf,
              password: result.password,
            };

            this.authService.loginPerson(personLogin).subscribe({
              next: async (response) => {
                 this.authStorageService.setToken(response.token);
                 await this.getDataPerson(result.cpf, response.token);
              },
              error: (error) => {
                console.error('Failed to create person:', error);
              }
            });
          }
        });
      }
    });   
  }

  async getDataPerson(cpf: string, token: string){
      this.personService.getPersonByCpf(cpf, token).subscribe({
      next: async (person) => {
        const personToGet: Person = {
          id: person.personId,
          name: person.name,
          cpf: person.cpf,
          sex: person.sex,
          birthDate: person.dateOfBirth,
          isAdmin: person.isAdmin
        };
        await this.personServiceStorage.setPerson(personToGet);
        await this.personServiceStorage.setPersonLoggedCpf(cpf);
        this.router.navigate(['/home']);
      },
      error: (error) => {
        console.error('Failed to load person data:', error);
      }
    });
      
    }
}
