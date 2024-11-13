let productosComprados = JSON.parse(localStorage.getItem('productos')) || [];

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
}


function aumentarCantidad(productoId) {
    const producto = productosComprados.find(p => p.id === productoId);
    if (producto) {
        producto.cantidad += 1;
        actualizarCarrito();
        guardarEnLocalStorage();
        actualizarContadorCarrito();
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
        actualizarContadorCarrito();
    }
}

function eliminarTodos(productoId) {

    productosComprados = productosComprados.filter(p => p.id !== productoId);


    actualizarCarrito();
    guardarEnLocalStorage();
    actualizarContadorCarrito();
}

function actualizarContadorCarrito() {
    const contadorCarrito = document.getElementById('contador-carrito');
    const totalProductos = productosComprados.reduce((acc, producto) => acc + producto.cantidad, 0);
    contadorCarrito.textContent = totalProductos;
    contadorCarrito.classList.toggle('d-none', totalProductos === 0);
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


document.getElementById('finalizarCompra').addEventListener('click', () => {
    const modalCarrito = new bootstrap.Modal(document.getElementById('modalCarrito'));
    modalCarrito.hide();

    const modalDatosCliente = new bootstrap.Modal(document.getElementById('modalDatosCliente'));
    modalDatosCliente.show();
});


document.getElementById('formDatosCliente').addEventListener('submit', function (event) {
    event.preventDefault();

    const nombre = document.getElementById('nombre').value;
    const direccion = document.getElementById('direccion').value;
    const telefono = document.getElementById('telefono').value;

    if (productosComprados.length === 0) {
        Toastify({
            text: "Carrito Vacio",
            duration: 3000,
            destination: "#",
            newWindow: false,
            close: true,
            gravity: "top", // `top` or `bottom`
            position: "left", // `left`, `center` or `right`
            stopOnFocus: true, // Prevents dismissing of toast on hover
            style: {
                background: "linear-gradient(to right, #ff4b4b, #ff2e2e)",
            },
            onClick: function () { } // Callback after click
        }).showToast();
        return;
    }

    const total = calcularTotal();

    Swal.fire({
        title: '¡Gracias por tu compra!',
        text: `Gracias por tu compra ${nombre}! Total: $${total.total} (Descuento: $${total.descuento})`,
        icon: 'success',
        confirmButtonText: 'Aceptar'
    });

    productosComprados = [];
    guardarEnLocalStorage();
    actualizarCarrito();

    const modalDatosCliente = bootstrap.Modal.getInstance(document.getElementById('modalDatosCliente'));
    if (modalDatosCliente) {
        modalDatosCliente.hide();
    }
});





function guardarEnLocalStorage() {
    localStorage.setItem('productos', JSON.stringify(productosComprados));
}



actualizarCarrito();
actualizarContadorCarrito();