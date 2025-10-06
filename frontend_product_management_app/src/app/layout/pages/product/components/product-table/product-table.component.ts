import { Component, Inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { ProductService, Product } from '../../product.service';

@Component({
  selector: 'app-product-table',
  imports: [
    CommonModule, RouterModule,MatTableModule, MatPaginatorModule,
    MatSortModule, MatFormFieldModule, MatInputModule,
    MatIconModule, MatButtonModule, MatProgressSpinnerModule,
  ],
  templateUrl: './product-table.component.html',
  styleUrl: './product-table.component.scss'
})
export class ProductTableComponent {


  displayedColumns: string[] = ['id', 'name', 'price', 'category', 'actions'];
  dataSource = new MatTableDataSource<Product>([]);
  loading = true;
  errorMessage = '';

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private productService: ProductService, private router: Router) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadProducts() {
    this.loading = true;
    this.errorMessage = '';
    this.productService.getProducts().subscribe({
      next: (products) => {
        products.sort(
          (a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
        );
        this.dataSource.data = products;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error cargando productos:', err);
        this.errorMessage = 'No se pudieron cargar los productos.';
        this.loading = false;
      },
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  onView(productId: Product['id']) {
    this.router.navigate(['app','products','detail', productId]);
  }

  onEdit(productId: Product['id']) {
    this.router.navigate(['app','products','edit', productId]);
  }

  onDelete(product: Product) {
    if (confirm(`¿Seguro que deseas eliminar el producto "${product.name}"?`)) {
      this.productService.deleteProduct(product.id).subscribe({
        next: () => this.loadProducts(),
        error: (err) => console.error('Error eliminando producto:', err),
      });
    }
  }
}
