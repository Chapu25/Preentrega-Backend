
import fs from "node:fs";

class ProductsService {
    path;
    products = [];

    constructor({ path, initialProducts = [] }) {
        this.path = path;

        
        if (fs.existsSync(this.path)) {
            try {
                this.products = JSON.parse(fs.readFileSync(this.path, "utf-8"));
            } catch (error) {
                console.error("Error leyendo el archivo. Inicializando productos con array inicial.");
                this.products = initialProducts; 
            }
        } else {
            this.products = initialProducts;
        }
    }

    async getAll() {
        return this.products;
    }

    async getById(id) {
        const product = this.products.find((product) => product.id === parseInt(id));
        return product;
    }

    async create({ title, description, code, price, status, stock, category, thumbnail }) {
        const id = this.products.length > 0 ? this.products[this.products.length - 1].id + 1 : 1;

        const newProduct = {
            id,
            title,
            description,
            code,
            price,
            status,
            stock,
            category,
            thumbnail,
        };
        this.products.push(newProduct);
        try {
            await this.saveOnFile();
            return newProduct;
        } catch (error) {
            console.error("Error al guardar el nuevo producto:", error);
        }
    }

    async update({ id, title, description, code, price, status, stock, category, thumbnail }) {
        const product = this.products.find((product) => product.id === parseInt(id));

        if (!product) {
            return null;
        }

        product.title = title ?? product.title;
        product.description = description ?? product.description;
        product.code = code ?? product.code;
        product.price = price ?? product.price;
        product.status = status ?? product.status;
        product.stock = stock ?? product.stock;
        product.category = category ?? product.category;
        product.thumbnail = thumbnail ?? product.thumbnail;

        try {
            await this.saveOnFile();
            return product;
        } catch (error) {
            console.error("Error al actualizar el producto:", error);
        }
    }

    delete(id) {
        const productIndex = this.products.findIndex((product) => product.id === parseInt(id));

        if (productIndex === -1) {
            return null;
        }

        const deletedProduct = this.products.splice(productIndex, 1)[0];

        try {
            this.saveOnFile();
            return deletedProduct;
        } catch (error) {
            console.error("Error al eliminar el producto:", error);
        }
    }

    async saveOnFile() {
        try {
            await fs.writeFileSync(this.path, JSON.stringify(this.products, null, 2));
        } catch (error) {
            console.error("Error al guardar en el archivo:", error);
        }
    }
}


const initialProducts = [
    {
        id: 1,
        title: "Nike",
        description: "Zapatillas de Nike deportivas",
        code: "CODE1",
        price: 200,
        status: true,
        stock: 10,
        category: "Running",
        thumbnail: "Thumbnail 1",
    },
    {
        id: 2,
        title: "Adidas",
        description: "Zapatillas de Adidas deportivas",
        code: "CODE2",
        price: 300,
        status: true,
        stock: 5,
        category: "Deportivas",
        thumbnail: "Thumbnail 2",
    },
    {
        id: 3,
        title: "Puma",
        description: "Botines de Puma",
        code: "CODE3",
        price: 150,
        status: true,
        stock: 8,
        category: "Running",
        thumbnail: "Thumbnail 3",
    },
    {
        id: 4,
        title: "Reebok",
        description: "Zapatillas de Reebok deportivas",
        code: "CODE4",
        price: 250,
        status: true,
        stock: 12,
        category: "Deportivas",
        thumbnail: "Thumbnail 4",
    },
];

export const productsService = new ProductsService({
    path: "./src/db/products.json",
    initialProducts,
});