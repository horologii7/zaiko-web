import { Component, OnInit } from '@angular/core';

declare const $: any;
declare interface RouteInfo {
    path: string;
    title: string;
    icon: string;
    class: string;
}
export const ROUTES: RouteInfo[] = [
    { path: '/dashboard', title: 'Resumo',  icon: 'dashboard', class: '' },
    { path: '/user-profile', title: 'Vendas',  icon:'store', class: '' },
    { path: '/stock', title: 'Estoque',  icon:'all_inbox', class: '' },
    { path: '/products', title: 'Produtos',  icon:'shopping_basket', class: '' },
    { path: '/table-list', title: 'Tabelas',  icon:'shopping_basket', class: '' },
    { path: '/icons', title: 'Relatórios',  icon:'content_paste', class: '' },
    //{ path: '/notifications', title: 'Notifications',  icon:'notifications', class: '' },
    { path: '/upgrade', title: 'Configuração',  icon:'build', class: '' }
];

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  menuItems: any[];

  constructor() { }

  ngOnInit() {
    this.menuItems = ROUTES.filter(menuItem => menuItem);
  }
  isMobileMenu() {
      if ($(window).width() > 991) {
          return false;
      }
      return true;
  };
}
