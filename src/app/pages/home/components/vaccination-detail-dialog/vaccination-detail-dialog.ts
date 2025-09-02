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
import { MatListModule } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthStorageService } from '@app/services/auth/auth-storage-service';
import { Dose } from '@app/services/vaccination/models/request/create-vaccination-request.dto';
import { VaccinationSummaryDto } from '@app/services/vaccination/models/response/get-vaccination-by-personId-response.dto';
import { VaccinationService } from '@app/services/vaccination/vaccination-service';
import { NgxMaskDirective } from 'ngx-mask';
import { EMPTY } from 'rxjs/internal/observable/empty';
import { catchError } from 'rxjs/internal/operators/catchError';
import { tap } from 'rxjs/internal/operators/tap';

@Component({
  selector: 'app-vaccination-detail-dialog',
  imports: [CommonModule, ReactiveFormsModule,
    MatDialogModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule,
    MatDividerModule, MatSelectModule, MatDatepickerModule, MatNativeDateModule,
    NgxMaskDirective,MatListModule  ],
  templateUrl: './vaccination-detail-dialog.html',
  styleUrl: './vaccination-detail-dialog.scss'
})
export class VaccinationDetailDialog {
    items: VaccinationSummaryDto[] = [];


    constructor(
    private readonly ref: MatDialogRef<VaccinationDetailDialog, boolean>,
    @Inject(MAT_DIALOG_DATA) public data: VaccinationSummaryDto[],
    private readonly snack: MatSnackBar,
    private readonly vaccinationService: VaccinationService,
    private readonly authStorage: AuthStorageService
  ) {
    this.items = [...(data ?? [])]
      .sort((a, b) => Number(a.doseApplied) - Number(b.doseApplied));
  }

  close() { this.ref.close(false); }

  trackById = (_: number, v: VaccinationSummaryDto) => v.vaccinationId;

  doseLabel(dose: Dose): string {
    switch (dose) {
      case Dose.firstDose:          return '1º Dose';
      case Dose.secondDose:         return '2º Dose';
      case Dose.thirdDose:          return '3º Dose';
      case Dose.firstReinforcement: return '1º Booster';
      case Dose.secondReinforcement:return '2º Booster';
      default: return 'Dose';
    }
  }

  async deleteVaccination(ev: MouseEvent, item: VaccinationSummaryDto) {

    let token = "";
    await this.authStorage.getToken().then(t => token = t ?? '');

    ev.stopPropagation(); 
    const ok = confirm('Are you sure you want to delete this vaccination?');
    if (!ok) return;

    this.vaccinationService.deleteVaccinationById(item.vaccinationId, token ?? '').pipe(
      tap(() => {
        this.items = this.items.filter(x => x.vaccinationId !== item.vaccinationId);
        this.snack.open('Vaccination excluded.', 'Close', { duration: 2500 });
        this.ref.close(true); 
      }),
      catchError(() => {
        this.snack.open('Failed to exclude vaccination.', 'Close', { duration: 3500 });
        return EMPTY;
      })
    ).subscribe();
  }
}
