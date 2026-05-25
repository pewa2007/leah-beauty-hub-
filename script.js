// ============ NAVIGATION ============
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');
const navLinks = document.querySelectorAll('.nav-menu a');

hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('active');
});

navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
    });
});

// ============ SHOPPING CART ============
let cart = JSON.parse(localStorage.getItem('cart')) || [];
const cartBtn = document.getElementById('cartBtn');
const cartModal = document.getElementById('cartModal');
const cartItems = document.getElementById('cartItems');
const emptyCart = document.getElementById('emptyCart');
const cartTotal = document.getElementById('cartTotal');

cartBtn.addEventListener('click', openCart);

function openCart() {
    cartModal.classList.remove('hidden');
    updateCartDisplay();
}

function closeCart() {
    cartModal.classList.add('hidden');
}

function addToCart(button) {
    const card = button.closest('.product-card');
    const productId = card.dataset.productId;
    const productName = card.dataset.productName;
    const productPrice = parseFloat(card.dataset.productPrice);

    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: productId,
            name: productName,
            price: productPrice,
            quantity: 1
        });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    showToast(`${productName} added to cart!`);
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartDisplay();
    showToast('Item removed from cart');
}

function updateCartDisplay() {
    cartItems.innerHTML = '';

    if (cart.length === 0) {
        emptyCart.style.display = 'flex';
        cartTotal.textContent = '$0.00';
        return;
    }

    emptyCart.style.display = 'none';

    let total = 0;

    cart.forEach(item => {
        total += item.price * item.quantity;

        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <div class="cart-item-info">
                <h4>${item.name}</h4>
                <p>Qty: ${item.quantity}</p>
            </div>
            <div style="text-align: right;">
                <div class="cart-item-price">$${(item.price * item.quantity).toFixed(2)}</div>
                <button class="cart-item-remove" onclick="removeFromCart('${item.id}')">Remove</button>
            </div>
        `;
        cartItems.appendChild(cartItem);
    });

    cartTotal.textContent = `$${total.toFixed(2)}`;
}

function checkout() {
    if (cart.length === 0) {
        showToast('Your cart is empty!');
        return;
    }

    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    showToast(`Proceeding to checkout... Total: $${total.toFixed(2)}`);

    setTimeout(() => {
        cart = [];
        localStorage.removeItem('cart');
        updateCartDisplay();
        closeCart();
        showToast('Order placed successfully! Thank you for your purchase.');
    }, 1500);
}

// ============ TOAST NOTIFICATIONS ============
const toast = document.getElementById('toast');

function showToast(message) {
    toast.textContent = message;
    toast.classList.add('show');

    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// ============ NEWSLETTER ============
const newsletterForm = document.getElementById('newsletterForm');

newsletterForm.addEventListener('submit', subscribeNewsletter);

function subscribeNewsletter(e) {
    e.preventDefault();
    const email = e.target.querySelector('input[type="email"]').value;
    showToast(`Welcome! Check your email at ${email} for exclusive updates.`);
    newsletterForm.reset();
}

// ============ SCROLL ANIMATIONS ============
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = entry.target.dataset.animation || 'fadeInUp 0.8s ease';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.product-card, .gallery-item, .value-item, .contact-item').forEach(el => {
    observer.observe(el);
});

// ============ SMOOTH SCROLL ============
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// ============ NAVBAR STYLING ON SCROLL ============
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.style.borderBottomColor = 'rgba(255, 94, 87, 0.3)';
    } else {
        navbar.style.borderBottomColor = 'rgba(255, 94, 87, 0.1)';
    }
});

// ============ CLOSE CART ON OUTSIDE CLICK ============
window.addEventListener('click', (e) => {
    if (e.target === cartModal) {
        closeCart();
    }
});

// ============ KEYBOARD ESCAPE ============
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeCart();
        navMenu.classList.remove('active');
    }
});

// ============ INITIALIZE ============
updateCartDisplay();

// ============ DARK MODE TOGGLE ============
function toggleDarkMode() {
    document.body.classList.toggle('light-mode');
    localStorage.setItem('darkMode', document.body.classList.contains('light-mode') ? 'light' : 'dark');
}

// Load saved theme preference
const savedTheme = localStorage.getItem('darkMode') || 'dark';
if (savedTheme === 'light') {
    document.body.classList.add('light-mode');
}