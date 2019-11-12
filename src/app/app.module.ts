// angular imports
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule, LOCALE_ID } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

// angular plugins imports
import { AngularTokenModule } from 'angular-token';
import { ToastrModule, ToastrService } from 'ngx-toastr';

// angular services
import { ProductService } from './products/shared/product.service';
import { StockService } from './stock/shared/stock.service';
import { TokenService } from './shared/token.service'
import { AppRoutingModule } from './app.routing';
import { ComponentsModule } from './components/components.module';

import { AppComponent } from './app.component';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import localePt from '@angular/common/locales/pt';
import { registerLocaleData } from '@angular/common';
registerLocaleData(localePt, 'pt-BR');

@NgModule({
  imports: [
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    HttpClientModule,
    ComponentsModule,
    RouterModule,
    AppRoutingModule,
    AngularTokenModule.forRoot({
      apiBase: 'http://localhost:3000/'
    }),
    ToastrModule.forRoot({
      timeOut: 2000,
      positionClass: 'toast-top-right',
      preventDuplicates: true
    })
  ],
  declarations: [
    AppComponent,
    AdminLayoutComponent
  ],
  providers: [
    AngularTokenModule,
    ProductService,
    TokenService,
    ToastrService,
    StockService,
    { provide: LOCALE_ID, useValue: 'pt-BR' }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
