import { Router } from 'express';
import { cartsService } from '../managers/cart.managers.js';

export const cartRouter = Router();



cartRouter.post('/', async (req, res) => {
    try {
        const newCart = await cartsService.create();
        res.status(201).json(newCart);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al crear el carrito' });
    }
});


cartRouter.get('/:cid', async (req, res) => {
    const { cid } = req.params;
    const cart = await cartsService.getById(Number(cid));

    if (!cart) {
        return res.status(404).json({ message: 'Carrito no encontrado' });
    }
    res.status(200).json(cart.products);
});


cartRouter.post('/:cid/product/:pid', async (req, res) => {
    const { cid, pid } = req.params;

    try {
        const updatedCart = await cartsService.addProductToCart(Number(cid), Number(pid));
        if (!updatedCart) {
            return res.status(404).json({ error: 'Carrito no encontrado' });
        }
        res.status(200).json(updatedCart);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al agregar producto al carrito' });
    }
});
