// Array de productos disponibles
const productosDisponibles = [
    {
        id: 1,
        img: "img/img1.png",
        nombre: "Reloj Andino",
        descripcion: "Fabricado en Suiza",
        precio: 100
    },
    {
        id: 2,
        img: "img/img2.png", 
        nombre: "Reloj Polinesia",
        descripcion: "Fabricado en China",
        precio: 150
    },
    {
        id: 3,
        img: "img/img3.png", 
        nombre: "Reloj Catamarca",
        descripcion: "Fabricado en Suiza",
        precio: 200
    },
    {
        id: 4,
        img: "img/img4.png", 
        nombre: "Reloj Comodoro",
        descripcion: "Fabricado en Suiza",
        precio: 250
    }
];


// Array para almacenar los productos comprados
let productosComprados = JSON.parse(localStorage.getItem('productos')) || [];

// Funcion para mostrar productos en forma de tarjetas
function mostrarProductos() {
    const productosContainer = document.getElementById('productos-disponibles');
    productosContainer.innerHTML = '';

    productosDisponibles.forEach(producto => {
        const col = document.createElement('div');
        col.classList.add('col-md-3', 'mb-4');

        col.innerHTML = `
            <div class="card h-100">
                <div class="card-body">
                    <img src="${producto.img}" class="card-img-top" alt="${producto.nombre}">
                    <h2 class="card-title">${producto.nombre}</h2>
                    <p class="card-text">${producto.descripcion}</p>
                    <p class="card-text fw-bold">$${producto.precio}</p>
                    <button class="btn btn-primary" onclick="agregarAlCarrito(${producto.id})">Agregar al carrito</button>
                </div>
            </div>
        `;

        productosContainer.appendChild(col);
    });
}

// Funcion para agregar un producto al carrito
function agregarAlCarrito(productoId) {
    const producto = productosDisponibles.find(p => p.id === productoId);

    if (producto) {
        // Verificar si el producto ya esta en el carrito
        const productoEnCarrito = productosComprados.find(p => p.id === productoId);

        if (productoEnCarrito) {
            // Si ya está, incrementa la cantidad
            productoEnCarrito.cantidad += 1;
        } else {
            // Si no está, lo agrega con cantidad 1
            productosComprados.push({ ...producto, cantidad: 1 });
        }

        // Actualizar el carrito y guardar en localStorage
        actualizarCarrito();
        guardarEnLocalStorage();

        // Mostrar mensaje de éxito
        mostrarMensaje('success', `${producto.nombre} agregado al carrito.`);
    }
}

// Función para actualizar la visualización del carrito
function actualizarCarrito() {
    const listaProductos = document.getElementById('lista-productos');
    listaProductos.innerHTML = '';

    productosComprados.forEach(producto => {
        const li = document.createElement('li');
        li.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');

        // Agregar los botones "+" y "-" para aumentar/disminuir cantidad
        li.innerHTML = `
            ${producto.nombre} - Cantidad: ${producto.cantidad}, Precio Unitario: $${producto.precio}
            <div>
                <button class="btn btn-sm btn-danger" onclick="disminuirCantidad(${producto.id})">-</button>
                <button class="btn btn-sm btn-success ms-2" onclick="aumentarCantidad(${producto.id})">+</button>
            </div>
        `;

        listaProductos.appendChild(li);
    });

    // Actualizar el total
    let total = calcularTotal();
    document.getElementById('total-compra').textContent = `Total a pagar: $${total.total} (Descuento aplicado: $${total.descuento})`;
}

function aumentarCantidad(productoId) {
    const producto = productosComprados.find(p => p.id === productoId);
    if (producto) {
        producto.cantidad += 1;
    }

    // Actualizar el carrito y localStorage
    actualizarCarrito();
    guardarEnLocalStorage();
}

function disminuirCantidad(productoId) {
    const producto = productosComprados.find(p => p.id === productoId);
    if (producto) {
        if (producto.cantidad > 1) {
            producto.cantidad -= 1;
        } else {
            // Si la cantidad es 1 y se presiona "-", eliminar el producto del carrito
            productosComprados = productosComprados.filter(p => p.id !== productoId);
        }
    }

    // Actualizar el carrito y localStorage
    actualizarCarrito();
    guardarEnLocalStorage();
}


// Función para calcular el total de la compra
function calcularTotal() {
    let total = 0;
    let descuento = 0;

    productosComprados.forEach(producto => {
        total += producto.cantidad * producto.precio;
    });

    // Aplicar descuento si la cantidad total de productos es mayor a 5
    let cantidadTotal = productosComprados.reduce((sum, producto) => sum + producto.cantidad, 0);
    if (cantidadTotal > 5) {
        descuento = total * 0.10; // 10% de descuento
        total -= descuento;
    }

    return { total, descuento };
}

// Guardar productos en el localStorage
function guardarEnLocalStorage() {
    localStorage.setItem('productos', JSON.stringify(productosComprados));
}

// Función para mostrar un mensaje en la página
function mostrarMensaje(tipo, mensaje) {
    const divMensaje = document.getElementById('mensaje');
    divMensaje.innerHTML = `<div class="alert alert-${tipo}">${mensaje}</div>`;
    setTimeout(() => {
        divMensaje.innerHTML = ''; // Limpiar el mensaje después de unos segundos
    }, 3000);
}

// Evento para finalizar la compra
document.getElementById('finalizarCompra').addEventListener('click', function () {
    if (productosComprados.length === 0) {
        mostrarMensaje('danger', 'El carrito está vacío.');
        return;
    }

    let total = calcularTotal();

    // Mostrar el resumen en el modal
    document.getElementById('resumenCompra').textContent = `Total a pagar: $${total.total} (Descuento aplicado: $${total.descuento})`;

    // Mostrar el modal
    let modal = new bootstrap.Modal(document.getElementById('modalCompra'));
    modal.show();

    // Limpiar el carrito y localStorage después de finalizar la compra
    productosComprados = [];
    guardarEnLocalStorage();
    actualizarCarrito();
});

// Inicializar el carrito y mostrar los productos al cargar la página
mostrarProductos();
actualizarCarrito();
