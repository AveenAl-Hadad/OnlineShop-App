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

    $('#addProductLink').hide(); // 🔒 addProductLink zu Beginn ausblenden

    if (token) {
        // Wenn ein Token vorhanden ist = Benutzer ist eingeloggt
        $('#logoutLink').show();     // 🔓 Logout-Link anzeigen
        $('#loginLink').hide();      // 🔒 Login-Link ausblenden
        $('#addProductLink').hide();      // addProductLink sicherheitshalber nochmal verstecken

        if (isAdmin()) {
            // ✅ Wenn Rolle = admin
            $('#adminArea').show();   // 📦 Adminbereich (z. B. Formular) anzeigen
            $('#addProductLink').show();   // 🔗 addProductLink (z. B. Produkt hinzufügen) anzeigen
            $('#cartButton').hide();  // 🛒 Warenkorb ausblenden (Admin braucht das nicht)
        }
    }

     // 🔴 Logout-Logik
    $('#logoutLink').on('click', function (e) {
        e.preventDefault(); // Verhindert Standardverhalten des Links
        localStorage.removeItem('token'); // 🔓 Token löschen (Benutzer ausloggen)
        showMessage('Du wurdest ausgeloggt.', 'success'); // ✅ Nachricht zeigen
        setTimeout(() => window.location.href = 'index.html', 1000); // ⏱️ Weiterleitung zur Startseite
    });

    loadProducts(); // 🛍️ Produkte beim Start laden
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
            // 🔃 Produkte sortieren
            if (sortBy === 'price') {
                products.sort((a, b) => parseFloat(a.price) - parseFloat(b.price)); // Preis aufsteigend
            } else if (sortBy === 'discount') {
                products.sort((a, b) => parseFloat(b.discount || 0) - parseFloat(a.discount || 0)); // Rabatt absteigend
            }

            $('#products-container').empty(); // Container leeren

            if (products.length > 0) {
                products.forEach(product => {
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
                            ${isAdmin() ? `
                               <div class="admin-buttons">
                                    <button class="edit-product btn btn-edit" data-product='${JSON.stringify(product)}'>
                                        <i class="fas fa-edit"></i> Bearbeiten
                                    </button>
                                    <button class="delete-product btn btn-delete" data-id="${product.id}">
                                        <i class="fas fa-trash-alt"></i> Löschen
                                    </button>
                                </div>
                            ` : `
                                <button class="add-to-cart btn btn-cart" data-id="${product.id}">
                                    <i class="fas fa-cart-plus"></i> In den Warenkorb
                                </button>
                            `}
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