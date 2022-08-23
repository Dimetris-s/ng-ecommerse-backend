import { IProduct } from '../models/product.model';

export class ProductDto {
    name;
    description;
    richDescription;
    isFeatured;
    image;
    numReviews;
    rating;
    category;
    brand;
    countInStock;
    price;

    constructor(model: IProduct) {
        this.name = model.name;
        this.description = model.description;
        this.richDescription = model.richDescription;
        this.isFeatured = model.isFeatured;
        this.image = model.image;
        this.numReviews = model.numReviews;
        this.rating = model.rating;
        this.category = model.category;
        this.brand = model.brand;
        this.countInStock = model.countInStock;
        this.price = model.price;
    }
}
