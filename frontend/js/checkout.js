$(document).ready(function () {
    
    
  $('#cancelCheckout').on('click', function () {
    if (confirm('Möchtest du die Bestellung wirklich abbrechen?')) {
        window.location.href = 'index.html';
    }
});



    
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
                
                $('#checkoutMessage').text('✅ Bestellung hat erfolgreich geschickt!');
                $('#checkoutMessage').append('<br>🔄 Weiterleitung in 5 Sekunden...');
                localStorage.removeItem('cart'); // Warenkorb leeren
                // Formular zurücksetzen
                $('#checkoutForm').trigger('reset');
                // 5 Sekunden warten, dann weiterleiten zu startseite und Produkte neu laden
                setTimeout(function () {
                    window.location.href = 'index.html';
                    loadProducts(); 
                }, 5000); // 5000 = 5 Seconden
            },
            error: function (xhr, status, error) {
                 console.error("Fehler beim Absenden der Bestellung:", xhr.status, xhr.responseText);
                $('#checkoutMessage').text(`❌ Fehler: ${xhr.status} – ${xhr.responseText}`);
            }

        });
    });
});
