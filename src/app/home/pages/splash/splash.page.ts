import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { AppService } from '@app/@core/services/app.service';

@Component({
  selector: 'app-home',
  templateUrl: './splash.page.html',
  styleUrls: ['./splash.page.scss'],
})
export class SplashPage {
  constructor(private oRouter: Router, private appService: AppService) {}

  public onClickPage(): void {
    this.appService.playSound('lets_play');
    setTimeout(() => {
      this.oRouter.navigate(['home']);
    }, 5000);
  }

  public onRightClick(oEvent: any): void {
    oEvent.preventDefault();
    this.appService.playSound('main_theme');
  }
}
