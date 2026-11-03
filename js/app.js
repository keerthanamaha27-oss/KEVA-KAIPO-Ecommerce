
/**
 * KEVA KAIPO - Core Application Logic
 * Cart, Wishlist, Social Links, Orders and Notifications
 */

// ==========================================
// SHOPPING CART
// ==========================================

const CartState = {
  getCart() {
    try {
      return JSON.parse(localStorage.getItem('ayur_cart')) || [];
    } catch (error) {
      return [];
    }
  },

  saveCart(cart) {
    localStorage.setItem('ayur_cart', JSON.stringify(cart));
    this.updateCounters();
  },

  addItem(productId, quantity = 1) {
    const product = AYUR_PRODUCTS.find(p => p.id === productId);

    if (!product) return false;

    if (product.inStock === false) {
      showToast('This product is currently unavailable.', 'error');
      return false;
    }

    const cart = this.getCart();
    const index = cart.findIndex(item => item.id === productId);

    if (index > -1) {
      cart[index].quantity += quantity;
    } else {
      cart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        originalPrice: product.originalPrice,
        image: product.image,
        category: product.category,
        netWeight: product.netWeight,
        quantity
      });
    }

    this.saveCart(cart);
    showToast(`Added "${product.name}" to your cart!`, 'success');

    return true;
  },

  updateQuantity(productId, newQty) {
    const cart = this.getCart();
    const index = cart.findIndex(item => item.id === productId);

    if (index > -1) {
      if (newQty <= 0) {
        cart.splice(index, 1);
        showToast('Item removed from cart.', 'info');
      } else {
        cart[index].quantity = newQty;
      }

      this.saveCart(cart);
    }
  },

  removeItem(productId) {
    const cart = this.getCart().filter(item => item.id !== productId);
    this.saveCart(cart);
    showToast('Product removed from cart.', 'info');
  },

  clearCart() {
    localStorage.removeItem('ayur_cart');
    localStorage.removeItem('ayur_applied_coupon');
    this.updateCounters();
  },

  getTotals() {
    const cart = this.getCart();

    const subtotal = cart.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    const shipping =
      subtotal >= SHOP_CONFIG.freeShippingThreshold || subtotal === 0
        ? 0
        : SHOP_CONFIG.shippingFee;

    const tax = Math.round(subtotal * SHOP_CONFIG.taxRate);
    const coupon = this.getAppliedCoupon();

    let discount = 0;

    if (coupon) {
      if (coupon.type === 'percent') {
        discount = Math.round(subtotal * coupon.value / 100);
      } else if (coupon.type === 'flat') {
        discount = Math.min(coupon.value, subtotal);
      }
    }

    const grandTotal = Math.max(
      0,
      subtotal + shipping + tax - discount
    );

    return {
      subtotal,
      shipping,
      tax,
      discount,
      grandTotal,
      coupon,
      itemCount: cart.reduce((count, item) => count + item.quantity, 0)
    };
  },

  applyCoupon(code) {
    const cleanCode = (code || '').trim().toUpperCase();

    const validCoupons = {
      AYUR10: {
        code: 'AYUR10',
        type: 'percent',
        value: 10,
        label: '10% Off Ayurvedic Order'
      },
      VEDA150: {
        code: 'VEDA150',
        type: 'flat',
        value: 150,
        label: '₹150 Flat Discount'
      },
      FIRSTHERB: {
        code: 'FIRSTHERB',
        type: 'percent',
        value: 15,
        label: '15% First-time Customer Special'
      }
    };

    if (validCoupons[cleanCode]) {
      localStorage.setItem(
        'ayur_applied_coupon',
        JSON.stringify(validCoupons[cleanCode])
      );

      showToast(`Coupon "${cleanCode}" applied successfully!`, 'success');

      return {
        success: true,
        coupon: validCoupons[cleanCode]
      };
    }

    showToast('Invalid coupon code.', 'error');

    return {
      success: false,
      message: 'Invalid coupon code'
    };
  },

  getAppliedCoupon() {
    try {
      return JSON.parse(
        localStorage.getItem('ayur_applied_coupon')
      ) || null;
    } catch (error) {
      return null;
    }
  },

  removeCoupon() {
    localStorage.removeItem('ayur_applied_coupon');
    showToast('Coupon removed.', 'info');
  },

  updateCounters() {
    const cart = this.getCart();

    const count = cart.reduce(
      (total, item) => total + item.quantity,
      0
    );

    document.querySelectorAll('.cart-count-badge').forEach(element => {
      element.textContent = count;
      element.style.display = count > 0 ? 'inline-block' : 'none';
    });

    const wishlist = WishlistState.getWishlist();

    document.querySelectorAll('.wishlist-count-badge').forEach(element => {
      element.textContent = wishlist.length;
      element.style.display = wishlist.length > 0
        ? 'inline-block'
        : 'none';
    });
  }
};


// ==========================================
// WISHLIST
// ==========================================

const WishlistState = {
  getWishlist() {
    try {
      return JSON.parse(localStorage.getItem('ayur_wishlist')) || [];
    } catch (error) {
      return [];
    }
  },

  toggle(productId) {
    const wishlist = this.getWishlist();
    const index = wishlist.indexOf(productId);
    const product = AYUR_PRODUCTS.find(p => p.id === productId);

    if (index > -1) {
      wishlist.splice(index, 1);
      showToast('Removed from your wishlist.', 'info');
    } else {
      wishlist.push(productId);
      showToast(
        `Saved "${product ? product.name : 'Item'}" to your wishlist!`,
        'success'
      );
    }

    localStorage.setItem('ayur_wishlist', JSON.stringify(wishlist));
    CartState.updateCounters();

    return index === -1;
  },

  isInWishlist(productId) {
    return this.getWishlist().includes(productId);
  }
};


// ==========================================
// SOCIAL AND PHONE UTILITIES
// ==========================================

const SocialCommerce = {
  getInstagramUrl(productName = null) {
    if (productName) {
      return `https://instagram.com/${SHOP_CONFIG.instagramHandle}?ref=${encodeURIComponent(productName)}`;
    }

    return SHOP_CONFIG.instagramUrl;
  },

  getPhoneCallUrl() {
    return `tel:${SHOP_CONFIG.phoneClean}`;
  }
};


// ==========================================
// ORDER SERVICE
// ==========================================

const OrderService = {
  getOrders() {
    try {
      return JSON.parse(localStorage.getItem('ayur_orders')) || [];
    } catch (error) {
      return [];
    }
  },

  getOrderById(orderId) {
    return this.getOrders().find(
      order => order.orderId === orderId
    ) || null;
  },

  createOrder(checkoutData) {
    const cart = CartState.getCart();

    if (cart.length === 0) return null;

    const totals = CartState.getTotals();

    const orderId =
      'KEVA-' +
      new Date().getFullYear() +
      '-' +
      Math.floor(1000 + Math.random() * 9000);

    const newOrder = {
      orderId,

      createdAt: new Date().toISOString(),

      displayDate: new Date().toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),

      status: 'Placed',

      customer: {
        name: checkoutData.fullName,
        email: checkoutData.email,
        phone: checkoutData.phone,
        address: checkoutData.address,
        city: checkoutData.city,
        state: checkoutData.state,
        pincode: checkoutData.pincode,
        orderNotes: checkoutData.notes || ''
      },

      items: cart,
      financials: totals,
      paymentMethod: checkoutData.paymentMethod,

      emailNotifications: {
        customerNotified: false,
        shopNotified: false,
        confirmationSentAt: null
      }
    };

    const orders = this.getOrders();
    orders.unshift(newOrder);

    localStorage.setItem('ayur_orders', JSON.stringify(orders));

    CartState.clearCart();

    return newOrder;
  },

  updateOrderStatus(orderId, newStatus) {
    const orders = this.getOrders();

    const index = orders.findIndex(
      order => order.orderId === orderId
    );

    if (index > -1) {
      orders[index].status = newStatus;
      orders[index].lastUpdated = new Date().toISOString();

      localStorage.setItem('ayur_orders', JSON.stringify(orders));

      return true;
    }

    return false;
  },

  generateEmailHtml(order) {
    const itemsList = order.items.map(item => `
      <tr>
        <td style="padding:10px;border-bottom:1px solid #e2e8f0;">
          <strong>${item.name}</strong><br>
          <small style="color:#64748b;">${item.netWeight || ''}</small>
        </td>
        <td style="padding:10px;text-align:center;border-bottom:1px solid #e2e8f0;">
          ${item.quantity}
        </td>
        <td style="padding:10px;text-align:right;border-bottom:1px solid #e2e8f0;">
          ₹${item.price}
        </td>
        <td style="padding:10px;text-align:right;border-bottom:1px solid #e2e8f0;font-weight:600;">
          ₹${item.quantity * item.price}
        </td>
      </tr>
    `).join('');

    return `
      <div style="font-family:Segoe UI,Tahoma,sans-serif;max-width:650px;margin:0 auto;background:#fff;border:1px solid #d4af37;border-radius:8px;overflow:hidden;">

        <div style="background:linear-gradient(135deg,#1b4332,#2d6a4f);color:#fff;padding:25px 20px;text-align:center;">
          <h1 style="margin:0;font-size:24px;color:#d4af37;">KEVA KAIPO</h1>
          <p style="margin:5px 0 0;font-size:14px;">SRI MAHALAKSHMI &amp; CO.</p>
        </div>

        <div style="background:#e8f5e9;border-left:4px solid #2d6a4f;padding:15px 20px;margin:20px;">
          <h3 style="margin:0 0 5px;color:#1b4332;font-size:16px;">
            Hello ${order.customer.name}, your order has been placed.
          </h3>
          <p style="margin:0;font-size:13px;color:#374151;">
            Your order number is <strong>${order.orderId}</strong>.
          </p>
        </div>

        <div style="padding:0 20px 15px;font-size:13px;color:#475569;">
          <strong>Order ID:</strong> ${order.orderId}<br>
          <strong>Date:</strong> ${order.displayDate}<br>
          <strong>Payment:</strong> ${order.paymentMethod}
        </div>

        <div style="padding:0 20px;">
          <table style="width:100%;border-collapse:collapse;font-size:14px;">
            <thead>
              <tr style="background:#f8fafc;color:#334155;text-align:left;font-size:12px;">
                <th style="padding:10px;">Item</th>
                <th style="padding:10px;text-align:center;">Qty</th>
                <th style="padding:10px;text-align:right;">Unit Price</th>
                <th style="padding:10px;text-align:right;">Total</th>
              </tr>
            </thead>
            <tbody>${itemsList}</tbody>
            <tfoot>
              <tr>
                <td colspan="3" style="padding:8px 10px;text-align:right;">Subtotal:</td>
                <td style="padding:8px 10px;text-align:right;">₹${order.financials.subtotal}</td>
              </tr>

              ${order.financials.discount > 0 ? `
                <tr>
                  <td colspan="3" style="padding:8px 10px;text-align:right;color:#16a34a;">Discount:</td>
                  <td style="padding:8px 10px;text-align:right;color:#16a34a;">-₹${order.financials.discount}</td>
                </tr>
              ` : ''}

              <tr>
                <td colspan="3" style="padding:8px 10px;text-align:right;">Tax:</td>
                <td style="padding:8px 10px;text-align:right;">₹${order.financials.tax}</td>
              </tr>

              <tr>
                <td colspan="3" style="padding:8px 10px;text-align:right;">Shipping:</td>
                <td style="padding:8px 10px;text-align:right;">
                  ${order.financials.shipping === 0 ? 'FREE' : '₹' + order.financials.shipping}
                </td>
              </tr>

              <tr style="font-size:16px;font-weight:bold;background:#fdfaf3;color:#1b4332;">
                <td colspan="3" style="padding:12px 10px;text-align:right;">Grand Total:</td>
                <td style="padding:12px 10px;text-align:right;">₹${order.financials.grandTotal}</td>
              </tr>
            </tfoot>
          </table>
        </div>

        <div style="margin:20px;padding:15px;background:#f8fafc;border-radius:6px;font-size:13px;color:#334155;">
          <h4 style="margin:0 0 8px;color:#1b4332;">Delivery Details</h4>
          <p><strong>Recipient:</strong> ${order.customer.name}</p>
          <p><strong>Address:</strong> ${order.customer.address}, ${order.customer.city}, ${order.customer.state} - ${order.customer.pincode}</p>
          <p><strong>Phone:</strong> ${order.customer.phone}</p>
          <p><strong>Email:</strong> ${order.customer.email}</p>
          ${order.customer.orderNotes ? `<p><strong>Order Notes:</strong> ${order.customer.orderNotes}</p>` : ''}
        </div>

        <div style="background:#f1f5f9;padding:20px;text-align:center;font-size:12px;color:#64748b;border-top:1px solid #e2e8f0;">
          <p><strong>KEVA KAIPO — SRI MAHALAKSHMI &amp; CO.</strong></p>
          <p>Phone: ${SHOP_CONFIG.phone}</p>
          <p>Email: ${SHOP_CONFIG.email}</p>
          <p>${SHOP_CONFIG.address}</p>
        </div>

      </div>
    `;
  }
};


// ==========================================
// TOAST NOTIFICATIONS
// ==========================================

function showToast(message, type = 'info') {

  // Do not show application notifications during automated testing.
  if (window.__KEVA_TEST_MODE === true) {
    return;
  }

  let toastContainer = document.getElementById('toast-container');

  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.id = 'toast-container';

    toastContainer.style.cssText = `
      position: fixed;
      bottom: 24px;
      right: 24px;
      z-index: 999999;
      display: flex;
      flex-direction: column;
      gap: 10px;
      pointer-events: none;
    `;

    document.body.appendChild(toastContainer);
  }

  const toast = document.createElement('div');

  const bgColors = {
    success: '#1b4332',
    error: '#991b1b',
    info: '#1e293b'
  };

  toast.style.cssText = `
    background: ${bgColors[type] || '#1e293b'};
    color: #ffffff;
    padding: 12px 20px;
    border-radius: 8px;
    box-shadow: 0 10px 25px rgba(0,0,0,0.2);
    font-size: 14px;
    font-weight: 500;
    display: flex;
    align-items: center;
    gap: 10px;
    border-left: 4px solid #d4af37;
    animation: toastSlideIn 0.3s ease forwards;
    pointer-events: auto;
    max-width: 350px;
  `;

  const messageElement = document.createElement('span');
  messageElement.textContent = message;

  toast.appendChild(messageElement);
  toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    toast.style.transition = 'all 0.3s ease';

    setTimeout(() => toast.remove(), 300);
  }, 3500);
}


// ==========================================
// REFRESH CART AND WISHLIST COUNTERS
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
  CartState.updateCounters();
});
