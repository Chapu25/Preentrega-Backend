import fs from 'node:fs';

class CartsService {
    path;
    carts = [];

    constructor({ path, initialCarts = [] }) {
        this.path = path;

        
        if (fs.existsSync(this.path)) {
            try {
                this.carts = JSON.parse(fs.readFileSync(this.path, 'utf-8'));
            } catch (error) {
                console.error('Error leyendo el archivo. Inicializando carritos con array vacío.');
                this.carts = initialCarts;
            }
        } else {
            
            this.carts = initialCarts;
        }
    }

    async getAll() {
        return this.carts;
    }

    async getById(id) {
        return this.carts.find((cart) => cart.id === parseInt(id));
    }

    async create() {
        const id = this.carts.length > 0 ? this.carts[this.carts.length - 1].id + 1 : 1;
        const newCart = {
            id,
            products: [],
        };
        this.carts.push(newCart);
        await this.saveOnFile();
        return newCart;
    }

    async addProductToCart(cid, pid) {
        const cart = await this.getById(cid);
        if (!cart) return null;


        const existingProduct = cart.products.find((prod) => prod.product === pid);
        if (existingProduct) {
            existingProduct.quantity += 1; 
        } else {
            
            cart.products.push({ product: pid, quantity: 1 });
        }

        await this.saveOnFile();
        return cart;
    }

    async saveOnFile() {
        try {
            await fs.writeFileSync(this.path, JSON.stringify(this.carts, null, 2));
        } catch (error) {
            console.error('Error al guardar en el archivo:', error);
        }
    }
}


const initialCarts = [];

export const cartsService = new CartsService({
    path: './src/db/cart.json',
    initialCarts,
});