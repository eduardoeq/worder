import { Component } from '@angular/core';
import { GlobalService } from '../services/global.service';
import { Storage } from '@ionic/storage-angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  constructor(
    private globalService: GlobalService
  ) {}

  ngOnInit() {
    this.globalService.setHighlight();
  }

  showModal() {
    this.globalService.showShareModal();
  }

  isShowModalEnabled() {
    return this.globalService.getShowShareModal();
  }
}
