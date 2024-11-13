let productosDisponibles = [];
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
            <div class="card h-100 bordes">
                <img src="${producto.img}" class="card-img-top" alt="${producto.nombre}">
                <div class="card-body">
                    <h2 class="card-title">${producto.nombre}</h2>
                    <p class="card-text">${producto.descripcion}</p>
                    <p class="card-text fw-bold">$${producto.precio}</p>
                    <button class="btn btn-primary boton" onclick="agregarAlCarrito(${producto.id})">Agregar al carrito</button>
                </div>
            </div>
        `;
        productosContainer.appendChild(col);
    });
}

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
        Toastify({
            text: "Agregado al carrito",
            duration: 1500,
            destination: "#",
            newWindow: false,
            close: true,
            gravity: "top", // `top` or `bottom`
            position: "left", // `left`, `center` or `right`
            stopOnFocus: true, // Prevents dismissing of toast on hover
            style: {
                background: "linear-gradient(to right, #f5d547, #e6b800)",
            },
            onClick: function () { } // Callback after click
        }).showToast();
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




    actualizarCarrito();
    actualizarContadorCarrito();