import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Person } from '@app/services/person/models/person.model';
import { NgxMaskDirective, NgxMaskPipe } from 'ngx-mask';

@Component({
  selector: 'app-confirm-exclude-dialog',
  imports: [CommonModule, ReactiveFormsModule,
    MatDialogModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule,
    MatDividerModule, MatSelectModule, MatDatepickerModule, MatNativeDateModule,NgxMaskPipe,
    NgxMaskDirective],
  templateUrl: './confirm-exclude-dialog.html',
  styleUrl: './confirm-exclude-dialog.scss'
})
export class ConfirmExcludeDialog {
  constructor( private dialogRef: MatDialogRef<ConfirmExcludeDialog>,
    @Inject(MAT_DIALOG_DATA) public data: Person){}


    close()   { this.dialogRef.close(false); }
  confirm() { this.dialogRef.close(true); }
}
