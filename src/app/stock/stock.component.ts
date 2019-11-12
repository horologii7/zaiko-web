import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { StockService } from './shared/stock.service';
import { Stock } from './shared/stock.model';
import { Product } from 'app/products/shared/product.model';
import { ProductService } from 'app/products/shared/product.service';
import { Subject, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-stock',
  templateUrl: './stock.component.html',
  styleUrls: ['./stock.component.css']
})

export class StockComponent implements OnInit {
  public stocks: Array<Stock>;
  public searchTerms: Subject<string> = new Subject();
  public errorMessage: any = "Ocorreu um erro no servidor, tente mais tarde.";
  public constructor(private stockService: StockService, private productService: ProductService, private toastr: ToastrService) {}

  public ngOnInit() {
    this.stockService.getAll()
      .subscribe(
        stocks => this.stocks = stocks.sort((a, b) => a.product.name.localeCompare(b.product.name)),
        error => this.toastr.error(this.errorMessage, 'Sistema')
      )

    this.searchTerms.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(
        term => term ? this.stockService.searchByTitle(term) : of<Stock[]>([])
      )
    ).subscribe(stocks => this.stocks = stocks)
  }

  public searchStock (term: string) {
    term = term.trim();
    if (term==""){
      this.stockService.getAll()
        .subscribe(
          stocks => this.stocks = stocks.sort((a, b) => a.product.name.localeCompare(b.product.name)),
          error => this.toastr.error(this.errorMessage, 'Sistema')
        )
    } else { 
      this.searchTerms.next(term);
    }
  }

  public inputProduct () {

  }
}
