import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor(
    private storage: Storage
  ) { }

  async store(key, value) {
    await this.storage.create();
    this.storage.set(key, value);
  }

  async retrieve(key) {
    await this.storage.create();
    return this.storage.get(key);
  }
}
