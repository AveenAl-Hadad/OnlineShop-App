/**
 * 🛒 Warenkorb-Funktionalität (JavaScript mit jQuery)
 *  renderCart() – Zeigt alle Produkte im Warenkorb
 * 🔁 changeQuantity(id, delta) – Menge anpassen
 * 🔢 updateCartIcon() – Aktualisiert den Zähler oben
 * 💾 storeAllProducts(products) – Speichert alle Produktdaten lokal
 */

$(document).ready(function () {
    updateCartIcon();// ⏫ Zeigt zu Beginn die Anzahl im Warenkorb oben

    // ✅ Produkt zum Warenkorb hinzufügen
    $(document).on('click', '.add-to-cart', function () {
        const productId = $(this).data('id');// Produkt-ID aus Button holen
        let cart = JSON.parse(localStorage.getItem('cart')) || []; // Warenkorb aus localStorage laden
        
        // Prüfen, ob Produkt schon im Warenkorb ist
        const existing = cart.find(item => item.id === productId);
        if (existing) {
            existing.quantity++;// Menge erhöhen
        } else {
            cart.push({ id: productId, quantity: 1 });// Neues Produkt hinzufügen
        }
        localStorage.setItem('cart', JSON.stringify(cart)); // Warenkorb speichern
        showMessage('Produkt zum Warenkorb hinzugefügt!', 'success'); // Erfolgsmeldung
        updateCartIcon();// Zähler aktualisieren
    });

  // 🧾 Modal öffnen
    $('#cartButton').on('click', function () {
        $('#cartModal').fadeIn();
        renderCart();
    });

 // ❌ Modal schließen  
    $(document).on('click', '#closeCartModal, #continueShopping', function () {
        $('#cartModal').fadeOut();
    });
    
    
    // 🧹 Warenkorb komplett leeren
    $(document).on('click', '#clearCart', function () {
        localStorage.removeItem('cart');
        renderCart();       // Ansicht neu laden
        updateCartIcon();   // Zähler aktualisieren
    });

    // 💳 Zur Kasse (Platzhalter)
   $(document).on('click', '#checkout', function () {
        window.location.href = 'checkout.html';
    });


    // ➕ Menge erhöhen
    $(document).on('click', '.qty-plus', function () {
        changeQuantity($(this).data('id'), 1);
    });

     // ➖ Menge verringern
    $(document).on('click', '.qty-minus', function () {
        changeQuantity($(this).data('id'), -1);
    });

    // 🗑️ Produkt aus Warenkorb löschen
    $(document).on('click', '.remove-item', function () {
        const id = $(this).data('id');
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        cart = cart.filter(item => item.id !== id);  // Produkt entfernen
        localStorage.setItem('cart', JSON.stringify(cart));
        renderCart();
        updateCartIcon();
    });
});

// Zeigt die Inhalte im Warenkorb
function renderCart() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const products = JSON.parse(localStorage.getItem('allProducts')) || [];// Produktdetails
    const $list = $('#cartItemsList');
    $list.empty(); // Inhalt leeren

    if (cart.length === 0) {
        $list.html('<p>Dein Warenkorb ist leer.</p>');
        $('#cartTotal').text('Gesamt: €0.00');
        return;
    }

    let total = 0;

    cart.forEach(item => {
        const product = products.find(p => p.id === item.id); // Produktdaten finden
        if (!product) return;

        const price = product.is_offer && product.discount
            ? product.price - (product.price * product.discount / 100)
            : product.price;

        const subtotal = price * item.quantity;
        total += subtotal;
        const imageUrl = `http://localhost:5000/static/images/${product.image_url}`;
        
        // HTML für Produkt im Warenkorb
        const html = `                    
            <div class="cart-item">
                <div class="cart-item-left">
                    <img src="${imageUrl}" alt="${product.name}">
                </div>
                 <div class="cart-item-right">
                    <h4>${product.name}</h4>
                    <p>${product.description}</p>
                    <div class="cart-item-controls">
                        <button class="qty-minus" data-id="${item.id}">-</button>
                        <span>${item.quantity}</span>
                        <button class="qty-plus" data-id="${item.id}">+</button>
                        <span class="price">€${subtotal.toFixed(2)}</span>
                        <button class="remove-item" data-id="${item.id}" title="Entfernen">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
            <hr>
        `;
        $list.append(html);
    });

    $('#cartTotal').text(`Gesamt: €${total.toFixed(2)}`);
}

// Ändert die Menge
function changeQuantity(id, delta) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const item = cart.find(i => i.id === id);
    if (!item) return;

    item.quantity += delta;
    if (item.quantity <= 0) {
        cart = cart.filter(i => i.id !== id); // Produkt ganz entfernen
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    renderCart();
    updateCartIcon();
}

// Aktualisiert Warenkorb-Zähler
function updateCartIcon() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    $('#cartCount').text(`(${count})`);
}

// Wird im main.js aufgerufen nach loadProducts
function storeAllProducts(products) {
    localStorage.setItem('allProducts', JSON.stringify(products));
}


 