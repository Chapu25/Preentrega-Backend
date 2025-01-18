import express from "express";
import { productRouter } from "./routes/products.routes.js";
import { productsService } from "./managers/products.managers.js";

import { cartRouter } from "./routes/cart.routes.js";


import handlebars from 'express-handlebars';
import { viewsRouter } from "./routes/views.routes.js";
import { Server } from "socket.io";
import path from "path";
import { __dirname } from "./dirmane.js";


const app = express();


app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static(path.resolve(__dirname, '../public')));



// handlebars config
app.engine('hbs', handlebars.engine({
    extname: '.hbs',
    defaultLayout: 'main',
}));
app.set('view engine', 'hbs');
app.set('views', path.resolve(__dirname, './views'));


//web socket
const server = app.listen(5000, () => console.log("Server listening on port 5000"));
export const io = new Server(server);


io.on('connection', (socket) => {
    console.log('A user connected');

    // Emite los productos al conectarse un nuevo cliente
    socket.emit('init', productsService.products);

    // Evento para debug o pruebas (opcional)
    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
});

// Función para emitir productos actualizados a todos los clientes
export const emitUpdatedProducts = () => {
    io.emit('updateProducts', productsService.products);
};


// Rutas
app.use("/api/products", productRouter);
app.use("/api/cart", cartRouter);
app.use("/", viewsRouter);


