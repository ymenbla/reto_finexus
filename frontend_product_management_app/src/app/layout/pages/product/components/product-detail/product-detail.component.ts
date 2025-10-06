import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { ProductService, Product } from '../../product.service';
import { MatCardModule } from '@angular/material/card';
import { CurrencyPipe, DatePipe, NgIf } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-product-detail',
  imports: [
    MatCardModule,MatProgressSpinnerModule,MatButtonModule,
    CurrencyPipe,DatePipe,
    NgIf
  ],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.scss'
})
export class ProductDetailComponent {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private productService = inject(ProductService);
  private snackBar = inject(MatSnackBar);

  product!: Product;

  loading = true;

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.productService.getProductById(+id).subscribe({
        next: (data) => {
          this.product = data;
          this.loading = false;
        },
        error: () => {
          this.snackBar.open('Error al cargar producto', 'Cerrar', { duration: 3000 });
          this.router.navigate(['app','products']);
        },
      });
    } else {
      this.router.navigate(['app','products']);
    }
  }

  goBack(): void {
    this.router.navigate(['app','products']);
  }
}
