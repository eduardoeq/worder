import { Component, OnInit } from '@angular/core';
import { GlobalService } from '../services/global.service';

@Component({
  selector: 'app-tutorial',
  templateUrl: './tutorial.component.html',
  styleUrls: ['./tutorial.component.scss'],
})
export class TutorialComponent implements OnInit {

  constructor(
    private globalService: GlobalService
  ) { }

  ngOnInit() {}

  closeTutorial() {
    return this.globalService.closeTutorialModal();
  }

}
