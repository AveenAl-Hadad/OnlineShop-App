$(document).ready(function () {
    const token = getToken();

    if (token) {
        $('#logoutLink').show();
        $('#loginLink').hide();
        if (isAdmin()) {
            $('#adminArea').show();
        }
    }

    $('#logoutLink').on('click', function (e) {
        e.preventDefault();
        localStorage.removeItem('token');
        showMessage('Du wurdest ausgeloggt.', 'success');
        setTimeout(() => window.location.href = 'index.html', 1000);
    });

    loadProducts();
    
});
// Sort Option
$('#sortSelect').on('change', function () {
    const sortBy = $(this).val();
    loadProducts(sortBy);
});
// ========== Hilfsfunktionen ==========
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

function showMessage(message, type = 'info') {
    $('#messageBox').text(message).css({
        backgroundColor: type === 'error' ? '#f8d7da' : '#d4edda',
        color: type === 'error' ? '#721c24' : '#155724',
        display: 'block'
    });
}

function loadProducts(sortBy = '') {
    $.ajax({
        url: 'http://localhost:5000/api/products',
        method: 'GET',
        success: function (products) {
            if (sortBy === 'price') {
                products.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
            } else if (sortBy === 'discount') {
                products.sort((a, b) => parseFloat(b.discount || 0) - parseFloat(a.discount || 0));
            }

            $('#products-container').empty();

            if (products.length > 0) {
                products.forEach(product => {
                    let priceDisplay = `<p>€${parseFloat(product.price).toFixed(2)}</p>`;

                    if (product.is_offer && parseFloat(product.discount) > 0) {
                        const discounted = product.price - (product.price * product.discount / 100);
                        priceDisplay = `
                            <p>
                                <del>€${parseFloat(product.price).toFixed(2)}</del>
                                <strong style="color:red;"> €${discounted.toFixed(2)} (Angebot!)</strong>
                            </p>`;
                    }
                    const imageUrl = `http://localhost:5000/static/images/${product.image_url}`;
                    const productHtml = `
                        <div class="product-card">
                            <img src="${imageUrl}" alt="${product.name}">
                            <h3>${product.name}</h3>
                            <p>${product.description}</p>
                            ${priceDisplay}
                            ${isAdmin() ? `
                                <button class="edit-product" data-product='${JSON.stringify(product)}'>Bearbeiten</button>
                                <button class="delete-product" data-id="${product.id}">Löschen</button>
                            ` : `
                                <button class="add-to-cart" data-id="${product.id}">In den Warenkorb</button>
                            `}
                        </div>
                    `;
                    $('#products-container').append(productHtml);
                });
            } else {
                $('#products-container').html('<p>Keine Produkte gefunden.</p>');
            }
        },
        error: function () {
            $('#products-container').html('<p>Fehler beim Laden der Produkte.</p>');
        }
    });
}


function renderProduct(product) {
    let priceDisplay = '';
    if (product.is_offer && product.discount > 0) {
        const discounted = product.price - (product.price * product.discount / 100);
        priceDisplay = `<p><del>€${parseFloat(product.price).toFixed(2)}</del>
                        <strong style="color:red;"> €${discounted.toFixed(2)} (Angebot!)</strong></p>`;
    } else {
        priceDisplay = `<p>€${parseFloat(product.price).toFixed(2)}</p>`;
    }
    const imageUrl = `http://localhost:5000/static/images/${product.image_url}`;
    const html = `
        <div class="product-card">
            <img src="${imageUrl}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p>${product.description}</p>
            ${priceDisplay}
            ${isAdmin()
                ? `<button class="edit-product" data-product='${JSON.stringify(product)}'>Bearbeiten</button>
                   <button class="delete-product" data-id="${product.id}">Löschen</button>`
                : `<button class="add-to-cart" data-id="${product.id}">In den Warenkorb</button>`}
        </div>
    `;
    $('#products-container').append(html);
}


