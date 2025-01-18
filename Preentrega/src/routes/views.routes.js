import { Router } from 'express';
import { productsService } from '../managers/products.managers.js';

export const viewsRouter = Router();

viewsRouter.get('/test', (req, res) => {
    res.render('test');
});


viewsRouter.get('/home', async (req, res) => {
    const products = await productsService.getAll();
    res.render('home', { products });
});

viewsRouter.get('/realtimeproducts', async (req, res) => {
    const products = await productsService.getAll();
    res.render('realTimeProducts', { products });
});
