function loadProducts() {
    $.ajax({
        url: 'http://localhost:5000/api/products',
        method: 'GET',
        success: function (products) {
            $('#productList').empty();
            products.forEach(product => {
                $('#productList').append(`<li>${product.name} - ${product.price}€</li>`);
            });
        },
        error: function (err) {
            alert('Fehler beim Laden der Produkte');
        }
    });
}

$(document).ready(function () {
    if (isAdmin()) {
        $('#adminArea').show();
    } else {
        $('#adminArea').hide();
    }

    loadProducts();
});
$('#addProductForm').submit(function (e) {
    e.preventDefault();

    const token = getToken();

    const product = {
        name: $('#name').val(),
        description: $('#description').val(),
        price: parseFloat($('#price').val()),
        discount: 0,
        is_offer: false,
        image_url: $('#image_url').val()
    };

    $.ajax({
        url: 'http://localhost:5000/api/products',
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`
        },
        contentType: 'application/json',
        data: JSON.stringify(product),
        success: function () {
            alert('Produkt wurde hinzugefügt!');
            loadProducts();
        },
        error: function (err) {
            alert('Fehler beim Hinzufügen');
            console.error(err);
        }
    });
});

