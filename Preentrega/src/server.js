import express from "express";
import { productRouter } from "./routes/products.routes.js";
import { productsService } from "./managers/products.managers.js";


import { cartRouter } from "./routes/cart.routes.js";


import handlebars from 'express-handlebars';
import { viewsRouter } from "./routes/views.routes.js";
import { Server } from "socket.io";
import path from "path";
import { __dirname } from "./dirmane.js";
import mongoose from "mongoose";


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

    
    socket.emit('init', productsService.products);

    
    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
});

// Esta Función para emitir productos actualizados a todos los clientes
export const emitUpdatedProducts = () => {
    io.emit('updateProducts', productsService.products);
};


// Rutas
app.use("/api/products", productRouter);
app.use("/api/carts", cartRouter);
app.use("/", viewsRouter);


// Conexión a la base de datos
/* mongoose.connect('mongodb://localhost:27017/ecommerce')
    .then(() => console.log('Conectado a la base de datos'))
    .catch((error) => console.log('Error al conectar a la base de datos', error)); */

// Conexión a la base de datos


const uri = "mongodb+srv://nico0925:<db_password>@cluster0.76g0e.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Conectado a la base de datos'))
    .catch((error) => console.log('Error al conectar a la base de datos', error));
    

