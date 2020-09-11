import { BrowserModule } from '@angular/platform-browser';
import { NgModule, LOCALE_ID } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { registerLocaleData } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import localeFr from '@angular/common/locales/fr';
import { TranslateModule } from '@ngx-translate/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { CoreModule } from '@core';
import { SharedModule } from '@shared';
import { HomeModule } from './home/home.module';
import { ShellModule } from './shell/shell.module';
import { AboutModule } from './about/about.module';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

registerLocaleData(localeFr);

@NgModule({
	imports: [
		BrowserModule,
		FormsModule,
		HttpClientModule,
		TranslateModule.forRoot(),
		NgbModule,
		CoreModule,
		SharedModule,
		ShellModule,
		HomeModule,
		AboutModule,
		AppRoutingModule, // must be imported as the last module as it contains the fallback route
	],
	declarations: [AppComponent],
	providers: [
		{ provide: LOCALE_ID, useValue: 'fr-FR'}
	],
	bootstrap: [AppComponent],
})
export class AppModule {}
