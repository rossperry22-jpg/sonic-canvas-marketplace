// Sonic Canvas Marketplace Commerce System
// Shopping cart and checkout integration

(function() {
    'use strict';
    
    const CONFIG = {
        apiBaseUrl: 'https://sonic-canvas-api.vercel.app/api', // Replace with your API URL
        stripePublicKey: 'pk_live_51SzjGNFAF1P4VlAXSWG8v6IVeMPqU3swoGR2s7fvtGjBmwO0VhbUzWYVNBdXIA7K8CxfZ02OfjWoovGvagQRx5mo00VKREs5AK', // Stripe publishable key
        merchantWallet: 'H8qm8nUzF8kbU8pA2gUACGmpk9P5v2soyLXYJ6QBxUaH', // Solana merchant wallet
        currency: 'USD',
        solanaExchangeRate: 30 // Approx SOL to USD, should be fetched from API
    };
    
    // Cart state
    let cart = JSON.parse(localStorage.getItem('sonicCanvasCart')) || [];
    
    // DOM elements
    let cartSidebar = null;
    let cartIcon = null;
    
    // Initialize commerce system
    function init() {
        createCartIcon();
        createCartSidebar();
        renderCart();
        attachEventListeners();
        
        console.log('Commerce system initialized');
    }
    
    // Create cart icon in top bar
    function createCartIcon() {
        const topBar = document.querySelector('.top-bar');
        if (!topBar) return;
        
        const existingIcon = document.getElementById('cart-icon');
        if (existingIcon) return;
        
        cartIcon = document.createElement('div');
        cartIcon.id = 'cart-icon';
        cartIcon.className = 'cart-icon';
        cartIcon.innerHTML = `
            <i class="fas fa-shopping-cart"></i>
            <span class="cart-count">${getCartCount()}</span>
        `;
        
        // Insert after search container
        const searchContainer = document.querySelector('.search-container');
        if (searchContainer) {
            searchContainer.parentNode.insertBefore(cartIcon, searchContainer.nextSibling);
        } else {
            topBar.appendChild(cartIcon);
        }
    }
    
    // Create cart sidebar
    function createCartSidebar() {
        cartSidebar = document.createElement('div');
        cartSidebar.id = 'cart-sidebar';
        cartSidebar.className = 'cart-sidebar';
        cartSidebar.innerHTML = `
            <div class="cart-header">
                <h3>Your Cart</h3>
                <button class="close-cart">&times;</button>
            </div>
            <div class="cart-items"></div>
            <div class="cart-footer">
                <div class="cart-total">
                    Total: <span class="total-amount">$0.00</span>
                </div>
                <button class="checkout-btn" disabled>Proceed to Checkout</button>
                <button class="clear-cart-btn">Clear Cart</button>
            </div>
        `;
        document.body.appendChild(cartSidebar);
    }
    
    // Render cart items
    function renderCart() {
        if (!cartSidebar) return;
        
        const itemsContainer = cartSidebar.querySelector('.cart-items');
        const totalAmount = cartSidebar.querySelector('.total-amount');
        const checkoutBtn = cartSidebar.querySelector('.checkout-btn');
        
        if (cart.length === 0) {
            itemsContainer.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
            totalAmount.textContent = '$0.00';
            checkoutBtn.disabled = true;
            return;
        }
        
        let total = 0;
        itemsContainer.innerHTML = '';
        
        cart.forEach((item, index) => {
            const itemElement = document.createElement('div');
            itemElement.className = 'cart-item';
            itemElement.innerHTML = `
                <div class="item-info">
                    <h4>${item.name}</h4>
                    <p>$${item.price.toFixed(2)} × ${item.quantity}</p>
                </div>
                <div class="item-actions">
                    <button class="remove-item" data-index="${index}">&times;</button>
                </div>
            `;
            itemsContainer.appendChild(itemElement);
            total += item.price * item.quantity;
        });
        
        totalAmount.textContent = `$${total.toFixed(2)}`;
        checkoutBtn.disabled = false;
        
        // Update cart icon count
        const cartCount = document.querySelector('.cart-count');
        if (cartCount) {
            cartCount.textContent = getCartCount();
        }
    }
    
    // Add item to cart
    function addToCart(product) {
        const existingItem = cart.find(item => item.id === product.id);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({
                ...product,
                quantity: 1
            });
        }
        
        saveCart();
        renderCart();
        showNotification(`${product.name} added to cart`);
    }
    
    // Remove item from cart
    function removeFromCart(index) {
        cart.splice(index, 1);
        saveCart();
        renderCart();
    }
    
    // Clear cart
    function clearCart() {
        cart = [];
        saveCart();
        renderCart();
        showNotification('Cart cleared');
    }
    
    // Save cart to localStorage
    function saveCart() {
        localStorage.setItem('sonicCanvasCart', JSON.stringify(cart));
    }
    
    // Get total item count
    function getCartCount() {
        return cart.reduce((sum, item) => sum + item.quantity, 0);
    }
    
    // Show notification
    function showNotification(message) {
        // Simple notification implementation
        const notification = document.createElement('div');
        notification.className = 'commerce-notification';
        notification.textContent = message;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('fade-out');
            setTimeout(() => notification.remove(), 300);
        }, 2000);
    }
    
    // Attach event listeners
    function attachEventListeners() {
        // Cart icon click
        document.addEventListener('click', function(e) {
            if (e.target.closest('#cart-icon')) {
                cartSidebar.classList.add('open');
            }
            
            if (e.target.closest('.close-cart')) {
                cartSidebar.classList.remove('open');
            }
            
            if (e.target.closest('.clear-cart-btn')) {
                if (confirm('Are you sure you want to clear your cart?')) {
                    clearCart();
                }
            }
            
            if (e.target.closest('.remove-item')) {
                const index = parseInt(e.target.dataset.index);
                removeFromCart(index);
            }
            
            if (e.target.closest('.checkout-btn')) {
                proceedToCheckout();
            }
        });
        
        // Close cart when clicking outside
        document.addEventListener('click', function(e) {
            if (cartSidebar && cartSidebar.classList.contains('open') &&
                !cartSidebar.contains(e.target) && !e.target.closest('#cart-icon')) {
                cartSidebar.classList.remove('open');
            }
        });
    }
    
    // Proceed to checkout
    async function proceedToCheckout() {
        // Convert cart items to API format
        const items = cart.map(item => ({
            product_id: item.id,
            quantity: item.quantity,
            price_usd: item.price,
            price_sol: item.price / CONFIG.solanaExchangeRate
        }));
        
        // Create order via API
        try {
            const response = await fetch(`${CONFIG.apiBaseUrl}/orders`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    items,
                    customer_email: '', // Would collect from user in production
                    payment_method: 'pending', // determined later
                    metadata: { source: 'web' }
                })
            });
            
            const order = await response.json();
            
            if (!order.success) throw new Error(order.error);
            
            // Show checkout modal with payment options
            showCheckoutModal(order.order);
        } catch (error) {
            console.error('Checkout error:', error);
            alert('Checkout failed. Please try again.');
        }
    }
    
    // Show checkout modal
    function showCheckoutModal(order) {
        const modal = document.createElement('div');
        modal.id = 'checkout-modal';
        modal.className = 'checkout-modal';
        modal.innerHTML = `
            <div class="checkout-content">
                <h2>Complete Purchase</h2>
                <p>Order: <strong>${order.order_number}</strong></p>
                <p>Total: <strong>$${order.total_usd.toFixed(2)}</strong></p>
                
                <div class="payment-options">
                    <button class="payment-option stripe-option">
                        <i class="fab fa-cc-stripe"></i> Pay with Card
                    </button>
                    <button class="payment-option solana-option">
                        <i class="fas fa-coins"></i> Pay with Solana
                    </button>
                </div>
                
                <button class="close-modal">&times;</button>
            </div>
        `;
        document.body.appendChild(modal);
        
        // Event listeners for payment options
        modal.querySelector('.stripe-option').addEventListener('click', () => initiateStripeCheckout(order));
        modal.querySelector('.solana-option').addEventListener('click', () => initiateSolanaPayment(order));
        modal.querySelector('.close-modal').addEventListener('click', () => modal.remove());
    }
    
    // Initiate Stripe checkout
    async function initiateStripeCheckout(order) {
        try {
            // Convert cart items for Stripe
            const items = cart.map(item => ({
                product_id: item.id,
                quantity: item.quantity
            }));
            
            const response = await fetch(`${CONFIG.apiBaseUrl}/create-checkout-session`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    items,
                    success_url: `${window.location.origin}/success.html`,
                    cancel_url: window.location.href,
                    order_id: order.id
                })
            });
            
            const { sessionId, url } = await response.json();
            
            // Redirect to Stripe Checkout
            window.location.href = url;
        } catch (error) {
            console.error('Stripe checkout error:', error);
            alert('Failed to initialize Stripe checkout.');
        }
    }
    
    // Initiate Solana payment
    async function initiateSolanaPayment(order) {
        try {
            const response = await fetch(`${CONFIG.apiBaseUrl}/create-solana-payment`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    order_id: order.id,
                    wallet_address: '' // Would collect from user wallet
                })
            });
            
            const paymentRequest = await response.json();
            
            // Show QR code and instructions
            const modal = document.createElement('div');
            modal.id = 'solana-modal';
            modal.className = 'checkout-modal';
            modal.innerHTML = `
                <div class="checkout-content">
                    <h2>Pay with Solana</h2>
                    <p>Send <strong>${order.total_sol} SOL</strong> to:</p>
                    <p style="background: var(--secondary-bg); padding: 1rem; border-radius: 8px; font-family: monospace;">
                        ${CONFIG.merchantWallet}
                    </p>
                    <p>Reference: ${paymentRequest.paymentRequest.reference}</p>
                    <img src="${paymentRequest.qrCodeUrl}" alt="Solana Pay QR Code" style="max-width: 300px; margin: 1rem auto; display: block;">
                    <p style="color: var(--text-secondary); font-size: 0.9rem;">
                        Scan QR code with Solana Pay compatible wallet or copy address above.
                    </p>
                    <button class="btn btn-primary" id="close-solana-modal">Close</button>
                </div>
            `;
            document.body.appendChild(modal);
            
            modal.querySelector('#close-solana-modal').addEventListener('click', () => modal.remove());
        } catch (error) {
            console.error('Solana payment error:', error);
            alert('Failed to initialize Solana payment.');
        }
    }
    
    // Public API
    window.SonicCanvasCommerce = {
        init,
        addToCart,
        removeFromCart,
        clearCart,
        getCartCount
    };
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();