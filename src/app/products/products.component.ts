import { Component, OnInit } from '@angular/core';

import { Product } from './shared/product.model';
import { ProductService } from './shared/product.service';
import { ToastrService } from 'ngx-toastr';
import { Subject, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})

export class ProductsComponent implements OnInit {
  public p: number = 1;
  public searchTerms: Subject<string> = new Subject();
  public products: Array<Product>;
  public newProduct: Product;
  public product: Product;
  public editProduct: Product;
  public formError: Array<string>;
  public errorMessage: any = "Ocorreu um erro no servidor, tente mais tarde.";

  public constructor(private productService: ProductService, private toastr: ToastrService) { 
    this.newProduct = new Product('');
    this.editProduct = new Product('');
    this.product = new Product('');
  }

  public ngOnInit() {
    this.productService.getAll()
      .subscribe(
        products => this.products = products.sort((a, b) => a.name.localeCompare(b.name)),
        error => { this.toastr.error(this.errorMessage, 'Sistema'); }
      )

    this.searchTerms.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(
        term => term ? this.productService.searchByTitle(term) : of<Product[]>([])
      )
    ).subscribe(products => this.products = products)
  }

  public createProduct() {
    this.newProduct.name = this.newProduct.name.trim();
    
    this.productService.create(this.newProduct)
      .subscribe(
        (product) => {
          this.products.unshift(product);
          this.products.sort((a, b) => a.name.localeCompare(b.name))
          this.newProduct = new Product('');
          this.formError = null;
          this.toastr.success("adicionado com sucesso", 'Produto "'+product.name+'" (#'+product.id+')');
        },
        (error) => {
          if (error.status === 422){
            this.formError = error.error.errors.name;
            this.toastr.warning("Nome "+error.error.errors.name, 'Criação de Produto "'+this.newProduct.name+'" falhou');
          } else {
            this.toastr.error(this.errorMessage, 'Sistema');
          }
        }
      )
  }

  public updateProduct(product: Product) {
    this.productService.update(product)
      .subscribe(
        (product) => {
          this.products.sort((a, b) => a.name.localeCompare(b.name))
          this.toastr.success("atualizado com sucesso", 'Produto #'+product.id);
          this.editProduct = new Product('');
          this.product = new Product('');
        },
        (error) => {
          if (error.status === 422){            
            this.toastr.warning("Nome "+error.error.errors.name, "Edição de Produto #"+product.id+" falhou");
          } else {
            this.toastr.error(this.errorMessage, 'Sistema');
          }
        }
      )
  }

  public deleteProduct(product: Product) {
    if (confirm('Deseja realmente excluir o produto #'+product.id+'?')) {
      this.productService.delete(product.id)
        .subscribe(
          () => {
            this.products = this.products.filter(t => t !== product);
            this.toastr.success("Excluído com sucesso", 'Produto #'+product.id);
          }
        )
    }
  }

  public buttonEditProduct(product: Product) {
    this.editProduct = product;
    this.product.name = product.name+"";
    this.product.description = product.description+"";
    this.product.sale_price = product.sale_price;
  }

  public cancelEditProduct(product: Product) {
    this.editProduct = new Product('');
    product.name = this.product.name;
    if (this.product.description != 'null') {
      product.description = this.product.description;
    } else {
      product.description = '';
    }
    product.sale_price = this.product.sale_price;
    this.product = new Product('');
  }

  public searchProduct (term: string) {
    term = term.trim();
    if (term==""){
      this.productService.getAll()
      .subscribe(
        products => this.products = products.sort((a, b) => a.name.localeCompare(b.name)),
        error => { this.toastr.error(this.errorMessage, 'Sistema'); }
      )
    } else { 
      this.searchTerms.next(term);
    }
  }
}
