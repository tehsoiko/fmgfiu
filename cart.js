// CARRELLO E-COMMERCE

const Cart = {
    items: [],
    
    init() {
        const saved = localStorage.getItem('cart');
        if (saved) this.items = JSON.parse(saved);
        this.updateUI();
    },
    
    save() {
        localStorage.setItem('cart', JSON.stringify(this.items));
        this.updateUI();
    },
    
    add(productId, qty = 1) {
        const prodotto = CONFIG.prodotti.find(p => p.id === productId);
        if (!prodotto) return;
        
        const existing = this.items.find(i => i.id === productId);
        if (existing) {
            existing.qty += qty;
        } else {
            this.items.push({
                id: productId,
                nome: prodotto.nome,
                prezzo: prodotto.prezzo,
                immagine: prodotto.immagine,
                qty: qty
            });
        }
        this.save();
        this.showNotification(`${prodotto.nome} aggiunto al carrello`);
    },
    
    remove(productId) {
        this.items = this.items.filter(i => i.id !== productId);
        this.save();
    },
    
    updateQty(productId, qty) {
        const item = this.items.find(i => i.id === productId);
        if (item) {
            if (qty <= 0) this.remove(productId);
            else item.qty = qty;
            this.save();
        }
    },
    
    clear() {
        this.items = [];
        this.save();
    },
    
    total() {
        return this.items.reduce((sum, i) => sum + (i.prezzo * i.qty), 0);
    },
    
    count() {
        return this.items.reduce((sum, i) => sum + i.qty, 0);
    },
    
    shipping() {
        const total = this.total();
        if (total === 0) return 0;
        return total >= CONFIG.negozio.spedizioneGratuitaSopra ? 0 : CONFIG.negozio.costoSpedizione;
    },
    
    grandTotal() {
        return this.total() + this.shipping();
    },
    
    updateUI() {
        const countEl = document.getElementById('cartCount');
        const totalEl = document.getElementById('cartTotal');
        const badge = document.getElementById('cartBadge');
        const count = this.count();
        
        if (countEl) countEl.textContent = count;
        if (totalEl) totalEl.textContent = this.formatPrice(this.total());
        if (badge) badge.setAttribute('data-count', count);
    },
    
    formatPrice(price) {
        return CONFIG.negozio.simboloValuta + ' ' + price.toFixed(2).replace('.', ',');
    },
    
    showNotification(msg) {
        const notif = document.createElement('div');
        notif.className = 'cart-notification';
        notif.textContent = msg;
        document.body.appendChild(notif);
        setTimeout(() => notif.classList.add('show'), 10);
        setTimeout(() => {
            notif.classList.remove('show');
            setTimeout(() => notif.remove(), 300);
        }, 2000);
    },
    
    render(container) {
        if (!container) return;
        
        if (this.items.length === 0) {
            container.innerHTML = `
                <div class="empty-cart">
                    <svg viewBox="0 0 24 24" width="64" height="64" stroke="var(--muted)" fill="none" stroke-width="1.5">
                        <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
                        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
                    </svg>
                    <h3>Il carrello è vuoto</h3>
                    <p>Aggiungi qualche libro dal <a href="catalogo.html">catalogo</a></p>
                </div>
            `;
            return;
        }
        
        let html = '<div class="cart-items">';
        this.items.forEach(item => {
            html += `
                <div class="cart-item">
                    <div class="cart-item-img">
                        ${item.immagine 
                            ? `<img src="${item.immagine}" alt="${item.nome}">`
                            : `<div class="cart-item-placeholder"><svg viewBox="0 0 24 24" width="40" height="40" stroke="currentColor" fill="none" stroke-width="1.5"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg></div>`
                        }
                    </div>
                    <div class="cart-item-info">
                        <h4>${item.nome}</h4>
                        <p class="cart-item-price">${this.formatPrice(item.prezzo)}</p>
                    </div>
                    <div class="cart-item-qty">
                        <button onclick="Cart.updateQty('${item.id}', ${item.qty - 1})">−</button>
                        <span>${item.qty}</span>
                        <button onclick="Cart.updateQty('${item.id}', ${item.qty + 1})">+</button>
                    </div>
                    <div class="cart-item-total">${this.formatPrice(item.prezzo * item.qty)}</div>
                    <button class="cart-item-remove" onclick="Cart.remove('${item.id}')">
                        <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" fill="none" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                    </button>
                </div>
            `;
        });
        html += '</div>';
        
        const shipping = this.shipping();
        html += `
            <div class="cart-summary">
                <div class="cart-row">
                    <span>Subtotale</span>
                    <span>${this.formatPrice(this.total())}</span>
                </div>
                <div class="cart-row">
                    <span>Spedizione</span>
                    <span>${shipping === 0 ? '<strong style="color:var(--success)">Gratuita</strong>' : this.formatPrice(shipping)}</span>
                </div>
                ${shipping > 0 ? `<p class="cart-shipping-note">Spedizione gratuita sopra ${this.formatPrice(CONFIG.negozio.spedizioneGratuitaSopra)}</p>` : ''}
                <div class="cart-row cart-total">
                    <span>Totale</span>
                    <span>${this.formatPrice(this.grandTotal())}</span>
                </div>
            </div>
            <div class="cart-actions">
                <a href="catalogo.html" class="btn btn-outline">Continua acquisti</a>
                <button class="btn" onclick="Cart.checkout()">Procedi all'ordine</button>
            </div>
        `;
        
        container.innerHTML = html;
    },
    
    checkout() {
        // Se tutti i prodotti hanno checkoutUrl, reindirizza
        // Altrimenti manda email con ordine
        const hasAllLinks = this.items.every(item => {
            const prodotto = CONFIG.prodotti.find(p => p.id === item.id);
            return prodotto && prodotto.checkoutUrl;
        });
        
        if (hasAllLinks && this.items.length === 1) {
            // Singolo prodotto con link
            const prodotto = CONFIG.prodotti.find(p => p.id === this.items[0].id);
            window.location.href = prodotto.checkoutUrl;
            return;
        }
        
        // Multi-prodotto o senza link: ordine via email
        const ordine = this.items.map(i => `${i.qty}x ${i.nome} - ${this.formatPrice(i.prezzo * i.qty)}`).join('\n');
        const subject = encodeURIComponent(`Ordine dal sito - ${this.count()} libri`);
        const body = encodeURIComponent(
            `Nuovo ordine:\n\n${ordine}\n\n` +
            `Subtotale: ${this.formatPrice(this.total())}\n` +
            `Spedizione: ${this.shipping() === 0 ? 'Gratuita' : this.formatPrice(this.shipping())}\n` +
            `TOTALE: ${this.formatPrice(this.grandTotal())}\n\n` +
            `Dati cliente:\nNome: \nEmail: \nTelefono: \nIndirizzo: `
        );
        
        window.location.href = `mailto:${CONFIG.sito.email}?subject=${subject}&body=${body}`;
    }
};

// Contatore visite reale
const VisitCounter = {
    namespace: 'libridimpresa-visite',
    
    async init() {
        try {
            const res = await fetch(`https://api.countapi.xyz/hit/${this.namespace}/visits`);
            const data = await res.json();
            const totalEl = document.getElementById('totalVisits');
            if (totalEl && data.value) {
                totalEl.textContent = data.value.toLocaleString('it-IT');
            }
        } catch (e) {
            console.log('Contatore non disponibile');
        }
        
        // Online simulato (nessun servizio gratuito affidabile per questo)
        const onlineEl = document.getElementById('onlineNow');
        if (onlineEl) {
            onlineEl.textContent = Math.floor(Math.random() * 8) + 2;
        }
    }
};

// Inizializza
document.addEventListener('DOMContentLoaded', () => {
    Cart.init();
    VisitCounter.init();
});
