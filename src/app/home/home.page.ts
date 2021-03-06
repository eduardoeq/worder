import { Component } from '@angular/core';
import { GlobalService } from '../services/global.service';
import { Storage } from '@ionic/storage-angular';
import { StorageService } from '../services/storage.service';
import { WordsService } from '../services/words.service';
import { WorderData } from '../interfaces/WorderData';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  constructor(
    private globalService: GlobalService,
    private storageService: StorageService,
    private wordsService: WordsService
  ) {}

  cacheChecked: boolean = false;

  ngOnInit() {

    if (!this.cacheChecked) {
      this.checkCache();
    }

    this.storageService.retrieve('firstTime').then(res => {
      let data: boolean = res;
      if (data === null) {
        this.globalService.showTutorialModal();
        this.storageService.store('firstTime', false);
      }
    });
  }



  checkCache() {
    this.storageService.retrieve('data').then( res => {
      let data: WorderData = res;
      if (data) {
        if (data.wordOfTheDay === this.wordsService.getWordOfTheDay()) {
          this.globalService.setPlayerGuesses(data.playerGuesses);
  
          let guessedWords: string[] = [...new Set(data.guessedWords)];
  
          for (let word of guessedWords) {
            this.globalService.setWord(word, guessedWords.indexOf(word));
          }
  
          this.globalService.setActiveGuess(0);
          for (let i = 0; i < (guessedWords.length); i++) {
            this.globalService.setActiveLetter(5);
            this.globalService.checkGuess();
          }
  
          this.globalService.setGuessedWords([...new Set(data.guessedWords)]);
          this.globalService.setActiveLetter(data.activeLetter);
          this.globalService.setActiveGuess(data.activeGuess);
        }
      }
    });
    
    setTimeout(() => {
      this.globalService.setHighlight();
      this.globalService.setKeyboardHighlight();
    }, 250);
    this.cacheChecked = true;
  }

  showModal() {
    this.globalService.showShareModal();
  }

  showTutorial() {
    this.globalService.showTutorialModal();
  }

  isShowModalEnabled() {
    return this.globalService.getShowShareModal();
  }

  isShowTutorialEnabled() {
    return this.globalService.getShowTutorialModal();
  }
}
