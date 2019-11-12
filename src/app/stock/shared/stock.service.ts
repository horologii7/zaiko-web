import { Injectable } from "@angular/core";
import { TokenService } from "app/shared/token.service";
import { HttpClient } from "@angular/common/http";
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Stock } from "./stock.model";
import { Product } from "app/products/shared/product.model";
import { ToastrService } from 'ngx-toastr';

@Injectable()

export class StockService{
  public stocksUrl = "stocks"
  public product: Product;
  public errorMessage: any = "Ocorreu um erro no servidor, tente mais tarde.";

  public constructor (private tokenHttp: TokenService, private httpClient: HttpClient, private toastr: ToastrService) { }

  public get(id: number): Observable<Stock>{
    let url = this.tokenHttp.apiBase + this.stocksUrl + '/' + id;

    return this.httpClient.get(url).pipe(
      catchError(this.handleErrors),
      map((response: Response) => this.responseToStock(response))
    )
  }

  public getAll(): Observable<Stock[]>{
    let url = this.tokenHttp.apiBase + this.stocksUrl

    return this.httpClient.get(url).pipe(
      catchError(this.handleErrors),
      map((response: Response) => this.responseToStocks(response))
    )
  }

  public searchByTitle(term: string): Observable<Stock[]> {
    let url = this.tokenHttp.apiBase + this.stocksUrl + '?q[product_name_cont]='+term;

    return this.httpClient.get(url).pipe(
      catchError(this.handleErrors),
      map((response: Response) => this.responseToStocks(response))
    )
  }

  private handleErrors(error: Response){
    console.log("SALVANDO O ERRO NUM ARQUIVO DE LOG - DETALHES DO ERRO => ", error);
    return throwError(error);
  }

  private responseToStock(response: Response): Stock {
    let stock_json = response['data'];
    let stock_attributes_json = stock_json['attributes']
    let stock_attributes_product_json = stock_json['attributes']['product']

    let stock = new Stock (
      stock_json['id'],
      stock_attributes_json['quantity'],
      stock_attributes_json["cost"],
      stock_attributes_json["status"],
      stock_attributes_json["created-at"],
      stock_attributes_json["updated-at"]
    )

    stock.product = new Product (
      stock_attributes_product_json['name'],
      stock_attributes_product_json['id'],
      stock_attributes_product_json['description'],
      stock_attributes_product_json['sale_price'],
      stock_attributes_product_json['created_at'],
      stock_attributes_product_json['updated_at'],
      stock
    )

    return stock
  }

  private responseToStocks(response: Response): Stock[]{
    let collection = response['data'] as Array<any>;
    let stocks: Stock[] = [];

    collection.forEach(item => {
      let stock = new Stock (
        item.id,
        item.attributes.quantity,
        item.attributes.cost,
        item.attributes.status,
        item.attributes['created-at'],
        item.attributes['updated-at']
      )
      
      stock.product = new Product(
        item.attributes.product.name, 
        item.attributes.product.id,
        item.attributes.product.description,
        item.attributes.product.sale_price,
        item.attributes.product.created_at,
        item.attributes.product.updated_at,
        stock
      )

      stocks.push(stock)
    })
    
    return stocks;
  }


}