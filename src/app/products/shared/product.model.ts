import { Stock } from "app/stock/shared/stock.model";

export class Product{
  constructor(
    public name: string,
    public id?: number,
    public description?: string,
    public sale_price?: number,
    public created_at?: Date,
    public updated_at?: Date,
    public stock?: Stock
  ){}
}