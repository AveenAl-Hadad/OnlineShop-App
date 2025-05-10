// Warten, bis das DOM bereit ist
$(document).ready(function () {
    // Produkte von der Backend-API abrufen
    $.ajax({
        url: 'http://localhost:5000/api/products', // Dein Backend-Endpunkt für Produkte
        method: 'GET',
        success: function (products) {
            // Produkte in HTML umwandeln und anzeigen
            if (products.length > 0) {
                products.forEach(product => {
                    $('#products-container').append(`
                        <div class="product-card">
                            <img src="${product.image_url}" alt="${product.name}">
                            <h3>${product.name}</h3>
                            <p>${product.description}</p>
                            <p>€${product.price}</p>
                            <button class="add-to-cart" data-id="${product.id}">In den Warenkorb</button>
                        </div>
                    `);
                });
            } else {
                $('#products-container').html('<p>Keine Produkte gefunden.</p>');
            }
        },
        error: function (err) {
            console.error('Fehler beim Abrufen der Produkte:', err);
            $('#products-container').html('<p>Fehler beim Laden der Produkte.</p>');
        }
    });
});
