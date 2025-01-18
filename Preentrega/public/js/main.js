const socket = io();

const productContainer = document.getElementById('product-list');

// Inicializa la lista de productos al conectarse al servidor
socket.on('init', (products) => {
    products.forEach(product => {
        const li = createProduct(product);
        productContainer.appendChild(li);
    });
});


// Actualiza la lista completa de productos al recibir un evento
socket.on('updateProducts', (products) => {
    
    productContainer.innerHTML = '';

    // Vuelve a generar la lista con los productos actualizados
    products.forEach(product => {
        const li = createProduct(product);
        productContainer.appendChild(li);
    });
});


// Crea un elemento <li> para un producto individual
function createProduct(product) {
    const li = document.createElement('li');
    li.innerHTML = `${product.title} - $${product.price}`;
    return li;
}
