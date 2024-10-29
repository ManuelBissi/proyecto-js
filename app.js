let productosDisponibles = [];
let productosComprados = JSON.parse(localStorage.getItem('productos')) || [];
const productosContainer = document.getElementById('productos-disponibles');


fetch('base/data.JSON')
    .then(response => response.json())
    .then(data => {
        productosDisponibles = data;
        mostrarProductos(productosDisponibles);
    })
    .catch(error => {
        console.error('Error al cargar los productos:', error);
    });


function mostrarProductos(productosDisponibles) {
    productosContainer.innerHTML = '';

    productosDisponibles.forEach(producto => {
        const col = document.createElement('div');
        col.classList.add('col-md-3', 'mb-4');

        col.innerHTML = `
            <div class="card h-100">
                <img src="${producto.img}" class="card-img-top" alt="${producto.nombre}">
                <div class="card-body">
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

// Función para agregar un producto al carrito
function agregarAlCarrito(productoId) {
    const producto = productosDisponibles.find(p => p.id === productoId);

    if (producto) {
        const productoEnCarrito = productosComprados.find(p => p.id === productoId);

        if (productoEnCarrito) {
            productoEnCarrito.cantidad += 1;
        } else {
            productosComprados.push({ ...producto, cantidad: 1 });
        }

        actualizarCarrito();
        actualizarContadorCarrito();
        guardarEnLocalStorage();
        mostrarMensaje('success', `${producto.nombre} agregado al carrito.`);
    }
}

function actualizarContadorCarrito() {
    const contadorCarrito = document.getElementById('contador-carrito');
    const totalProductos = productosComprados.reduce((acc, producto) => acc + producto.cantidad, 0);

    contadorCarrito.textContent = totalProductos;
    
    if (totalProductos === 0) {
        contadorCarrito.classList.add('d-none');
    } else {
        contadorCarrito.classList.remove('d-none');
    }
}
document.addEventListener('DOMContentLoaded', () => {
    actualizarCarrito();
    actualizarContadorCarrito();
});

// Función para actualizar la visualización del carrito
function actualizarCarrito() {
    const listaProductos = document.getElementById('lista-productos');
    listaProductos.innerHTML = '';

    productosComprados.forEach(producto => {
        const li = document.createElement('li');
        li.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');

        li.innerHTML = `
            ${producto.nombre} - Cantidad: ${producto.cantidad}, Precio Unitario: $${producto.precio}
            <div>
                <button class="btn btn-sm btn-danger" onclick="disminuirCantidad(${producto.id})">-</button>
                <button class="btn btn-sm btn-success ms-2" onclick="aumentarCantidad(${producto.id})">+</button>
                <button class="btn btn-sm btn-warning ms-2" onclick="eliminarTodos(${producto.id})">Eliminar</button>
            </div>
        `;

        listaProductos.appendChild(li);
    });

    const total = calcularTotal();
    document.getElementById('total-compra').textContent = `Total a pagar: $${total.total} (Descuento: $${total.descuento})`;
}


function aumentarCantidad(productoId) {
    const producto = productosComprados.find(p => p.id === productoId);
    if (producto) {
        producto.cantidad += 1;
        actualizarCarrito();
        guardarEnLocalStorage();
    }
}

function disminuirCantidad(productoId) {
    const producto = productosComprados.find(p => p.id === productoId);
    if (producto) {
        if (producto.cantidad > 1) {
            producto.cantidad -= 1;
        } else {
            productosComprados = productosComprados.filter(p => p.id !== productoId);
        }
        actualizarCarrito();
        guardarEnLocalStorage();
    }
}

function eliminarTodos(productoId) {
    
    productosComprados = productosComprados.filter(p => p.id !== productoId);

    
    actualizarCarrito();
    guardarEnLocalStorage();
}


function calcularTotal() {
    let total = 0;
    let descuento = 0;

    productosComprados.forEach(producto => {
        total += producto.cantidad * producto.precio;
    });

    const cantidadTotal = productosComprados.reduce((sum, producto) => sum + producto.cantidad, 0);
    if (cantidadTotal > 5) {
        descuento = total * 0.10;
        total -= descuento;
    }

    return { total, descuento };
}

function guardarEnLocalStorage() {
    localStorage.setItem('productos', JSON.stringify(productosComprados));
}

function mostrarMensaje(tipo, mensaje) {
    const divMensaje = document.getElementById('mensaje');
    divMensaje.innerHTML = `<div class="alert alert-${tipo}">${mensaje}</div>`;
    setTimeout(() => {
        divMensaje.innerHTML = '';
    }, 3000);
}

document.getElementById('finalizarCompra').addEventListener('click', () => {
    if (productosComprados.length === 0) {
        mostrarMensaje('danger', 'El carrito está vacío.');
        return;
    }

    const total = calcularTotal();
    document.getElementById('resumenCompra').textContent = `Total: $${total.total} (Descuento: $${total.descuento})`;

    const modal = new bootstrap.Modal(document.getElementById('modalCompra'));
    modal.show();

    productosComprados = [];
    guardarEnLocalStorage();
    actualizarCarrito();
});


actualizarCarrito();
