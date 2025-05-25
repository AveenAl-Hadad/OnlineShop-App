/**
 * Admin-Funktionen werden nur angezeigt, wenn der Benutzer ein Admin ist.
 * Produkte werden geladen, sortiert und angezeigt.
 * Admins können bearbeiten/löschen, normale Nutzer nur "in den Warenkorb" legen.
 * Tokens werden sicher behandelt (JWT).
 * Logout funktioniert mit Bestätigung & Weiterleitung.
 * Visuelle Nachrichtenbox (showMessage)
 * 
 * Wird ausgeführt, wenn das DOM vollständig geladen ist
 * 
 * Autor Aveen Al Hadad
 */

$(document).ready(function () {
    const token = getToken(); // 🔐 Token (JWT) aus localStorage holen

    $('#openAddProductModal').hide(); // 🔒 addProductLink zu Beginn ausblenden
    $('#orderLinkAdmin').hide();
    $('#orderLinkCustomer').hide();
    $('#user-info').text(''); // sicherheitshalber leeren
    
    if (token) {
        // Wenn ein Token vorhanden ist = Benutzer ist eingeloggt
        $('#logoutLink').show();     // 🔓 Logout-Link anzeigen
       // $('#cartButton').show(); 
        $('#loginLink').hide();      // 🔒 Login-Link ausblenden
        $('#openAddProductModal').hide();      // addProductLink sicherheitshalber nochmal verstecken
        $('#orderLinkCustomer').show();
        $('#orderLinkAdmin').hide();

        // 👤 Benutzername oder E-Mail in der Navbar anzeigen
        const payload = parseJwt(token);
        if (payload && payload.name) {
            $('#user-info').text(`👋 Hallo ${payload.name}`);
        } else if (payload && payload.email) {
            $('#user-info').text(`👋 Eingeloggt: ${payload.email}`);
        }

        if (isAdmin()) {
            // ✅ Wenn Rolle = admin
            $('#adminArea').show();   // 📦 Adminbereich (z. B. Formular) anzeigen
            $('#openAddProductModal').show();   // 🔗 addProductLink (z. B. Produkt hinzufügen) anzeigen
          //  $('#cartButton').hide();  // 🛒 Warenkorb ausblenden (Admin braucht das nicht)
            $('#orderLinkCustomer').hide();
            $('#orderLinkAdmin').show();
          
        }
    }

     // 🔴 Logout-Logik
    $('#logoutLink').on('click', function (e) {
        e.preventDefault(); // Verhindert Standardverhalten des Links
        localStorage.removeItem('token'); // 🔓 Token löschen (Benutzer ausloggen)
        showMessage('Du wurdest ausgeloggt.', 'success'); // ✅ Nachricht zeigen
        setTimeout(() => window.location.href = 'index.html', 1000); // ⏱️ Weiterleitung zur Startseite
    });
   
   // 👉 Nur Produkte laden, wenn nicht auf Bestellseite
    if (!window.location.pathname.includes('order.html')) {
        loadProducts();
    }

    // 👉 Nur Bestellungen laden, wenn auf order.html
    if (window.location.pathname.includes('order.html')) {
        if (!token) {
            $('#orders-container').html('<p>⚠️ Du bist nicht eingeloggt.</p>');
            return;
        }
        loadOrders(token);
    }
});

// 🔁 Reagiert auf Änderung im Dropdown "Sortieren nach"
$('#sortSelect').on('change', function () {
    const sortBy = $(this).val(); // Wert lesen
    loadProducts(sortBy);         // Produkte neu laden mit Sortierung
});

// 🔒 Holt Token aus localStorage
function getToken() {
    return localStorage.getItem('token');
}

// 🔓 JWT entschlüsseln und das Payload (z. B. Rolle) zurückgeben
function parseJwt(token) {
    try {
        return JSON.parse(atob(token.split('.')[1])); // payload-Teil decodieren
    } catch (e) {
        return null; // Bei Fehler: null zurückgeben
    }
}

// 🔎 Prüfen, ob der Benutzer ein Admin ist
function isAdmin() {
    const token = getToken();
    const payload = parseJwt(token);
    return payload && payload.role === 'admin';
}

// 🔔 Zeigt eine Nachricht in der Box an
function showMessage(message, type = 'info') {
    $('#messageBox').text(message).css({
        backgroundColor: type === 'error' ? '#f8d7da' : '#d4edda',
        color: type === 'error' ? '#721c24' : '#155724',
        display: 'block'
    }).fadeIn().delay(2500).fadeOut(); // langsam einblenden, kurz anzeigen, dann ausblenden
}

// 📦 Produkte vom Server laden (optional sortiert)
function loadProducts(sortBy = '') {
    $.ajax({
        url: 'http://localhost:5000/api/products', // API-Endpunkt
        method: 'GET',
        success: function (products) {

            storeAllProducts(products); // ✅ Wichtig für renderCart()

            // 🔃 Produkte sortieren
            if (sortBy === 'price') {
                products.sort((a, b) => parseFloat(a.price) - parseFloat(b.price)); // Preis aufsteigend
            } else if (sortBy === 'discount') {
                products.sort((a, b) => parseFloat(b.discount || 0) - parseFloat(a.discount || 0)); // Rabatt absteigend
            }

            $('#products-container').empty(); // Container leeren

            if (products.length > 0) {
                products.forEach(product => {

                    const stockInfo = product.stock > 0
                        ? `<p class="inventory">Lagerbestand: ${product.stock}</p>`
                        : `<br>`;

                    const addToCartButton = product.stock > 0
                        ? `<button class="add-to-cart btn btn-cart" data-id="${product.id}">
                               <i class="fas fa-cart-plus"></i> In den Warenkorb
                           </button>`
                        : `<button class="add-to-cart btn btn-cart" data-id="${product.id}" disabled>
                               <i class="fas fa-cart-plus"></i> Ausverkauft
                           </button>`;

                    let priceDisplay = `<p>€${parseFloat(product.price).toFixed(2)}</p>`;

                    // 💰 Falls Sonderangebot aktiv ist und Rabatt vorhanden
                    if (product.is_offer && parseFloat(product.discount) > 0) {
                        const discounted = product.price - (product.price * product.discount / 100);
                        priceDisplay = `
                            <p>
                                <del>€${parseFloat(product.price).toFixed(2)}</del>
                                <strong style="color:red;"> €${discounted.toFixed(2)} (Angebot!) ${parseInt(product.discount)}%</strong>
                            </p>`;
                    }

                    const imageUrl = `http://localhost:5000/static/images/${product.image_url}`; // Bildpfad

                    // 🧩 HTML-Code für das Produkt
                    const productHtml = `
                        <div class="product-card">
                            <img src="${imageUrl}" alt="${product.name}">
                            <h3>${product.name}</h3>
                            <p>${product.description}</p>
                            ${priceDisplay}
                            ${stockInfo}
                            ${addToCartButton}
                            ${isAdmin() ? `
                               <div class="admin-buttons">
                                    <button class="edit-product btn btn-edit" data-product='${JSON.stringify(product)}'>
                                        <i class="fas fa-edit"></i> Bearbeiten
                                    </button>
                                    <button class="delete-product btn btn-delete" data-id="${product.id}">
                                        <i class="fas fa-trash-alt"></i> Löschen
                                    </button>
                                </div>
                            ` : ''}
                        </div>
                    `;

                    $('#products-container').append(productHtml); // Produktkarte einfügen
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



// HTML-Fragmente mit jQuery Am Ende von index.html
$(document).ready(function () {
  // Lade externe HTML-Blöcke
  $('#add-product-container').load('add-product.html');
  $('#edit-product-container').load('edit-product.html');
  $('#slideshow').load('galary-bilder.html');
  $('#cartModal').load('warenkorp.html');
});
