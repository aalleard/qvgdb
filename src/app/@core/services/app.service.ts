import { Injectable } from '@angular/core';

const regex = /^\d/gm;
const sSoundsPath: string = './assets/sounds/';
/**
 * Provides a common service for the whole application
 */
@Injectable({
  providedIn: 'root',
})
export class AppService {
  private _oSounds: any = {
    '0000100_0001000': null,
    '0002000_0032000': null,
    '0064000': null,
    '0125000_0250000': null,
    '0500000': null,
    '1000000': null,
    correct_answer: null,
    end_jingle: null,
    end_theme: null,
    final_answer: null,
    'joker_50-50': null,
    lets_play: null,
    main_theme: null,
    phone_a_friend: null,
    public_vote: null,
    telephone: null,
    wrong_answer: null,
  };

  public loadSounds(): void {
    for (let sKey in this._oSounds) {
      this._oSounds[sKey] = new Audio();
      this._oSounds[sKey].src = sSoundsPath + sKey + '.mp3';
      this._oSounds[sKey].load();
      this._oSounds[sKey].loop = !!sKey.match(regex);
    }
  }

  public pauseSound(sSound: string): void {
    this._oSounds[sSound].pause();
  }

  public pauseAllSounds() {
    for (let sKey in this._oSounds) {
      this._oSounds[sKey].pause();
    }
  }

  public playSound(sSound: string, fCallback: Function = null) {
    this._oSounds[sSound].onended = fCallback;
    this._oSounds[sSound].load();
    this._oSounds[sSound].play();
  }

  public resumeSound(sSound: string, fCallback: Function = null) {
    this._oSounds[sSound].onended = fCallback;
    this._oSounds[sSound].play();
  }
}
