/**
 * Produkte werden automatisch geladen
 * Nur Admins sehen das Hinzufügen-Formular
 * Nach dem Hinzufügen wird Produktliste aktualisiert
 * 
 * 🔄 loadProducts() – Produkte laden & anzeigen
 * ➕ #addProductForm Formular zum Hinzufügen eines Produkts
 */

function loadProducts() {
    // Sende eine GET-Anfrage an die REST-API, um alle Produkte zu laden
    $.ajax({
        url: 'http://localhost:5000/api/products', // API-Endpunkt für Produkte
        method: 'GET', // HTTP-Methode
        success: function (products) {
            // Wenn erfolgreich: Liste leeren
            $('#productList').empty();

            // Jedes Produkt als <li> anzeigen
            products.forEach(product => {
                $('#productList').append(`<li>${product.name} - ${product.price}€</li>`);
            });
        },
        error: function (err) {
            // Falls ein Fehler auftritt, zeige eine Fehlermeldung
            alert('Fehler beim Laden der Produkte');
        }
    });
}


$(document).ready(function () {
    // Prüft ob Benutzer ein Admin ist (z. B. durch JWT-Token)
    if (isAdmin()) {
        $('#adminArea').show(); // Admin-Bereich sichtbar
    } else {
        $('#adminArea').hide(); // Verbergen, wenn kein Admin
    }

    loadProducts(); // Lade Produkte sofort beim Laden der Seite
});

$('#addProductForm').submit(function (e) {
    e.preventDefault(); // Verhindert das normale Absenden des Formulars

    const token = getToken(); // Holt den Token aus localStorage (z. B. nach Login)

    // Daten aus dem Formular in ein Objekt lesen
    const product = {
        name: $('#name').val(), // Produktname
        description: $('#description').val(), // Beschreibung
        price: parseFloat($('#price').val()), // Preis als Zahl
        discount: 0, // Standardmäßig kein Rabatt
        is_offer: false, // Standardmäßig kein Angebot
        image_url: $('#image_url').val() // Bild-Dateiname
    };

    // Sende Produkt per POST an API
    $.ajax({
        url: 'http://localhost:5000/api/products',
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}` // Authentifizierung
        },
        contentType: 'application/json',
        data: JSON.stringify(product), // Produktdaten als JSON senden
        success: function () {
            alert('✅ Produkt wurde hinzugefügt!');
            loadProducts(); // Liste neu laden
        },
        error: function (err) {
            alert('❌ Fehler beim Hinzufügen');
            console.error(err);
        }
    });
});

