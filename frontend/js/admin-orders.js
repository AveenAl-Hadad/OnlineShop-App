$(document).ready(function () {
    const token = localStorage.getItem('token');

    if (!token) {
        $('#admin-orders-container').html('<p>❌ Du bist nicht eingeloggt.</p>');
        return;
    }

    $.ajax({
        url: 'http://localhost:5000/api/orders/all',
        method: 'GET',
        headers: {
            Authorization: 'Bearer ' + token
        },
        success: function (orders) {
            if (orders.length === 0) {
                $('#admin-orders-container').html('<p>📭 Keine Bestellungen vorhanden.</p>');
                return;
            }

            $('#admin-orders-container').html('');
            orders.forEach(order => {
                const html = `
                    <div class="order-box">
                        <p><strong>Bestellung ID:</strong> ${order.id}</p>
                        <p><strong>Benutzer-ID:</strong> ${order.user_id}</p>
                        <p><strong>Bestelldatum:</strong> ${order.order_date}</p>
                        <p><strong>Status:</strong> ${order.status}</p>
                        <p><strong>Adresse:</strong> ${order.delivery_address}</p>
                        <p><strong>Name:</strong> ${order.name}</p>
                        <p><strong>Email:</strong> ${order.email}</p>
                        <p><strong>Telefon:</strong> ${order.phone}</p>
                        <p><strong>Zahlungsart:</strong> ${order.payment_method}</p>
                    </div>
                `;
                $('#admin-orders-container').append(html);
            });
        },
        error: function (err) {
            console.error(err);
            $('#admin-orders-container').html('<p>❌ Fehler beim Laden der Bestellungen.</p>');
        }
    });
});
