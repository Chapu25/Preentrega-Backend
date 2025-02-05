import { Router } from "express";
import { productsService } from "../managers/products.managers.js";
import { io } from "../server.js";
import { productModel } from "../models/products.model.js";


export const productRouter = Router();


productRouter.get("/", async (req, res) => {

    
    try {
        const { limit = 10, page = 1, query } = req.query;

        // Crear filtro basado en query 
        let filter = {};
        if (query) {
            filter.category = query;
        }


        // Configuración de paginación
        const options = {
            page: Number(page),
            limit: Number(limit),
            lean: true, 
        };


        // Obtener productos paginados
        const productosdb = await productModel.paginate(filter, options);

        console.log("Productos paginados:", productosdb.docs.length);

        res.status(200).json({
            status: "success",
            payload: productosdb.docs, 
            totalPages: productosdb.totalPages,
            prevPage: productosdb.prevPage,
            nextPage: productosdb.nextPage,
            page: productosdb.page,
            hasPrevPage: productosdb.hasPrevPage,
            hasNextPage: productosdb.hasNextPage,
        });

    } catch (error) {
        console.error("Error al obtener productos:", error);
        res.status(500).json({ error: "Error al obtener productos" });
    }
});




productRouter.get("/api/products/:id", async (req, res) => {
    const { id } = req.params;
    const product = await productsService.getById(Number(id)); 
    if (!product) {
        return res.status(404).json({ message: "Producto no encontrado" });
    }
    res.status(200).json(product);
});

productRouter.post("/", async (req, res) => {
    const { title, description, code, price, status, stock, category, thumbnail } = req.body;

    try {
        const newProduct = await productsService.create({
            id: productsService.products.length + 1, 
            title,
            description,
            code,
            price,
            status,
            stock,
            category,
            thumbnail,
        });
        io.emit('updateProducts', productsService.products);
        res.status(201).json(newProduct);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al crear el producto" });
    }
});

productRouter.put("/:id", async (req, res) => {
    const { id } = req.params;
    const { title, description, code, price, status, stock, category, thumbnail } = req.body;

    try {
        const updatedProduct = await productsService.update({
            id: parseInt(id),
            title,
            description,
            code,
            price,
            status,
            stock,
            category,
            thumbnail,
        });
        if (!updatedProduct) {
            return res.status(404).json({ error: "Producto no encontrado" });
        }
        res.status(200).json(updatedProduct);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al actualizar el producto" });
    }
});

productRouter.delete("/:id", async (req, res) => {
    const { id } = req.params;

    try {
        const deletedProduct = await productsService.delete(parseInt(id)); 
        if (!deletedProduct) {
            return res.status(404).json({ error: "Producto no encontrado" });
        }
        res.status(200).json(deletedProduct);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al eliminar el producto" });
    }
});