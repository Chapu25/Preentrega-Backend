import { Router } from 'express';
import { productsService } from '../managers/products.managers.js';
import { productModel } from '../models/products.model.js';

export const viewsRouter = Router();

viewsRouter.get('/test', (req, res) => {
    res.render('test');
});


viewsRouter.get('/home', async (req, res) => {
    const { page = 1, limit = 10 } = req.query;

    try {
        // Obtener productos paginados de la base de datos
        const productosdb = await productModel.paginate({}, { page: Number(page), limit: Number(limit), lean: true });

        // Enviamos los datos correctamente a la vista
        res.render('home', {
            products: productosdb.docs, // Aquí se pasan los productos paginados
            totalPages: productosdb.totalPages,
            prevPage: productosdb.prevPage,
            nextPage: productosdb.nextPage,
            page: productosdb.page,
            hasPrevPage: productosdb.hasPrevPage,
            hasNextPage: productosdb.hasNextPage,
        });
    } catch (error) {
        res.status(500).send({ message: 'Error al intentar obtener los productos' });
    }
});



viewsRouter.get('/realtimeproducts', async (req, res) => {
    const products = await productsService.getAll();
    const {page = 1, limit = 10} = req.query;

    try{
        const productosdb = await productModel.paginate({}, {page: Number(page),  limit: Number(limit)});
        res.render('realTimeProducts', { products, productosdb });
    } catch (error){
        res.status(500).send({message: 'Error al intentar obtener los productos'});
    }
});