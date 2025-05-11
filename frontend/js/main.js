$(document).ready(function () {
    const token = getToken();

    // Sichtbarkeit für Admins
    if (token && isAdmin()) {
        $('#adminArea').show();
        $('#logoutLink').show();
        $('#loginLink').hide();
    }

    if (token) {
        $('#logoutLink').show();
        $('#loginLink').hide();
    }

    loadProducts();
});

// Logout
$('#logoutLink').on('click', function (e) {
    e.preventDefault();
    localStorage.removeItem('token');
    alert('Du wurdest ausgeloggt.');
    window.location.href = 'index.html';
});

// Produkte laden & anzeigen
function loadProducts() {
    $.ajax({
        url: 'http://localhost:5000/api/products',
        method: 'GET',
        success: function (products) {
            console.log("Produkte geladen:", products); // Debug

            if (products.length > 0) {
                products.forEach(product => {
                    let discount = parseFloat(product.discount) || 0;
                    let isOffer = product.is_offer == 1 || product.is_offer === true;

                    if (isOffer && discount > 0) {
                        const discounted = product.price - (product.price * discount / 100);
                        priceDisplay = `
                            <p>
                                <del>€${parseFloat(product.price).toFixed(2)}</del>
                                <strong style="color:red;"> €${discounted.toFixed(2)} (Angebot!)</strong>
                            </p>
                        `;
                    } else {
                        priceDisplay = `<p>€${parseFloat(product.price).toFixed(2)}</p>`;
                    }

                    const html = isAdmin()
                        ? `
                            <div class="product-card">
                                <img src="${product.image_url}" alt="${product.name}">
                                <h3>${product.name}</h3>
                                <p>${product.description}</p>
                                ${priceDisplay}
                                <button class="edit-product" data-product='${JSON.stringify(product)}'>Bearbeiten</button>
                                <button class="delete-product" data-id="${product.id}">Löschen</button>
                            </div>
                        `
                        : `
                            <div class="product-card">
                                <img src="${product.image_url}" alt="${product.name}">
                                <h3>${product.name}</h3>
                                <p>${product.description}</p>
                                ${priceDisplay}
                                <button class="add-to-cart" data-id="${product.id}">In den Warenkorb</button>
                            </div>
                        `;
                    
                    $('#products-container').append(html);
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
}

// Produkt hinzufügen
$('#addProductForm').on('submit', function (e) {
    e.preventDefault();

    const token = getToken();
    if (!token || !isAdmin()) {
        alert("Keine Berechtigung!");
        return;
    }

    const productData = {
        name: $('#name').val(),
        description: $('#description').val(),
        price: parseFloat($('#price').val()),
        discount: parseInt($('#discount').val()) || 0,
        is_offer: $('#is_offer').is(':checked'),
        image_url: $('#image_url').val()
    };

    $.ajax({
        url: 'http://localhost:5000/api/products',
        method: 'POST',
        headers: {
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json'
        },
        data: JSON.stringify(productData),
        success: function () {
            alert('Produkt hinzugefügt!');
            location.reload();
        },
        error: function (err) {
            console.error('Fehler beim Hinzufügen:', err);
            alert('Fehler beim Hinzufügen');
        }
    });
});

// Produkt bearbeiten vorbereiten
$(document).on('click', '.edit-product', function () {
    const product = $(this).data('product');
    $('#editId').val(product.id);
    $('#editName').val(product.name);
    $('#editDescription').val(product.description);
    $('#editPrice').val(product.price);
    $('#editImageUrl').val(product.image_url);
    $('#editProductArea').show();
});

// Produkt bearbeiten absenden
$('#editProductForm').on('submit', function (e) {
    e.preventDefault();

    const updatedProduct = {
        id: $('#editId').val(),
        name: $('#editName').val(),
        description: $('#editDescription').val(),
        price: parseFloat($('#editPrice').val()),
        image_url: $('#editImageUrl').val()
    };

    $.ajax({
        url: 'http://localhost:5000/api/products/update',
        method: 'PUT',
        contentType: 'application/json',
        data: JSON.stringify(updatedProduct),
        success: function () {
            alert('Produkt aktualisiert!');
            location.reload();
        },
        error: function (err) {
            console.error('Fehler beim Aktualisieren:', err);
            alert('Fehler beim Aktualisieren.');
        }
    });
});

// Produkt löschen
$(document).on('click', '.delete-product', function () {
    const id = $(this).data('id');

    if (confirm('Willst du dieses Produkt wirklich löschen?')) {
        $.ajax({
            url: `http://localhost:5000/api/products/${id}`,
            method: 'DELETE',
            success: function () {
                alert('Produkt gelöscht!');
                location.reload();
            },
            error: function (err) {
                console.error('Fehler beim Löschen:', err);
                alert('Fehler beim Löschen.');
            }
        });
    }
});

// Hilfsfunktionen
function getToken() {
    return localStorage.getItem('token');
}

function parseJwt(token) {
    try {
        return JSON.parse(atob(token.split('.')[1]));
    } catch (e) {
        return null;
    }
}

function isAdmin() {
    const token = getToken();
    const payload = parseJwt(token);
    return payload && payload.role === 'admin';
}
