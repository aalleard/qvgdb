import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { extract } from '@app/i18n';
import { HomePage } from './pages/home/home.page';
import { SplashPage } from './pages/splash/splash.page';
import { Shell } from '@app/shell/shell.service';

const routes: Routes = [
	Shell.childRoutes([
		{ path: '', redirectTo: '/splash', pathMatch: 'full' },
		{ path: 'home', component: HomePage, data: { title: extract('Home') } },
		{ path: 'splash', component: SplashPage, data: { title: extract('Splash') } },
	]),
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
	providers: [],
})
export class HomeRoutingModule {}
