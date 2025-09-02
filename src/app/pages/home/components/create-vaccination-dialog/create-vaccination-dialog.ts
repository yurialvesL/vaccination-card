import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthStorageService } from '@app/services/auth/auth-storage-service';
import { PersonStorageService } from '@app/services/person/person-storage-service';
import { Dose } from '@app/services/vaccination/models/request/create-vaccination-request.dto';
import { VaccinationService } from '@app/services/vaccination/vaccination-service';
import { Vaccine } from '@app/services/vaccine/models/vaccine.dto';
import { catchError, EMPTY, tap } from 'rxjs';

@Component({
  selector: 'app-create-vaccination-dialog',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule,
    MatDialogModule, MatFormFieldModule, MatSelectModule,
    MatButtonModule, MatIconModule, MatDividerModule
  ],
  templateUrl: './create-vaccination-dialog.html',
  styleUrl: './create-vaccination-dialog.scss'
})
export class CreateVaccinationDialog {
  vaccines: Vaccine[] = [];
  doseOptions = [
    { value: Dose.firstDose,           label: '1ª dose' },
    { value: Dose.secondDose,          label: '2ª dose' },
    { value: Dose.thirdDose,           label: '3ª dose' },
    { value: Dose.firstReinforcement,  label: '1º Booster' },
    { value: Dose.secondReinforcement, label: '2º Booster' },
  ];
  form: any;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<CreateVaccinationDialog, { vaccineId: string; dose: Dose }>,
    @Inject(MAT_DIALOG_DATA) public data: Vaccine[],
     private readonly vaccinationService: VaccinationService,
      private readonly authStorage: AuthStorageService,
      private readonly personStorage: PersonStorageService,
      private readonly snack: MatSnackBar,

  ) {
    this.vaccines = data ?? [];
    this.form = this.fb.nonNullable.group({
    vaccineId: ['', Validators.required],
    dose: [null as Dose | null, Validators.required]
  });
  }

  close(): void { this.dialogRef.close(); }

 async save(): Promise<void> {
   let token = "";
   let personId = await this.personStorage.getPerson().then(p => p?.id ?? '');
   await this.authStorage.getToken().then(t => token = t ?? '');


   this.vaccinationService.createVaccination({
     PersonId: personId,
     VaccineId: this.form.value.vaccineId,
     Dose: this.form.value.dose
   }, token).subscribe({
     next: () => {
       this.snack.open('Vaccination created.', 'Close', { duration: 2500 });
       this.dialogRef.close(this.form.getRawValue());
     },
     error: () => {
       this.snack.open('Failed to create vaccination.', 'Close', { duration: 3500 });
     }
   });

   if (this.form.invalid) { this.form.markAllAsTouched(); return; }
     this.dialogRef.close(this.form.getRawValue());
  }
}
