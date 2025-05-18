$(document).ready(function () {
    const token = localStorage.getItem('token');

    if (!token) {
        $('#orders-container').html('<p>❌ Du bist nicht eingeloggt.</p>');
        return;
    }

    $.ajax({
        url: 'http://localhost:5000/api/orders/user',
        method: 'GET',
        headers: {
            Authorization: 'Bearer ' + localStorage.getItem('token')
        },
        success: function (orders) {
            if (orders.length === 0) {
                $('#orders-container').html('<p>📭 Keine Bestellungen gefunden.</p>');
                return;
            }

            orders.forEach(order => {
                const html = `
                    <div class="order-box">
                        <p><strong>Bestelldatum:</strong> ${order.order_date}</p>
                        <p><strong>Status:</strong> ${order.status}</p>
                        <p><strong>Adresse:</strong> ${order.delivery_address}</p>
                        <p><strong>Name:</strong> ${order.name}</p>
                        <p><strong>Email:</strong> ${order.email}</p>
                        <p><strong>Telefon:</strong> ${order.phone}</p>
                        <p><strong>Zahlungsart:</strong> ${order.payment_method}</p>
                    </div>
                `;
                $('#orders-container').append(html);
            });
        },
        error: function (err) {
            console.error(err);
            $('#orders-container').html('<p>❌ Fehler beim Laden der Bestellungen.</p>');
        }
    });
});


