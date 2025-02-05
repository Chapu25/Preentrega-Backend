import { Router } from 'express';
import { cartsService } from '../managers/cart.managers.js';

export const cartRouter = Router();


// Crea un carrito vacío
cartRouter.post('/', async (req, res) => {
    try {
        const newCart = await cartsService.create();
        res.status(201).json(newCart);
    } catch (error) {
        res.status(500).json({ error: 'Error al crear el carrito' });
    }
});

// /api/carts - Obtener todos los carritos

cartRouter.get('/', async (req, res) => {
    try {
        const carts = await cartsService.getAll();
        res.status(200).json(carts);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener los carritos' });
    }
});

// Obtiene carrito por ID con productos poblados
cartRouter.get('/:cid', async (req, res) => {
    const { cid } = req.params;

    try {
        const cart = await cartsService.getById(cid); 
        if (!cart) {
            return res.status(404).json({ message: 'Carrito no encontrado' });
        }
        res.status(200).json(cart);
    } catch (error) {
        console.error("Error al obtener el carrito:", error);
        res.status(500).json({ error: 'Error al obtener el carrito' });
    }
});

// Agregar producto al carrito
cartRouter.post('/:cid/product/:pid', async (req, res) => {
    const { quantity } = req.body; 
    try {
        const updatedCart = await cartsService.addProductToCart(req.params.cid, req.params.pid, quantity);
        if (!updatedCart) return res.status(404).json({ error: 'Carrito no encontrado' });

        res.status(200).json(updatedCart);
    } catch (error) {
        res.status(500).json({ error: 'Error al agregar producto al carrito' });
    }
});

// Actualiza la cantidad de producto en el carrito
cartRouter.put('/:cid/product/:pid', async (req, res) => {
    const { quantity } = req.body;

    try {
        const updatedCart = await cartsService.updateProductQuantity(req.params.cid, req.params.pid, quantity);
        if (!updatedCart) return res.status(404).json({ error: 'Carrito no encontrado' });

        res.status(200).json(updatedCart);
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar cantidad' });
    }
});

//  Elimina un producto del carrito
cartRouter.delete('/:cid/product/:pid', async (req, res) => {
    try {
        const updatedCart = await cartsService.removeProductFromCart(req.params.cid, req.params.pid);
        if (!updatedCart) return res.status(404).json({ error: 'Carrito no encontrado' });

        res.status(200).json(updatedCart);
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar producto del carrito' });
    }
});

// Vacia un carrito
cartRouter.delete('/:cid', async (req, res) => {
    try {
        const deletedCart = await cartsService.deleteById(req.params.cid);
        if (!deletedCart) return res.status(404).json({ error: 'Carrito no encontrado' });

        res.status(200).json({ message: 'Carrito eliminado correctamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar el carrito' });
    }
});