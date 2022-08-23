import { IUser } from '../models/user.model';

export default class UserDto {
    name;
    email;
    passwordHash;
    street;
    apartment;
    city;
    zip;
    country;
    phone;
    isAdmin;

    constructor(model: IUser) {
        this.name = model.name;
        this.email = model.email;
        this.passwordHash = model.passwordHash;
        this.street = model.street;
        this.apartment = model.apartment;
        this.city = model.city;
        this.zip = model.zip;
        this.country = model.country;
        this.phone = model.phone;
        this.isAdmin = model.isAdmin;
    }
}
