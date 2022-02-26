import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { HomePage } from './home.page';

import { HomePageRoutingModule } from './home-routing.module';

import { KeyboardComponent } from '../keyboard/keyboard.component';
import { GuessesComponent } from '../guesses/guesses.component';
import { GuessComponent } from '../guess/guess.component';
import { ModalComponent } from '../modal/modal.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule
  ],
  declarations: [
    HomePage,
    GuessComponent,
    GuessesComponent,
    KeyboardComponent,
    ModalComponent
  ],
})
export class HomePageModule {}
