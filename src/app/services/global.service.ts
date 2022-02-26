import { Injectable } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { WordsService } from './words.service';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {

  constructor(
    private wordsService: WordsService,
    private alertController: AlertController,
  ) { }

  state = 'playing';

  activeGuess: number = 0;
  activeLetter: number = 0;

  guessedWords: string[] = ["", "", "", "", "", ""];

  sharedEmojis = []

  playerGuesses = {
    correct: [],
    contains: [],
    incorrect : []
  };

  shareModalEnabled = false;
  
  setHighlight() {

    let elements = document
      .getElementsByClassName("line")[this.activeGuess]
      .getElementsByClassName("box");
    for (let element of elements) {
      element.classList.remove('selected');
      element.classList.remove('inactive');
    }

    if (this.activeLetter < 5 && this.state === 'playing') {
      let element = document
        .getElementsByClassName("line")[this.activeGuess]
        .getElementsByClassName("box")[this.activeLetter];
    
      element.classList.add('selected');
    }

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
  }

  highlightKeyboard() {
    let lines = document.getElementsByClassName("line");

    for (let i of [6,7,8]) {
      for (let key of lines[i].getElementsByClassName("key")) {
        if (!key.innerHTML.includes("ENTER") && !key.innerHTML.includes("backspace")) {
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
  }

  setLetter(letter) {
    if (this.activeLetter < 5) {
      let element = document
        .getElementsByClassName("line")[this.activeGuess]
        .getElementsByClassName("box")[this.activeLetter];

      element.innerHTML = letter;

      this.activeLetter += 1;

      this.setHighlight();
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
    if (this.wordsService.acceptedGuesses.filter(x => x == this.getLastGuesseWord()).length > 0) {
      if (this.activeLetter === 5) {
        let emojis = "";
        this.guessedWords.push(this.getLastGuesseWord());
    
        let guess = this.getLastGuesseWord();
        let correctWord = this.wordsService.getWordOfTheDay();
  
        let letters = new Array(correctWord.length);
        let remainingLetters = correctWord.split("");
      
        for (let i = 0; i < letters.length; i++) {
          const guessedLetter = guess.charAt(i);
          let result = null;
      
          if (correctWord.charAt(i) === guessedLetter) {
            result = 1;
            emojis += "🟩";
            remainingLetters[i] = null;
            if (!this.playerGuesses.correct.includes(guessedLetter)) {this.playerGuesses.correct.push(guessedLetter)};
          }
      
          letters[i] = {
            value: guessedLetter,
            result,
          };
        }
      
        for (let i = 0; i < letters.length; i++) {
          if (letters[i].result !== null) {
            continue;
          }
      
          const guessedLetter = guess.charAt(i);
          const index = remainingLetters.indexOf(guessedLetter);
          if (index !== -1) {
            letters[i].result = 2;
            emojis += "🟨";
            if (!this.playerGuesses.contains.includes(guessedLetter)) {this.playerGuesses.contains.push(guessedLetter)};
            remainingLetters[index] = null;
          } else {
            if (!this.playerGuesses.incorrect.includes(guessedLetter)) {this.playerGuesses.incorrect.push(guessedLetter)};
            letters[i].result = 0;
            emojis += "⬛";
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
        this.highlightKeyboard();

        if (guess == correctWord) {
          this.state = 'won';
          this.showShareModal();
        }
        this.sharedEmojis.push(emojis);
      }
    } else {
      this.presentAlert('Word not present in Word List.');
    }
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

  getState() {
    return this.state;
  }

  getSharedEmojis() {
    return this.sharedEmojis;
  }

  copySharedEmojis() {
    let string = "I've just played Worder url-vai-vir-aqui \n\n";
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
