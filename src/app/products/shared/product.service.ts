import { Response } from "@angular/http";
import { Injectable } from "@angular/core";

import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { Product } from './product.model';
import { TokenService } from "../../shared/token.service";
import { HttpClient } from "@angular/common/http"
import { Stock } from "app/stock/shared/stock.model";

@Injectable()

export class ProductService{
  public productsUrl = "products"

  public constructor (private tokenHttp: TokenService, private httpClient: HttpClient) { }

  public get(id: number): Observable<Product>{
    let url = this.tokenHttp.apiBase + this.productsUrl + '/' + id;

    return this.httpClient.get(url).pipe(
      catchError(this.handleErrors),
      map((response: Response) => this.responseToProduct(response))
    )
  }

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
    
    product.stock = null;
    
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
    let product_attributes_json = product_json['attributes']
    let product_attributes_stock_json = product_json['attributes']['stock']

    let product = new Product (
      product_attributes_json['name'],
      product_json['id'],
      product_attributes_json['description'],
      product_attributes_json["sale-price"],
      product_attributes_json['created-at'],
      product_attributes_json["updated-at"]
    )

    product.stock = new Stock(
      product_attributes_stock_json['id'], 
      product_attributes_stock_json['quantity'], 
      product_attributes_stock_json['cost'], 
      product_attributes_stock_json['status'], 
      product_attributes_stock_json['created_at'],
      product_attributes_stock_json['updated_at'],
      product
    )

    return product;
  }

  private responseToProducts(response: Response): Product[]{
    let collection = response['data'] as Array<any>;
    let products: Product[] = [];
    
    collection.forEach(item => {

      let product = new Product (
        item.attributes.name,
        item.id,
        item.attributes.description,
        item.attributes["sale-price"],
        item.attributes['created-at'],
        item.attributes['updated-at']
      )
      
      product.stock = new Stock(
        item.attributes.stock.id, 
        item.attributes.stock.quantity, 
        item.attributes.stock.cost, 
        item.attributes.stock.status, 
        item.attributes.stock.created_at,
        item.attributes.stock.updated_at,
        product
      )

      products.push(product)
    })
    
    return products;
  }
}