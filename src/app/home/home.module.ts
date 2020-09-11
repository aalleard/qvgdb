import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { CoreModule } from '@core';
import { SharedModule } from '@shared';
import { HomeRoutingModule } from './home-routing.module';
import { HomePage } from './pages/home/home.page';
import { SplashPage } from './pages/splash/splash.page';

@NgModule({
	imports: [CommonModule, TranslateModule, CoreModule, SharedModule, HomeRoutingModule],
	declarations: [HomePage, SplashPage],
})
export class HomeModule {}
