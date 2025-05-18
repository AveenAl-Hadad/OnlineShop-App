$(document).ready(function () {
    
    $('#checkoutForm').on('submit', function (e) {
        e.preventDefault();

        const token = localStorage.getItem('token'); // dein JWT Token

        const orderData = {
            delivery_address: $('#delivery_address').val(),
            name: $('#name').val(),
            phone: $('#phone').val(),
            email: $('#email').val(),
            payment_method: $('#payment_method').val(),
            cart: JSON.parse(localStorage.getItem('cart')) || []
        };

        $.ajax({
            url: 'http://localhost:5000/api/orders',
            method: 'POST',
            contentType: 'application/json',
            headers: {
                Authorization: `Bearer ${token}`
            },
            data: JSON.stringify(orderData),
            success: function (response) {
                $('#checkoutMessage').text('✅ Bestellung erfolgreich!');
                localStorage.removeItem('cart'); // Warenkorb leeren
            },
            error: function (xhr, status, error) {
                 console.error("Fehler beim Absenden der Bestellung:", xhr.status, xhr.responseText);
                $('#checkoutMessage').text(`❌ Fehler: ${xhr.status} – ${xhr.responseText}`);
            }

        });
    });
});
