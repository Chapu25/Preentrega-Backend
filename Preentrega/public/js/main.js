const socket = io();

const productContainer = document.getElementById('product-list');

// Se Inicializa la lista de productos al conectarse al servidor
socket.on('init', (products) => {
    products.forEach(product => {
        const li = createProduct(product);
        productContainer.appendChild(li);
    });
});


// Se Actualiza la lista completa de productos al recibir un evento
socket.on('updateProducts', (products) => {

    productContainer.innerHTML = '';

    // Se Vuelve a generar la lista con los productos actualizados
    products.forEach(product => {
        const li = createProduct(product);
        productContainer.appendChild(li);
    });
});


// SeCrea un nuevo producto en la lista
function createProduct(product) {
    const li = document.createElement('li');
    li.innerHTML = `${product.title} - $${product.price}`;
    return li;
}
