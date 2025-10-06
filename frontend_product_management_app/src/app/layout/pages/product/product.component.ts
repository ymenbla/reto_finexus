import { Component } from '@angular/core';
import { ProductTableComponent } from "./components/product-table/product-table.component";
import { RouterOutlet } from '@angular/router';


@Component({
  selector: 'app-product',
  imports: [RouterOutlet],
  templateUrl: './product.component.html',
  styleUrl: './product.component.scss'
})
export class ProductComponent {

}
