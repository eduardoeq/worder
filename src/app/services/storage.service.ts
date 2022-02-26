import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor(
    private storage: Storage
  ) { }

  async ngOnInit() {
    await this.storage.create();
  }

  store(key, value) {
    this.storage.set(key, value);
  }

  retrieve(key) {
    this.storage.get(key).then( data => {
      return data;
    });
  }
}
