import { Injectable } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Guesses } from '../interfaces/Guesses';
import { Letter } from '../interfaces/Letter';
import { WorderData } from '../interfaces/WorderData';
import { StorageService } from './storage.service';
import { WordsService } from './words.service';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {

  constructor(
    private wordsService: WordsService,
    private alertController: AlertController,
    private storageService: StorageService
  ) { }

  state = 'playing';

  activeGuess: number = 0;
  activeLetter: number = 0;

  guessedWords: string[] = [];

  sharedEmojis: string[] = []

  playerGuesses: Guesses = {
    correct: [],
    contains: [],
    incorrect : []
  };

  shareModalEnabled: boolean = false;
  shareTutorialEnabled: boolean = false;
  
  setHighlight() {

    try {
      let elements = document
      .getElementsByClassName("line")[this.activeGuess]
      .getElementsByClassName("box");

      for (let element of elements) {
        element.classList.remove('selected');
        element.classList.remove('inactive');
      }
    } catch {
      console.log('Some elements we are trying to highlight are not present.')    
    }

    try {
      if (this.activeLetter < 5 && this.state === 'playing') {
        let element = document
          .getElementsByClassName("line")[this.activeGuess]
          .getElementsByClassName("box")[this.activeLetter];
      
        element.classList.add('selected');
      }
    } catch {
      console.log('Active element we are trying to highlight are not present.')    
    }
    

    try {
      if (this.state === 'playing') {
        let lines = document.getElementsByClassName("line");
        for (var i = 0; i < lines.length; i++) {
          if (i > this.activeGuess) {
            for (let element of lines[i].getElementsByClassName("box")) {
              element.classList.add('inactive');
            }
          }
        }
      }
    } catch {
      console.log('The line we are trying to highlight is not present.')    
    }
  }

  setKeyboardHighlight() {
    try {
      let lines = document.getElementsByClassName("line");

      for (let i of [6,7,8]) {
        for (let key of lines[i].getElementsByClassName("key")) {
          if (!key.innerHTML.includes("Try") && !key.innerHTML.includes("backspace")) {
            let letter = key.innerHTML.toLowerCase().replace(" ", "")[0];
            if (this.playerGuesses.correct.includes(letter.replace(" ", "")[0])) {
              key.classList.add("correct");
              key.classList.remove("contains"); 
              key.classList.remove("incorrect");  
            } else if (this.playerGuesses.contains.includes(letter.replace(" ", "")[0])) {
              key.classList.remove("correct");
              key.classList.add("contains"); 
              key.classList.remove("incorrect");  
            } else if (this.playerGuesses.incorrect.includes(letter.replace(" ", "")[0])) {
              key.classList.remove("correct");
              key.classList.remove("contains"); 
              key.classList.add("incorrect");  
            };
          }
        }
      }
    } catch {
      console.log('Missing keys to highlight.')
    }
  }

  setLetter(letter: string) {
    if (this.activeLetter < 5) {
      let element = document
        .getElementsByClassName("line")[this.activeGuess]
        .getElementsByClassName("box")[this.activeLetter];

      element.innerHTML = letter;

      this.activeLetter += 1;

      this.setHighlight();
    }
  }

  setWord(word: string, line: number) {
    for (var i = 0; i<word.length; i++) {
      let element = document
      .getElementsByClassName("line")[line]
      .getElementsByClassName("box")[i];

      element.innerHTML = word[i].toUpperCase();
    }
  }

  deleteLetter() {
    if (this.activeLetter > 0) {
      let element = document
        .getElementsByClassName("line")[this.activeGuess]
        .getElementsByClassName("box")[this.activeLetter - 1];

      if (element.innerHTML !== '') {
        element.innerHTML = '';
      }
      
      this.activeLetter -= 1;
      this.setHighlight();
    }
  }

  getLastGuesseWord() {
    let elements = document
      .getElementsByClassName("line")[this.activeGuess]
      .getElementsByClassName("box");
    
    let word = "";
    for (let element of elements) {
       word += element.innerHTML;
    }
    return word.toLowerCase();
  }

  checkGuess() {
    if (this.wordsService.acceptedGuesses.filter(guessedWord => guessedWord == this.getLastGuesseWord()).length > 0) {
      if (this.activeLetter === 5) {
        let emojis: string = "";
        this.guessedWords.push(this.getLastGuesseWord());
    
        let guess: string = this.getLastGuesseWord();
        let correctWord: string = this.wordsService.getWordOfTheDay();
  
        let letters: Letter[] = new Array(correctWord.length);
        let remainingLetters: string[] = correctWord.split("");
      
        for (let i = 0; i < letters.length; i++) {
          let guessedLetter: string = guess.charAt(i);
          let result: number = null;
      
          if (correctWord.charAt(i) === guessedLetter) {
            result = 1;
            emojis += "????";
            remainingLetters[i] = null;
            if (!this.playerGuesses.correct.includes(guessedLetter)) {this.playerGuesses.correct.push(guessedLetter)};
          }
      
          letters[i] = {
            value: guessedLetter,
            result: result,
          };
        }
      
        for (let i: number = 0; i < letters.length; i++) {
          if (letters[i].result !== null) {
            continue;
          }
      
          const guessedLetter = guess.charAt(i);
          const index = remainingLetters.indexOf(guessedLetter);
          if (index !== -1) {
            letters[i].result = 2;
            emojis += "????";
            if (!this.playerGuesses.contains.includes(guessedLetter)) {this.playerGuesses.contains.push(guessedLetter)};
            remainingLetters[index] = null;
          } else {
            if (!this.playerGuesses.incorrect.includes(guessedLetter)) {this.playerGuesses.incorrect.push(guessedLetter)};
            letters[i].result = 0;
            emojis += "???";
          }
        }    
  
        let elements = document
          .getElementsByClassName("line")[this.activeGuess]
          .getElementsByClassName("box");
        
        for (var i = 0; i < 5; i++) {
          if (letters[i].result === 1) {
            elements[i].classList.add("correct");
          } else if (letters[i].result === 2) {
            elements[i].classList.add("contains");
          } else {
            elements[i].classList.add("incorrect");
          }
        }
  
        this.activeLetter = 0;
        this.activeGuess += 1;

        if (guess !== correctWord && this.activeGuess == 6) {
          this.state = 'lost';
          this.showShareModal();
        }
  
        this.setHighlight();
        this.setKeyboardHighlight();

        if (guess == correctWord) {
          this.state = 'won';
          this.showShareModal();
        }
        this.sharedEmojis.push(emojis);
        
        const toStore: WorderData = {
          wordOfTheDay: correctWord,
          activeGuess: this.activeGuess,
          activeLetter: this.activeLetter,
          guessedWords: this.guessedWords,
          playerGuesses: this.playerGuesses
        }

        this.storageService.store('data', toStore);
      }
    } else {
      this.presentAlert('Word not present in Word List.');
    }
  }

  setActiveGuess(activeGuess: number) {
    this.activeGuess = activeGuess;
  }

  setActiveLetter(activeLetter: number) {
    this.activeLetter = activeLetter;
  }

  setGuessedWords(guessedWords: string[]) {
    this.guessedWords = guessedWords;
  }

  setPlayerGuesses(playerGuesses: Guesses) {
    this.playerGuesses = playerGuesses;
  }

  getShowShareModal() {
    return this.shareModalEnabled;
  }

  showShareModal() {
    this.shareModalEnabled = true;
  }

  closeShareModal() {
    this.shareModalEnabled = false;
  }

  getShowTutorialModal() {
    return this.shareTutorialEnabled;
  }

  showTutorialModal() {
    this.shareTutorialEnabled = true;
  }

  closeTutorialModal() {
    this.shareTutorialEnabled = false;
  }

  getState() {
    return this.state;
  }

  getSharedEmojis() {
    return this.sharedEmojis;
  }

  copySharedEmojis() {
    let string = "I've just played Worder https://worder.web.app/ \n\n";
    for (let line of this.sharedEmojis) {
      string += line + "\n";
    }
    navigator.clipboard.writeText(string).then(function() {
      console.log('Copied to the clipboard!');;
    }, function(err) {
      console.error('Oops. Looks like there was a problem', err);
    });
    this.presentAlert('Copied to the clipboard!');;
  }

  async presentAlert(message) {
    const alert = await this.alertController.create({
      header: 'Alert',
      message: message,
      buttons: ['OK'],
      mode: 'ios'
    });

    await alert.present();
  }
}
