import fs from 'node:fs';
import { Cart } from '../models/carts.model.js';
import { productModel } from '../models/products.model.js';
import mongoose from 'mongoose';

class CartsService {
    

//=======================================================================================================



async getAll() {
    return await Cart.find();
}

async getById(id) {
    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            console.error("ID no válido:", id);
            return null;
        }

        const cart = await Cart.findById(id).populate('products.product'); 
        if (!cart) {
            console.error("Carrito no encontrado en la base de datos.");
            return null;
        }

        return cart;
    } catch (error) {
        console.error("Error al obtener el carrito:", error);
        return null;
    }
}

async create() {
    const newCart = new Cart({ products: [] });
    return await newCart.save();
}

async addProductToCart(cid, pid, quantity = 1) {
    const cart = await Cart.findById(cid);
    if (!cart) return null;

    const existingProduct = cart.products.find(p => p.product.toString() === pid);
    if (existingProduct) {
        existingProduct.quantity += quantity;
    } else {
        cart.products.push({ product: pid, quantity });
    }

    return await cart.save();
}

async removeProductFromCart(cid, pid) {
    const cart = await Cart.findById(cid);
    if (!cart) return null;

    cart.products = cart.products.filter(p => p.product.toString() !== pid);
    return await cart.save();
}

async deleteById(id) {
    return await Cart.findByIdAndDelete(id);
}

async updateProductQuantity(cid, pid, quantity) {
    const cart = await Cart.findById(cid);
    if (!cart) return null;

    const product = cart.products.find(p => p.product.toString() === pid);
    if (product) {
        product.quantity = quantity;
    }

    return await cart.save();
}

        
} 

    

const initialCarts = [];

export const cartsService = new CartsService({
    path: './src/db/cart.json',
    initialCarts,
});








