import { Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';

export const routes: Routes = [

  {
    path: 'app',
    component: LayoutComponent,
    // canActivate: [authGuard],
    children: [
      // { path: '', pathMatch: 'full', redirectTo: 'blank' }
    ]
  },

  { path: '**', redirectTo: 'app' }
];
