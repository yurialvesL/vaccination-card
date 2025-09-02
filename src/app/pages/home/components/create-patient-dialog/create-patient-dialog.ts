import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { NgxMaskDirective } from 'ngx-mask';

@Component({
  selector: 'app-create-patient-dialog',
  imports: [CommonModule, ReactiveFormsModule,
    MatDialogModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule,
    MatDividerModule, MatSelectModule, MatDatepickerModule, MatNativeDateModule,
    NgxMaskDirective],
  templateUrl: './create-patient-dialog.html',
  styleUrl: './create-patient-dialog.scss'
})
export class CreatePatientDialog {
    hide = true;
  readonly sexes = ['Masculine', 'Feminine'] as const;

  form: any;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<CreatePatientDialog>,
    @Inject(MAT_DIALOG_DATA) public data: unknown
  ) {
    this.form = this.fb.nonNullable.group({
      name: ['', Validators.required],
      cpf: ['', [Validators.required, Validators.pattern(/^\d{11}$/)]],
      birthDate: [null as Date | null, Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      sex: ['Masculine', Validators.required]
    });
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.dialogRef.close(this.form.getRawValue());
  }

}
