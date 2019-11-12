import { Product } from "app/products/shared/product.model";

export class Stock{
  constructor(
    public id?: number,
    public quantity?: number,
    public cost?: number,
    public status?: number,
    public created_at?: Date,
    public updated_at?: Date,
    public product?: Product
  ){}
}