// Catálogo de productos y precios unitarios base para el cotizador
const productsData = [
    // Cajas para Tortas Base 20
    { name: "Caja Torta 20x20x15 cm", price: 850 },
    { name: "Caja Torta 20x20x20 cm", price: 920 },
    { name: "Caja Torta 20x20x25 cm", price: 990 },
    { name: "Caja Torta 20x20x30 cm", price: 1060 },
    { name: "Caja Torta 20x20x35 cm", price: 1130 },
    { name: "Caja Torta 20x20x40 cm", price: 1200 },
    // Cajas para Tortas Base 25
    { name: "Caja Torta 25x25x15 cm", price: 1050 },
    { name: "Caja Torta 25x25x20 cm", price: 1130 },
    { name: "Caja Torta 25x25x25 cm", price: 1210 },
    { name: "Caja Torta 25x25x30 cm", price: 1290 },
    { name: "Caja Torta 25x25x35 cm", price: 1370 },
    { name: "Caja Torta 25x25x40 cm", price: 1450 },
    // Cajas para Tortas Base 30
    { name: "Caja Torta 30x30x15 cm", price: 1300 },
    { name: "Caja Torta 30x30x20 cm", price: 1390 },
    { name: "Caja Torta 30x30x25 cm", price: 1480 },
    { name: "Caja Torta 30x30x30 cm", price: 1570 },
    { name: "Caja Torta 30x30x35 cm", price: 1660 },
    { name: "Caja Torta 30x30x40 cm", price: 1750 },
    // Cajas para Tortas Base 35
    { name: "Caja Torta 35x35x15 cm", price: 1600 },
    { name: "Caja Torta 35x35x20 cm", price: 1710 },
    { name: "Caja Torta 35x35x25 cm", price: 1820 },
    { name: "Caja Torta 35x35x30 cm", price: 1930 },
    { name: "Caja Torta 35x35x35 cm", price: 2040 },
    { name: "Caja Torta 35x35x40 cm", price: 2150 },
    // Sweets
    { name: "Caja Sweets Estándar", price: 500 },
    { name: "Caja Sweets Mediana", price: 650 },
    { name: "Caja Sweets Grande", price: 850 },
    // Bandeja Fiestera
    { name: "Bandeja Fiestera Mediana", price: 1400 },
    { name: "Bandeja Fiestera Grande", price: 1800 },
    // Con Borde
    { name: "Caja con Borde Cuadrada", price: 1200 },
    { name: "Caja con Borde Rectangular", price: 1500 }
];

document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById("quote-rows-container");
    const addRowBtn = document.getElementById("add-row-btn");
    const subtotalEl = document.getElementById("subtotal-amount");
    const totalEl = document.getElementById("total-amount");
    const sendWhatsappBtn = document.getElementById("send-whatsapp-quote");

    if (!container) return; // Si no estamos en la página de precios, salir

    // Función para crear una nueva fila en el cotizador
    function addRow(productIndex = 0, quantity = 10) {
        const row = document.createElement("div");
        row.className = "quote-row";

        let optionsHtml = "";
        productsData.forEach((p, idx) => {
            const selected = idx === productIndex ? "selected" : "";
            optionsHtml += `<option value="${idx}" ${selected}>${p.name} ($${p.price} c/u)</option>`;
        });

        row.innerHTML = `
            <select class="product-select">${optionsHtml}</select>
            <input type="number" class="quantity-input" value="${quantity}" min="1" />
            <div class="row-subtotal">$0 CLP</div>
            <button type="button" class="btn-action btn-danger remove-row">X</button>
        `;

        container.appendChild(row);
        updateTotals();

        // Escuchar cambios para recalcular
        row.querySelector(".product-select").addEventListener("change", updateTotals);
        row.querySelector(".quantity-input").addEventListener("input", updateTotals);
        row.querySelector(".remove-row").addEventListener("click", () => {
            row.remove();
            updateTotals();
        });
    }

    // Función para calcular subtotales y totales generales
    function updateTotals() {
        const rows = container.querySelectorAll(".quote-row");
        let subtotal = 0;

        rows.forEach(row => {
            const select = row.querySelector(".product-select");
            const qtyInput = row.querySelector(".quantity-input");
            const subtotalDiv = row.querySelector(".row-subtotal");

            const productPrice = productsData[select.value].price;
            const quantity = parseInt(qtyInput.value) || 0;
            const rowTotal = productPrice * quantity;

            subtotal += rowTotal;
            subtotalDiv.textContent = `$${rowTotal.toLocaleString()} CLP`;
        });

        const shipping = 4500; // Envío fijo Santiago RM
        const total = subtotal > 0 ? subtotal + shipping : 0;

        subtotalEl.textContent = `$${subtotal.toLocaleString()}`;
        totalEl.textContent = `$${total.toLocaleString()}`;
    }

    // Agregar primera fila por defecto
    addRow(0, 10);

    // Botón para agregar más filas
    addRowBtn.addEventListener("click", () => {
        addRow(0, 10);
    });

    // Enviar pedido cotizado por WhatsApp
    sendWhatsappBtn.addEventListener("click", () => {
        const rows = container.querySelectorAll(".quote-row");
        let message = "¡Hola! He armado la siguiente cotización en su web:\n\n";
        let subtotal = 0;

        rows.forEach((row, i) => {
            const select = row.querySelector(".product-select");
            const qtyInput = row.querySelector(".quantity-input");
            const productName = productsData[select.value].name;
            const productPrice = productsData[select.value].price;
            const quantity = parseInt(qtyInput.value) || 0;
            const rowTotal = productPrice * quantity;
            subtotal += rowTotal;

            message += `${i+1}. ${productName} - Cantidad: ${quantity} un. ($${rowTotal.toLocaleString()} CLP)\n`;
        });

        const shipping = 4500;
        const total = subtotal + shipping;

        message += `\nSubtotal: $${subtotal.toLocaleString()} CLP`;
        message += `\nEnvío (Santiago): $${shipping.toLocaleString()} CLP`;
        message += `\n*Total con envío: $${total.toLocaleString()} CLP*`;

        const phone = "56912345678";
        const encoded = encodeURIComponent(message);
        window.open(`https://wa.me/${phone}?text=${encoded}`, '_blank');
    });
});