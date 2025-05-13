$(document).on('click', '.edit-product', function () {
    const product = $(this).data('product');
    $('#editId').val(product.id);
    $('#editName').val(product.name);
    $('#editDescription').val(product.description);
    $('#editPrice').val(product.price);
    $('#editDiscount').val(product.discount);
    $('#editIsOffer').val(product.is_offer);
    $('#editImageUrl').val(product.image_url);


    $('#editProductModal').fadeIn();
});
// Schließen
$('#closeEditModal, #cancelEditBtn').on('click', function () {
    $('#editProductModal').fadeOut();
});

$('#editProductForm').submit(function (e) {
    e.preventDefault();

    const updatedProduct = {
        id: $('#editId').val(),
        name: $('#editName').val(),
        description: $('#editDescription').val(),
        price: parseFloat($('#editPrice').val()),
        discount: parseFloat($('#editDiscount').val()) || 0,
        is_offer: $('#editIsOffer').is(':checked'),
        image_url: $('#editImageUrl').val()
    };

    $.ajax({
        url: `http://localhost:5000/api/products/${updatedProduct.id}`,

        method: 'PUT',
        contentType: 'application/json',
        data: JSON.stringify(updatedProduct),
        success: function () {
            showMessage('Produkt aktualisiert!', 'success');
            location.reload();
        },
        error: function (err) {
            console.error(err);
            showMessage('Fehler beim Aktualisieren.', 'error');
        }
    });
});

    /*
    $('#products-container').on('click', '.edit-product', function () {
        const product = $(this).data('product');
        const card = $(this).closest('.product-card');

        const editFormHtml = `
            <form class="inline-edit-form styled-form" data-id="${product.id}">
                <div class="form-group">
                    <label>Name</label>
                    <input type="text" name="name" value="${product.name}" required />
                </div>
                <div class="form-group">
                    <label>Beschreibung</label>
                    <textarea name="description" rows="4" required>${product.description}</textarea>
                </div>
                <div class="form-group">
                    <label>Preis (€)</label>
                    <input type="number" name="price" value="${product.price}" required />
                </div>
                <div class="form-group">
                    <label>Rabatt (%)</label>
                    <input type="number" name="discount" value="${product.discount || 0}" />
                </div>
                <div class="form-group">
                    <label>Bild-URL</label>
                    <input type="text" name="image_url" value="${product.image_url}" required />
                </div>
                <div class="form-group checkbox-group">
                    <label>
                        <input type="checkbox" name="is_offer" ${product.is_offer ? 'checked' : ''} />
                        Sonderangebot?
                    </label>
                </div>
                <div class="form-buttons">
                    <button type="submit" class="btn-save"><i class="fas fa-save"></i> Speichern</button>
                    <button type="button" class="btn-cancel cancel-edit"><i class="fas fa-times-circle"></i> Abbrechen</button>
                </div>
            </form>
        `;

        card.html(editFormHtml);
    });

    // 🔽 Speichern
    $('#products-container').on('submit', '.inline-edit-form', function (e) {
        e.preventDefault();

        const form = $(this);
        const id = form.data('id');

        const updatedProduct = {
            name: form.find('input[name="name"]').val().trim(),
            description: form.find('textarea[name="description"]').val().trim(),
            price: parseFloat(form.find('input[name="price"]').val()),
            discount: parseFloat(form.find('input[name="discount"]').val()) || 0,
            image_url: form.find('input[name="image_url"]').val().trim(),
            is_offer: form.find('input[name="is_offer"]').is(':checked')
        };

        $.ajax({
            url: `http://localhost:5000/api/products/${id}`,
            method: 'PUT',
            contentType: 'application/json',
            data: JSON.stringify(updatedProduct),
            success: function () {
                showMessage('✅ Produkt wurde aktualisiert.', 'success');
                loadProducts();
            },
            error: function (err) {
                console.error(err);
                showMessage('❌ Fehler beim Aktualisieren.', 'error');
            }
        });
    });

    // 🔽 Abbrechen
    $('#products-container').on('click', '.cancel-edit', function () {
        loadProducts(); // Produktliste neu laden
    });

*/
// 🔽 Produkt löschen
$(document).on('click', '.delete-product', function () {
    const id = $(this).data('id');

    if (confirm('Willst du dieses Produkt wirklich löschen?')) {
        $.ajax({
            url: `http://localhost:5000/api/products/${id}`,
            method: 'DELETE',
            success: function () {
                showMessage('🗑️ Produkt gelöscht!', 'success');
                loadProducts();
            },
            error: function (err) {
                console.error(err);
                showMessage('❌ Fehler beim Löschen.', 'error');
            }
        });
    }
});

// 🔽 Produkt hinzufügen
$('#addProductForm').on('submit', function (e) {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) {
        showMessage('Nicht autorisiert.', 'error');
        return;
    }

    const productData = {
        name: $('#name').val(),
        description: $('#description').val(),
        price: parseFloat($('#price').val()),
        discount: parseFloat($('#discount').val()) || 0,
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
           // showMessage('✅ Produkt hinzugefügt!', 'success');
            if (confirm("✅ Produkt wurde erfolgreich hinzugefügt.\nMöchten Sie ein weiteres Produkt hinzufügen?")) {
                $('#addProductForm')[0].reset();
            } else {
                window.location.href = 'index.html';
            }
        
            loadProducts();
        },
        error: function (err) {
            console.error(err);
            showMessage('❌ Fehler beim Hinzufügen.', 'error');
        }
    });
});
