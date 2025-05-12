$(document).on('click', '.edit-product', function () {
    const product = $(this).data('product');
    $('#editId').val(product.id);
    $('#editName').val(product.name);
    $('#editDescription').val(product.description);
    $('#editPrice').val(product.price);
    $('#editDiscount').val(product.discount);
    $('#editIsOffer').val(product.is_offer);
    $('#editImageUrl').val(product.image_url);

    $('#editProductArea').show();
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

$(document).on('click', '.delete-product', function () {
    const id = $(this).data('id');

    if (confirm('Willst du dieses Produkt wirklich löschen?')) {
        $.ajax({
             url: 'http://localhost:5000/api/products',
            method: 'DELETE',
            success: function () {
                showMessage('Produkt gelöscht!', 'success');
                location.reload();
            },
            error: function (err) {
                console.error(err);
                showMessage('Fehler beim Löschen.', 'error');
            }
        });
    }
});

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
        image_url: $('#image_url').val() //Textfeld, kein Upload
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
           showMessage('✅ Produkt hinzugefügt!', 'success');
            location.reload();
        },
        error: function (err) {
            console.error(err);
            showMessage('Fehler beim Hinzufügen.', 'error');
        }
    });
});