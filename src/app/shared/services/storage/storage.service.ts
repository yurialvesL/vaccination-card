import { Injectable } from '@angular/core';
import localForage from 'localforage';

type Cached<T> = { v: T; e?: number }; // valor + expiração opcional (ms epoch)

@Injectable({ providedIn: 'root' })
export class StorageService {
  private store = localForage.createInstance({
    name: 'vaccination-card',   // nome do DB
    storeName: 'app',           // “tabela”
    // prioridade de drivers (IndexedDB -> localStorage)
    driver: [localForage.INDEXEDDB, localForage.LOCALSTORAGE]
  });

  /** set item; se passar ttlMs, expira após esse tempo */
  async set<T>(key: string, value: T, ttlMs?: number): Promise<void> {
    const payload: Cached<T> = ttlMs
      ? { v: value, e: Date.now() + ttlMs }
      : { v: value };
    await this.store.setItem(key, payload);
  }

  /** get item; retorna null se não existir ou estiver expirado */
  async get<T>(key: string): Promise<T | null> {
    const raw = (await this.store.getItem<Cached<T> | null>(key)) ?? null;
    if (!raw) return null;
    if (typeof raw === 'object' && raw && 'v' in raw) {
      if (raw.e && raw.e <= Date.now()) { await this.store.removeItem(key); return null; }
      return raw.v as T;
    }
    // compat: se gravou sem wrapper
    return raw as unknown as T;
  }

  async remove(key: string): Promise<void> {
    await this.store.removeItem(key);
  }

  async clear(): Promise<void> {
    await this.store.clear();
  }
}
