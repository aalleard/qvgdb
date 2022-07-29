import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';

import { QuestionService } from '@app/@core/services/question/question.service';
import { Question } from '@app/@shared/models/question';
import { AppService } from '@app/@core/services/app.service';
import { Router } from '@angular/router';

export interface IEarning {
  earning: string;
  number: number;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit, OnDestroy {
  public bJoker1: boolean = false;
  public bJoker2: boolean = false;
  public bJoker3: boolean = false;
  public bShowAnswer: boolean = false;
  public bShowEarning: boolean = false;
  public bShowPublic: boolean = false;
  public sSelectedAnswer: string = null;

  private _aEarnings: IEarning[] = [];
  private _aQuestions: Question[] = [];
  private _bCorrectAnswer: boolean = false;
  private _bQuit: boolean = false;
  private _iCorrect: number = 0;
  private _oQuestion: Question = null;

  constructor(private oRouter: Router, private appService: AppService, private questionService: QuestionService) {}

  ngOnInit() {
    this.questionService.fetchQuestions$().subscribe((aQuestions) => {
      this.aQuestions = aQuestions;
      this._buildEarnings();
      this._nextQuestion();
    });
  }

  ngOnDestroy() {
    if (!this._bQuit) {
      this.appService.pauseAllSounds();
    }
  }

  private _5050(): void {
    this.appService.pauseSound(this.oQuestion.musique);
    this.oQuestion.perform5050();
    let fCallback = function () {
      setTimeout(() => {
        this.appService.resumeSound(this.oQuestion.musique);
      }, 500);
    }.bind(this);
    this.appService.playSound('joker_50-50', fCallback);
    this.bJoker1 = true;
  }

  public get aEarnings(): IEarning[] {
    return this._aEarnings;
  }

  public get aQuestions(): Question[] {
    return this._aQuestions;
  }

  public set aQuestions(aQuestions: Question[]) {
    this._aQuestions = [].concat(aQuestions);
  }

  private _buildEarnings(): void {
    this._aEarnings = [];
    for (let i = 0; i < this._aQuestions.length; i++) {
      let oEarning: IEarning = {
        earning: this._aQuestions[i].gain,
        number: i + 1,
      };
      this._aEarnings.push(oEarning);
    }
  }

  private _endGame(): void {
    this.bShowEarning = true;
    this.appService.playSound('end_jingle');
  }

  public getAnswerClass(sAnswer: string): string {
    // No answer selected
    if (!this.sSelectedAnswer) {
      return null;
    }

    if (this.bShowAnswer) {
      // Show correct answer

      // The answer is correct
      if (this.oQuestion.reponse === sAnswer) {
        return 'correct';
      } else {
        // The answer is not correct {}
        if (this.sSelectedAnswer === sAnswer) {
          return 'incorrect';
        } else {
          return null;
        }
      }
    } else {
      // Show selected answer
      if (this.sSelectedAnswer === sAnswer) {
        return 'selected';
      }
    }
  }

  public getEarningClass(iIndex: number): string {
    if (iIndex === this._iCorrect) {
      return 'selected';
    }

    if (iIndex < this._iCorrect) {
      return 'validated';
    }

    return null;
  }

  private _handleKeyEvent(oEvent: any) {
    let sCharCode = String.fromCharCode(oEvent.which).toLowerCase();
    console.log(sCharCode);
    console.log(oEvent.which);
    if (sCharCode === 'a') {
      this._selectAnswer('A');
      oEvent.preventDefault();
    }
    if (sCharCode === 'b') {
      this._selectAnswer('B');
      oEvent.preventDefault();
    }
    if (sCharCode === 'c') {
      this._selectAnswer('C');
      oEvent.preventDefault();
    }
    if (sCharCode === 'd') {
      this._selectAnswer('D');
      oEvent.preventDefault();
    }
    if (sCharCode === 'g') {
      this._quitGame();
      oEvent.preventDefault();
    }
    if (sCharCode === '1') {
      this._5050();
      oEvent.preventDefault();
    }
    if (sCharCode === '2') {
      this._phoneAFriend();
      oEvent.preventDefault();
    }
    if (sCharCode === '3') {
      this._publicVote();
      oEvent.preventDefault();
    }
    if (sCharCode === '\r') {
      this._showAnswer();
      oEvent.preventDefault();
    }
  }

  /**
   * Handler for keyboard input on a MacOS device
   * @param oEvent Key event
   */
  protected _handleMacKeyEvents(oEvent: any) {
    // All actions must be done with ctrl key
    if (!oEvent.metaKey) return;

    this._handleKeyEvent(oEvent);
  }

  /**
   * Handler for keyboard input on a Windows device
   * @param oEvent Key event
   */
  protected _handleWindowsKeyEvents(oEvent: any) {
    // All actions must be done with ctrl key
    if (!oEvent.ctrlKey) return;

    this._handleKeyEvent(oEvent);
  }

  private _nextQuestion(): void {
    this._bCorrectAnswer = false;
    this.bShowAnswer = false;
    this.bShowEarning = false;
    this.bShowPublic = false;
    this.sSelectedAnswer = null;
    if (this.aQuestions.length) {
      this.oQuestion = this.aQuestions.shift();
      this.appService.playSound(this.oQuestion.musique);
    } else {
      this._endGame();
    }
  }

  public onClick5050(): void {
    if (!this.bJoker1) {
      this._5050();
    }
  }

  public onClickAnswer(sAnswer: string): void {
    this._selectAnswer(sAnswer);
  }

  public onClickNextQuestion(): void {
    this._nextQuestion();
  }

  public onClickPhone(): void {
    if (!this.bJoker2) {
      this._phoneAFriend();
    }
  }

  public onClickPublic(): void {
    if (!this.bJoker3) {
      this._publicVote();
    }
  }

  public onClickShowAnswer(): void {
    this._showAnswer();
  }

  /**
   * Event that catches every key strokes
   * @param oEvent
   */
  @HostListener('document:keydown', ['$event'])
  public onKeyDown(oEvent: any) {
    // Detect platform
    if (navigator.platform.match('Mac')) {
      this._handleMacKeyEvents(oEvent);
    } else {
      this._handleWindowsKeyEvents(oEvent);
    }
  }

  public get oQuestion(): Question {
    return this._oQuestion;
  }

  public set oQuestion(oQuestion: Question) {
    this._oQuestion = oQuestion;
  }

  private _phoneAFriend(): void {
    this.appService.pauseSound(this.oQuestion.musique);
    let fCallback = function () {
      setTimeout(() => {
        this.appService.resumeSound(this.oQuestion.musique);
      }, 500);
    }.bind(this);
    this.appService.playSound('telephone', fCallback);
    this.bJoker2 = true;
  }

  private _publicVote(): void {
    this.appService.pauseSound(this.oQuestion.musique);
    let fCallback = function () {
      setTimeout(() => {
        this.appService.resumeSound(this.oQuestion.musique);
      }, 500);
    }.bind(this);
    this.appService.playSound('public_vote', fCallback);
    setTimeout(() => {
      this.bShowPublic = true;
    }, 32000);
    this.bJoker3 = true;
  }

  private _quitGame() {
    this._bQuit = true;
    this.appService.pauseAllSounds();
    this.appService.playSound('end_theme');
    this.oRouter.navigate(['splash']);
  }

  public get sEarning(): string {
    let sEarning = !!this._aEarnings[this._iCorrect - 1] ? this._aEarnings[this._iCorrect - 1].earning : 'Aucun gain';

    return sEarning;
  }

  private _selectAnswer(sAnswer: string): void {
    this.sSelectedAnswer = sAnswer;
    if (!this.oQuestion.dernierMot) {
      setTimeout(() => {
        this._showAnswer();
      }, 1000);
    } else {
      this.appService.playSound('final_answer');
      this.appService.pauseSound(this.oQuestion.musique);
    }
  }

  private _showAnswer() {
    this.bShowAnswer = true;
    if (this.oQuestion.reponse === this.sSelectedAnswer) {
      this._bCorrectAnswer = true;
      this.appService.playSound('correct_answer');
    } else {
      this._bCorrectAnswer = false;
      this.appService.playSound('wrong_answer');
    }
    this.appService.pauseSound('final_answer');
    this.appService.pauseSound(this.oQuestion.musique);
    setTimeout(() => {
      this._showEarnings();
    }, 2000);
  }

  private _showEarnings() {
    if (this._bCorrectAnswer) {
      this._iCorrect++;
    }
    this.bShowEarning = true;
    setTimeout(() => {
      this._nextQuestion();
    }, 5000);
  }
}
