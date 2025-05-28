/**
 * Produkt bearbeiten(Popup-Modal öffnen & befüllen)
 *  Produkt aktualisieren (per PUT)
 * 🗑️ Produkt löschen
 * ➕ Neues Produkt hinzufügen 
 * 
 */

// Wenn auf einen "Bearbeiten"-Button (class="edit-product") geklickt wird:
$('#edit-product-container').load('edit-product.html', function() { 
$(document).on('click', '.edit-product', function () {

    const product = $(this).data('product'); // Holt das Produkt-Objekt aus dem data-Attribut

    // Füllt die Formularfelder im Bearbeiten-Modal mit den aktuellen Produktdaten
    $('#editId').val(product.id);
    $('#editName').val(product.name);
    $('#editDescription').val(product.description);
    $('#editPrice').val(product.price);
    $('#editDiscount').val(product.discount);
    $('#editIsOffer').val(product.is_offer);
    $('#editImageUrl').val(product.image_url);
    $('#editStock').val(product.stock);

     // Zeigt das Modal-Fenster an (per fadeIn)
    $('#editProductModal').fadeIn();
});

// Bearbeiten-Modal schließen
$(document).on('click', '#cancelEditBtn, #closeEditModal', function () {
    $('#editProductModal').hide();
});

// Beim Absenden des Bearbeiten-Formulars
$('#editProductForm').submit(function (e) {
    e.preventDefault(); // Verhindert das normale Absenden

    // Liest die neuen Werte aus dem Formular
    const updatedProduct = {
        id: $('#editId').val(),
        name: $('#editName').val(),
        description: $('#editDescription').val(),
        price: parseFloat($('#editPrice').val()),
        discount: parseFloat($('#editDiscount').val()) || 0,
        is_offer: $('#editIsOffer').is(':checked'),
        image_url: $('#editImageUrl').val(),
        stock: parseInt($('#editStock').val()) || 0
        
    };

     // AJAX-PUT-Request an den Server senden
    $.ajax({
        url: `http://localhost:5000/api/products/${updatedProduct.id}`, // API-URL mit ID

        method: 'PUT',
        contentType: 'application/json',
        data: JSON.stringify(updatedProduct), // Daten als JSON senden
        success: function () {
            showMessage('Produkt aktualisiert!', 'success');
            location.reload(); // Seite neu laden
        },
        error: function (err) {
            console.error(err);
            showMessage('Fehler beim Aktualisieren.', 'error'); // Fehlermeldung
        }
    });
});
});
// Wenn auf "Löschen"-Button geklickt wird
$(document).on('click', '.delete-product', function () {
    const id = $(this).data('id'); // Produkt-ID aus dem Button

    // Sicherheitsabfrage
    if (confirm('Willst du dieses Produkt wirklich löschen?')) {
        $.ajax({
            url: `http://localhost:5000/api/products/${id}`,
            method: 'DELETE',
            success: function () {
                showMessage('🗑️ Produkt gelöscht!', 'success');
                loadProducts(); // Produkte neu laden
            },
            error: function (err) {
                console.error(err);
                showMessage('❌ Fehler beim Löschen.', 'error');
            }
        });
    }
});

// 🔽 Produkt hinzufügen
$('#add-product-container').load('add-product.html', function() {  
$('#addProductForm').on('submit', function (e) {
    e.preventDefault();

    const token = localStorage.getItem('token'); // Holt den Login-Token
    if (!token) {
        showMessage('Nicht autorisiert.', 'error');
        return;
    }

    // Produktdaten aus Formularfeldern sammeln
    const productData = {
        name: $('#name').val(),
        description: $('#description').val(),
        price: parseFloat($('#price').val()),
        discount: parseFloat($('#discount').val()) || 0,
        is_offer: $('#is_offer').is(':checked'),
        image_url: $('#image_url').val(),
        stock: parseInt($('#stock').val()) || 0
    };

    // AJAX-POST-Request an die API
    $.ajax({
        url: 'http://localhost:5000/api/products',
        method: 'POST',
        headers: {
            'Authorization': 'Bearer ' + token, // Authentifizierung
            'Content-Type': 'application/json'
        },
        data: JSON.stringify(productData),
        success: function () {
            // Erfolgsmeldung + Benutzerfrage
            if (confirm("✅ Produkt wurde erfolgreich hinzugefügt.\nMöchten Sie ein weiteres Produkt hinzufügen?")) {
                $('#addProductForm')[0].reset(); // Formular leeren
            } else {
                window.location.href = 'index.html'; // Zurück zur Hauptseite
            }
            loadProducts(); // Produkte neu laden
        },
        error: function (err) {
            console.error(err);
            showMessage('❌ Fehler beim Hinzufügen.', 'error');
        }
    });
});
// add product
// Öffnet das Modal
$('#openAddProductModal').on('click', function (e) {
  e.preventDefault(); // Verhindert den Link-Klick
  $('#addProductModal').show();
});

// Hinzufügen-Modal schließen
$(document).on('click', '#cancelAddProduct, #closeAddProductModal', function () {
    $('#addProductModal').hide();
});

// Klick außerhalb vom Modal schließt es
$(window).on('click', function (e) {
  if (e.target.id === 'addProductModal') {
    $('#addProductModal').hide();
  }
  // Formular zurücksetzen (optional)
$(document).on('click', '.btn-reset', function () {
    $(this).closest('form')[0].reset();
});
});
});