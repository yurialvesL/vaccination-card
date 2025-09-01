import { Injectable } from '@angular/core';
import { StorageService } from '@app/shared/services/storage/storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthStorageService {

  constructor(private storageService: StorageService) {}

  async setToken(token: string): Promise<void> {
    await this.storageService.set('auth_token', token, 24 * 60 * 60 * 1000); 
  }

  async getToken(): Promise<string | null> {
    return this.storageService.get('auth_token');
  }

  async removeToken(): Promise<void> {
    await this.storageService.remove('auth_token');
  }
}
