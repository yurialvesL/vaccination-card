import { Injectable } from '@angular/core';
import { Person } from './models/person.model';
import { StorageService } from '@app/shared/services/storage/storage.service';

@Injectable({
  providedIn: 'root'
})
export class PersonStorageService {
  constructor(private storageService: StorageService) {}

  async setPerson(person: Person): Promise<void> {
    await this.storageService.set('person', person);
  }

  async getPerson(): Promise<Person | null> {
    return this.storageService.get('person');
  }

  async removePerson(): Promise<void> {
    await this.storageService.remove('person');
  }
}
