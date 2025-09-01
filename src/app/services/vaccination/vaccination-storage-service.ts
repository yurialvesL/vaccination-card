import { Injectable } from "@angular/core";
import { StorageService } from "@app/shared/services/storage/storage.service";
import { VaccinationSummaryDto } from "./models/response/get-vaccination-by-personId-response.dto";

@Injectable({
  providedIn: 'root'
})
export class VaccinationStorageService {
  constructor(private storageService: StorageService) {}

  async setVaccination(vaccination: VaccinationSummaryDto[]): Promise<void> {
    await this.storageService.set('vaccination', vaccination);
  }

  async getVaccination(): Promise<VaccinationSummaryDto[] | null> {
    return this.storageService.get('vaccination');
  }

  async removeVaccination(): Promise<void> {
    await this.storageService.remove('vaccination');
  }
}