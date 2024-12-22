import express from "express";
import { productRouter } from "./routes/products.routes.js";
import { cartRouter } from "./routes/cart.routes.js";

const app = express();
const PORT = 5000;

app.use(express.json());
app.use(express.urlencoded({extended: true}));


// Rutas
app.use(productRouter)
app.use(cartRouter)


app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));