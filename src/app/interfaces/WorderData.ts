import { Guesses } from "./Guesses";

export interface WorderData {
    wordOfTheDay: string,
    guessedWords: string[],
    activeLetter : number,
    activeGuess: number,
    playerGuesses: Guesses
}
