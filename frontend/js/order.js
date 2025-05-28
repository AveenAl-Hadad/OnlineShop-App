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
        success: (orders) => {
            const container = $('#orders-container');
            container.empty();

            if (orders.length === 0) {
                container.append('<p>Keine Bestellungen gefunden.</p>');
                return;
            }

            orders.forEach(order => {
                const orderDiv = $(`
                    <div class="order-box">
                        <h3>🧾 Bestellung Nr. ${order.id}</h3>
                        <p><strong>Datum:</strong> ${new Date(order.order_date).toLocaleString()}</p>
                        <p><strong>Adresse:</strong> ${order.delivery_address}</p>
                        <p><strong>Status:</strong> ${order.status}</p>
                        <p><strong>Name:</strong> ${order.name}</p>
                        <p><strong>Email:</strong> ${order.email}</p>
                        <p><strong>Telefon:</strong> ${order.phone}</p>
                        <ul class="items-list"></ul>
                    </div>
                `);

                const itemsList = orderDiv.find('.items-list');
                if (order.items && order.items.length > 0) {
                    order.items.forEach(item => {
                        itemsList.append(`<li>${item.quantity} × ${item.product_name}</li>`);
                    });
                } else {
                    itemsList.append('<li>Keine Artikel gefunden.</li>');
                }

                container.append(orderDiv);
            });
        },
        error: (err) => {
        console.error('Fehler beim Laden der Bestellungen:', err);
        $('#orders-container').html('<p>Fehler beim Laden der Bestellungen</p>');
    }
  });
});
