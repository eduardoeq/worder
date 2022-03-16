import { Component, OnInit } from '@angular/core';
import { interval, Observable, Subscription } from 'rxjs';
import { GlobalService } from '../services/global.service';
import { WordsService } from '../services/words.service';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
})
export class ModalComponent implements OnInit {

  subscription: Subscription;

  public count: number = 0;
  counter; 

  constructor(
    private globalService: GlobalService,
    private wordService: WordsService
  ) {}

  ngOnInit() {
    const source: Observable<number> = interval(1000);
    const counter = document.getElementById('counter');
    this.subscription = source.subscribe( () => {
      const actualTime = new Date(Date.now());
      const endOfDay = new Date(actualTime.getFullYear(), actualTime.getMonth(), actualTime.getDate() + 1, 0, 0, 0);
      const timeRemaining = endOfDay.getTime() - actualTime.getTime();
      const seconds = ('0' + String(Math.floor((timeRemaining/1000 % 60)))).slice(-2);
      const minutes = ('0' + String(Math.floor((timeRemaining/1000/60 % 60)))).slice(-2);
      const hours = ('0' + String(Math.floor((timeRemaining/(1000*60*60)) % 24))).slice(-2);

      counter.textContent = hours + ':' + minutes + ':' + seconds;
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  closeModal() {
    return this.globalService.closeShareModal();
  }

  getGameState() {
    return this.globalService.getState();
  }

  isShareButtonEnabled() {
    let state = this.globalService.getState();
    return (state === 'won' || state === 'lost') ? true : false;
  }

  getWordOfTheDay() {
    return this.wordService.getWordOfTheDay();
  }

  getEmojis() {
    return this.globalService.getSharedEmojis();
  }

  share() {
    this.globalService.copySharedEmojis();
  }
  
}
