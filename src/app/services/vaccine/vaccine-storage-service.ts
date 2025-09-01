import { Injectable } from '@angular/core';
import { VaccineSummaryDto } from './models/response/get-all-vaccines-response.dto';
import { StorageService } from '@app/shared/services/storage/storage.service';

@Injectable({
  providedIn: 'root'
})
export class VaccineStorageService {
  constructor(private storageService: StorageService) {}

  async setVaccine(vaccine: VaccineSummaryDto[]): Promise<void> {
    await this.storageService.set('vaccine', vaccine);
  }

  async getVaccine(): Promise<VaccineSummaryDto[] | null> {
    return this.storageService.get('vaccine');
  }

  async removeVaccine(): Promise<void> {
    await this.storageService.remove('vaccine');
  }
}
