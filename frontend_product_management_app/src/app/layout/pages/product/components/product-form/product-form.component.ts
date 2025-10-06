import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService, Product, ProductCreate } from '../../product.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { switchMap } from 'rxjs/operators';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { NgIf } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-product-form',
  imports: [
    MatCardModule, MatFormFieldModule,MatInputModule,
    ReactiveFormsModule, MatButtonModule,NgIf
  ],
  templateUrl: './product-form.component.html',
  styleUrl: './product-form.component.scss'
})
export class ProductFormComponent {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private productService = inject(ProductService);
  private snackBar = inject(MatSnackBar);

  form!: FormGroup;
  isEditMode = false;
  productId!: number;

  ngOnInit(): void {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: [''],
      price: [null, [Validators.required, Validators.min(1)]],
      stock: [0, [Validators.required, Validators.min(0)]],
      category: [''],
    });


    this.route.paramMap
      .pipe(
        switchMap((params) => {
          const id = params.get('id');
          if (id) {
            this.isEditMode = true;
            this.productId = +id;
            return this.productService.getProductById(this.productId);
          }
          return [];
        })
      )
      .subscribe({
        next: (product: any) => {
          if (product) this.form.patchValue(product);
        },
        error: (err) => console.error('Error al cargar producto', err),
      });
  }

  onSubmit(): void {
    if (this.form.invalid) return;

    const productData: ProductCreate = this.form.value;

    if (this.isEditMode) {
      // Actualizar
      this.productService.updateProduct(this.productId, productData).subscribe({
        next: () => {
          this.snackBar.open('Producto actualizado correctamente', 'Cerrar', {
            duration: 3000,
          });
          this.router.navigate(['app','products']);
        },
        error: () => {
          this.snackBar.open('Error al actualizar producto', 'Cerrar', { duration: 3000 });
        },
      });
    } else {
      // Crear nuevo
      this.productService.createProduct(productData).subscribe({
        next: () => {
          this.snackBar.open('Producto creado correctamente', 'Cerrar', {
            duration: 3000,
          });
          this.router.navigate(['app','products']);
        },
        error: () => {
          this.snackBar.open('Error al crear producto', 'Cerrar', { duration: 3000 });
        },
      });
    }
  }

  onCancel(): void {
    this.router.navigate(['/app/products']);
  }
}
