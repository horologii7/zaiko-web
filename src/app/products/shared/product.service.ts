import { Response } from "@angular/http";
import { Injectable } from "@angular/core";

import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { Product } from './product.model';
import { TokenService } from "../../shared/token.service";
import { HttpClient } from "@angular/common/http"

@Injectable()

export class ProductService{
  public productsUrl = "products"

  public constructor (private tokenHttp: TokenService, private httpClient: HttpClient) { }

  public getAll(): Observable<Product[]>{
    let url = this.tokenHttp.apiBase + this.productsUrl
    return this.httpClient.get(url).pipe(
      catchError(this.handleErrors),
      map((response: Response) => this.responseToProducts(response))
    )
  }

  public create(product: Product): Observable<Product> {
    let url = this.tokenHttp.apiBase + this.productsUrl

    return this.httpClient.post(url, product).pipe(
      catchError(this.handleErrors),
      map((response: Response) => this.responseToProduct(response))
    )
  }

  public update(product: Product): Observable<Product> {
    let url = this.tokenHttp.apiBase + this.productsUrl + '/' + product.id;

    return this.httpClient.put(url, product).pipe(
      catchError(this.handleErrors),
      map((response: Response) => this.responseToProduct(response))
    )
  }

  public delete(id: number): Observable<null> {
    let url = this.tokenHttp.apiBase + this.productsUrl + '/' + id;

    return this.httpClient.delete(url).pipe(
      catchError(this.handleErrors),
      map(() => null)
    )
  }

  public searchByTitle(term: string): Observable<Product[]> {
    let url = this.tokenHttp.apiBase + this.productsUrl + '?q[name_cont]='+term;

    return this.httpClient.get(url).pipe(
      catchError(this.handleErrors),
      map((response: Response) => this.responseToProducts(response))
    )
  }

  private handleErrors(error: Response){
    console.log("SALVANDO O ERRO NUM ARQUIVO DE LOG - DETALHES DO ERRO => ", error);
    return throwError(error);
  }

  private responseToProduct(response: Response): Product {
    let product_json = response['data'];

    return new Product(
      product_json['attributes']['name'],
      product_json['id'],
      product_json['attributes']['description'],
      product_json['attributes']["sale-price"]
    )
  }

  private responseToProducts(response: Response): Product[]{
    let collection = response['data'] as Array<any>;
    let products: Product[] = [];
    
    collection.forEach(item => {
      let product = new Product (
        item.attributes.name,
        item.id,
        item.attributes.description,
        item.attributes["sale-price"]
      )

      products.push(product)
    })
    
    return products;
  }
}