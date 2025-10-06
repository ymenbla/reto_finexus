import { Routes } from '@angular/router';

export const productRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./components/product-table/product-table.component').then((m) => m.ProductTableComponent),
  },
  {
    path: 'new',
    loadComponent: () =>
      import('./components/product-form/product-form.component').then((m) => m.ProductFormComponent),
  },
  {
    path: 'edit/:id',
    loadComponent: () =>
      import('./components/product-form/product-form.component').then((m) => m.ProductFormComponent),
  },
  {
    path: 'detail/:id',
    loadComponent: () =>
      import('./components/product-detail/product-detail.component').then((m) => m.ProductDetailComponent),
  },
];
