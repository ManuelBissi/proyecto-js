// Función para capturar la entrada del usuario
function obtenerDatosCompra() {
    let cantidad = prompt("Ingrese la cantidad de productos:");
    let precioUnitario = prompt("Ingrese el precio unitario del producto expresado en numero sin signos:");
    return { cantidad: parseInt(cantidad), precioUnitario: parseFloat(precioUnitario) };
}

// Función para calcular el total de la compra
function calcularTotal(cantidad, precioUnitario) {
    let total = cantidad * precioUnitario;
    let descuento = 0;

    // Aplicar descuento si la cantidad de productos es mayor a 5
    if (cantidad > 5) {
        descuento = total * 0.10; // 10% de descuento
        total = total - descuento; // Total con descuento aplicado
    }

    return { total, descuento };
}

// Función para mostrar los resultados al usuario
function mostrarResultado(total, descuento) {
    if (descuento > 0) {
        alert("Has obtenido un descuento de $" + descuento + ". El total a pagar es $" + total);
    } else {
        alert("El total a pagar es $" + total + ". No se aplicó ningún descuento.");
    }
}

// Función principal que ejecuta el simulador de compras
function simuladorCompra() {
    let continuar = true;

    while (continuar) {
        let datos = obtenerDatosCompra();
        let resultado = calcularTotal(datos.cantidad, datos.precioUnitario);
        mostrarResultado(resultado.total, resultado.descuento);

        continuar = confirm("¿Desea realizar otra compra?");
    }

    alert("Gracias por usar el simulador.");
}

// Iniciar el simulador
simuladorCompra();
