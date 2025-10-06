import { Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { ProductComponent } from './layout/pages/product/product.component';

export const routes: Routes = [

  {
    path: 'app',
    component: LayoutComponent,
    // canActivate: [authGuard],
    children: [
      {
        path: 'products',
        component: ProductComponent,
        loadChildren: () =>
          import('./layout/pages/product/product.routes').then(
            (m) => m.productRoutes
          ),
      },
      // { path: '', pathMatch: 'full', redirectTo: 'blank' }
    ]
  },

  { path: '**', redirectTo: 'app' }
];
