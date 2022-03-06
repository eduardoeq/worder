import { Component } from '@angular/core';
import { GlobalService } from '../services/global.service';

@Component({
  selector: 'app-keyboard',
  templateUrl: './keyboard.component.html',
  styleUrls: ['./keyboard.component.scss'],
})
export class KeyboardComponent {

  constructor(
    private globalService: GlobalService
  ) {}

  stSetOfKeys = ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"];
  ndSetOfKeys = ["A", "S", "D", "F", "G", "H", "J", "K", "L", "backspace"];
  rdSetOfKeys = ["Z", "X", "C", "V", "B", "N", "M", "Try"];

  pressKey(letter) {
    if (this.isKeyboardEnabled()) {
      if (letter === 'Try') {
        if (this.globalService.activeLetter === 5) {
          this.globalService.checkGuess();
        }
      } else if (letter === 'backspace') {
        this.globalService.deleteLetter();
      } else {
        this.globalService.setLetter(letter);
      }
    }
  }

  isKeyboardEnabled() {
    let state = this.globalService.getState();
    if (state === 'won' || state === 'lost') {
      return false
    } else {
      return true
    }
  }
}
