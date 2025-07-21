/* eslint-disable */
(($) => {
    'use strict';

    const classes = {
        style: 'ecommerce-style',
        wrapper: 'ecommerce-wrapper',
        container: 'ecommerce-container',
        header: 'ecommerce-header',
        searchBox: 'search-box',
        carousel: 'product-carousel',
        productList: 'product-list',
        productCard: 'product-card',
        addToCartButton: 'add-to-cart-btn',
        cartSection: 'cart-section',
        cartItem: 'cart-item',
        clearCartBtn: 'clear-cart-btn',
        modal: 'product-modal',
        modalOverlay: 'modal-overlay',
        modalContent: 'modal-content',
        closeModal: 'close-modal',
        cartCount: 'cart-count',
        cartToggle: 'cart-toggle',
        heroCarousel: 'hero-carousel',
        favoriteBtn: 'favorite-btn',
        favoritesSection: 'favorites-section',
        favoriteItem: 'favorite-item',
        favoritesToggle: 'favorites-toggle',
        favoritesCount: 'favorites-count'
    };

    const selectors = {
        style: `.${classes.style}`,
        wrapper: `.${classes.wrapper}`,
        container: `.${classes.container}`,
        header: `.${classes.header}`,
        searchBox: `.${classes.searchBox}`,
        carousel: `.${classes.carousel}`,
        productList: `.${classes.productList}`,
        productCard: `.${classes.productCard}`,
        addToCartButton: `.${classes.addToCartButton}`,
        cartSection: `.${classes.cartSection}`,
        cartItem: `.${classes.cartItem}`,
        clearCartBtn: `.${classes.clearCartBtn}`,
        modal: `.${classes.modal}`,
        modalOverlay: `.${classes.modalOverlay}`,
        modalContent: `.${classes.modalContent}`,
        closeModal: `.${classes.closeModal}`,
        cartCount: `.${classes.cartCount}`,
        cartToggle: `.${classes.cartToggle}`,
        heroCarousel: `.${classes.heroCarousel}`,
        favoriteBtn: `.${classes.favoriteBtn}`,
        favoritesSection: `.${classes.favoritesSection}`,
        favoriteItem: `.${classes.favoriteItem}`,
        favoritesToggle: `.${classes.favoritesToggle}`,
        favoritesCount: `.${classes.favoritesCount}`,
        appendLocation: '#container'
    };

    const self = {};

    // Data storage
    self.products = [];
    self.cart = [];
    self.favorites = [];
    self.searchTimeout = null;
    self.currentCategory = 'all';
    self.categories = [];
    self.heroSlideIndex = 0;

    self.init = () => {
        self.reset();
        self.loadCartFromStorage();
        self.loadFavoritesFromStorage();
        self.buildCSS();
        self.buildHTML();
        self.loadProducts();
        self.setEvents();
        self.initHeroCarousel();
    };

    self.reset = () => {
        $(selectors.style).remove();
        $(selectors.wrapper).remove();
        $(document).off('.ecommerce');
        clearInterval(self.heroInterval);
    };

    self.buildCSS = () => {
        const customStyle = `
            <style class="${classes.style}">
                * {
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                }
                
                ${selectors.wrapper} {
                    font-family: 'Arial', sans-serif;
                    min-height: 100vh;
    background: linear-gradient(135deg, #f0f4f8 0%, #ffffff 100%);
                    padding: 20px;
                }
                
                ${selectors.container} {
                    max-width: 1200px;
                    margin: 0 auto;
                    background: white;
                    border-radius: 15px;
                    box-shadow: 0 20px 40px rgba(0,0,0,0.1);
                    overflow: hidden;
                }
                
                ${selectors.header} {
                    background: linear-gradient(45deg, #e425a1ff, #3498db);
                    color: white;
                    padding: 20px 30px;
                    text-align: center;
                    position: relative;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    flex-wrap: wrap;
                }
                
                .header-left {
                    flex: 1;
                }
                
                .header-center {
                    flex: 2;
                    text-align: center;
                }
                
                .header-right {
                    flex: 1;
                    display: flex;
                    justify-content: flex-end;
                    gap: 15px;
                }
                
                ${selectors.header} h1 {
                    font-size: 2.2em;
                    margin-bottom: 10px;
                    text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
                }
                
                ${selectors.header} p {
                    margin-bottom: 15px;
                    opacity: 0.9;
                }
                
                ${selectors.searchBox} {
                    width: 100%;
                    max-width: 400px;
                    padding: 12px 20px;
                    border: none;
                    border-radius: 25px;
                    font-size: 16px;
                    margin: 10px auto;
                    display: block;
                    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
                    transition: all 0.3s ease;
                    background: #e2dfd6ff;
                }
                
                ${selectors.searchBox}:focus {
                    outline: none;
                    transform: scale(1.05);
                    box-shadow: 0 6px 12px rgba(0,0,0,0.2);
                }
                
                ${selectors.cartToggle} {
                    background: #e74c3c;
                    color: white;
                    border: none;
                    padding: 12px 20px;
                    border-radius: 25px;
                    cursor: pointer;
                    font-size: 14px;
                    font-weight: bold;
                    transition: all 0.3s ease;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }
                    ${selectors.searchBox}::placeholder {
    color: #666;
}
                
                ${selectors.cartToggle}:hover {
                    background: #c0392b;
                    transform: translateY(-2px);
                    box-shadow: 0 4px 8px rgba(0,0,0,0.2);
                }
                

                
                ${selectors.favoritesToggle} {
                    background: #8a475dff;
                    color: white;
                    border: none;
                    padding: 12px 20px;
                    border-radius: 25px;
                    cursor: pointer;
                    font-size: 14px;
                    font-weight: bold;
                    transition: all 0.3s ease;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }
                
                ${selectors.favoritesToggle}:hover {
                    background: #ad1457;
                    transform: translateY(-2px);
                    box-shadow: 0 4px 8px rgba(0,0,0,0.2);
                }
                
                ${selectors.cartCount}, ${selectors.favoritesCount} {
                    background: white;
                    color: #e74c3c;
                    border-radius: 50%;
                    width: 25px;
                    height: 25px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 12px;
                    font-weight: bold;
                }
                
                ${selectors.favoritesCount} {
                    color: #e91e63;
                }
                
       ${selectors.heroCarousel} {
    position: relative;
    height: 400px;
    overflow: hidden;
    background: linear-gradient(135deg, #667eea 0%, #b490d8ff 100%);
    margin: 10px 30px;
    border-radius: 30px 30px 30px 30px;
    box-shadow: 0 15px 30px rgba(0,0,0,0.1);
}
                
                .hero-slides {
                    display: flex;
                    height: 100%;
                    transition: transform 0.8s ease-in-out;
                }
                
                .hero-slide {
                    min-width: 100%;
                    height: 100%;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 0 80px;
                    background-size: cover;
                    background-position: center;
                    position: relative;
                }
                
                .hero-slide::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0,0,0,0.4);
                    z-index: 1;
                }
                
                .hero-slide.slide-1 {
                    background: linear-gradient(45deg, #667eea, #764ba2), url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="pattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse"><circle cx="10" cy="10" r="2" fill="rgba(255,255,255,0.1)"/></pattern></defs><rect width="100" height="100" fill="url(%23pattern)"/></svg>');
                }
                
                .hero-slide.slide-2 {
                    background: linear-gradient(45deg, #f093fb, #f5576c), url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="pattern2" x="0" y="0" width="25" height="25" patternUnits="userSpaceOnUse"><polygon points="12.5,2 22,22 2,22" fill="rgba(255,255,255,0.1)"/></pattern></defs><rect width="100" height="100" fill="url(%23pattern2)"/></svg>');
                }
                
                .hero-slide.slide-3 {
                    background: linear-gradient(45deg, #4facfe, #00f2fe), url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="pattern3" x="0" y="0" width="30" height="30" patternUnits="userSpaceOnUse"><rect x="5" y="5" width="20" height="20" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="1"/></pattern></defs><rect width="100" height="100" fill="url(%23pattern3)"/></svg>');
                }
                
                .hero-content {
                    z-index: 2;
                    color: white;
                    max-width: 500px;
                }
                
                .hero-content h2 {
                    font-size: 3em;
                    margin-bottom: 20px;
                    text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
                    animation: slideInLeft 1s ease;
                }
                
                .hero-content p {
                    font-size: 1.3em;
                    margin-bottom: 30px;
                    opacity: 0.9;
                    animation: slideInLeft 1s ease 0.2s both;
                }
                
                .hero-cta {
                    background: rgba(255,255,255,0.2);
                    color: white;
                    border: 2px solid white;
                    padding: 15px 30px;
                    border-radius: 30px;
                    font-size: 1.1em;
                    font-weight: bold;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    animation: slideInLeft 1s ease 0.4s both;
                    backdrop-filter: blur(10px);
                }
                
                .hero-cta:hover {
                    background: white;
                    color: #333;
                    transform: translateY(-3px);
                    box-shadow: 0 10px 25px rgba(0,0,0,0.3);
                }
                
                .hero-image {
                    z-index: 2;
                    max-width: 400px;
                    max-height: 300px;
                    object-fit: contain;
                    filter: drop-shadow(0 10px 25px rgba(0,0,0,0.3));
                    animation: slideInRight 1s ease 0.3s both;
                }
                
                .hero-nav {
                    position: absolute;
                    bottom: 30px;
                    left: 50%;
                    transform: translateX(-50%);
                    display: flex;
                    gap: 10px;
                    z-index: 3;
                }
                
                .hero-dot {
                    width: 12px;
                    height: 12px;
                    border-radius: 50%;
                    background: rgba(255,255,255,0.5);
                    cursor: pointer;
                    transition: all 0.3s ease;
                }
                
                .hero-dot.active {
                    background: white;
                    transform: scale(1.3);
                }
                
                .hero-arrows {
                    position: absolute;
                    top: 50%;
                    transform: translateY(-50%);
                    width: 100%;
                    display: flex;
                    justify-content: space-between;
                    padding: 0 30px;
                    z-index: 3;
                }
                
                .hero-prev, .hero-next {
                    background: rgba(255,255,255,0.2);
                    border: 2px solid rgba(255,255,255,0.5);
                    color: white;
                    width: 50px;
                    height: 50px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 1.5em;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    backdrop-filter: blur(10px);
                }
                
                .hero-prev:hover, .hero-next:hover {
                    background: rgba(255,255,255,0.3);
                    border-color: white;
                    transform: scale(1.1);
                }
                
                @keyframes slideInLeft {
                    from { transform: translateX(-50px); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                
                @keyframes slideInRight {
                    from { transform: translateX(50px); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }

                .favorite-btn {
    position: absolute;
    top: 10px;
    right: 10px;
    background: white;
    border: 2px solid #e91e63;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #e91e63;
    font-size: 1.2em;
    cursor: pointer;
    transition: all 0.3s ease;
    z-index: 2;
}
    .product-card {
    position: relative;
}
            
${selectors.carousel} {
    background: linear-gradient(135deg, #bcc0d5ff 0%, #a98ac7ff 100%);
    padding: 50px 40px;
    text-align: center;
    position: relative;
    overflow: hidden;
    margin: 10px 30px;
    border-radius: 30px;
    box-shadow: 0 20px 40px rgba(0,0,0,0.15);
    border: 1px solid rgba(255,255,255,0.1);
}

@media (max-width: 768px) {
    ${selectors.carousel} {
        margin: 20px 20px;
        padding: 30px 20px;
        border-radius: 20px;
    }
}
                
                ${selectors.carousel} h2 {
                    color: white;
                    font-size: 2em;
                    margin-bottom: 30px;
                    text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
                }
                
                .carousel-content {
                    display: flex;
                    gap: 20px;
                    padding: 20px 0;
                    scroll-behavior: smooth;
                    overflow-x: auto;
                    scrollbar-width: none;
                    -ms-overflow-style: none;
                }
                
                .carousel-content::-webkit-scrollbar {
                    display: none;
                }
                
                .carousel-item {
                    min-width: 180px;
                    background: rgba(255, 255, 255, 0.95);
                    border-radius: 15px;
                    padding: 25px 20px;
                    text-align: center;
                    transition: all 0.3s ease;
                    cursor: pointer;
                    border: 3px solid transparent;
                    box-shadow: 0 8px 25px rgba(0,0,0,0.1);
                    backdrop-filter: blur(10px);
                    position: relative;
                    overflow: hidden;
                }
                
                .carousel-item::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: -100%;
                    width: 100%;
                    height: 100%;
                    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
                    transition: left 0.6s ease;
                }
                
                .carousel-item:hover::before {
                    left: 100%;
                }
                
                .carousel-item:hover {
                    transform: translateY(-10px) scale(1.05);
                    border-color: #3498db;
                    box-shadow: 0 15px 35px rgba(0,0,0,0.2);
                }
                
                .carousel-item.active {
                    background: linear-gradient(135deg, #3498db, #2980b9);
                    color: white;
                    transform: scale(1.1);
                    border-color: #fff;
                }
                
                .carousel-item.active .category-icon {
                    animation: bounce 1s ease infinite alternate;
                }
                
                @keyframes bounce {
                    from { transform: translateY(0); }
                    to { transform: translateY(-5px); }
                }
                
                .category-icon {
                    font-size: 2.5em;
                    margin-bottom: 15px;
                    display: block;
                    transition: transform 0.3s ease;
                }
                
                .carousel-item h3 {
                    font-size: 1.1em;
                    margin-bottom: 8px;
                    font-weight: bold;
                }
                
                .carousel-item p {
                    font-size: 0.9em;
                    opacity: 0.8;
                    margin: 0;
                }
                
                .carousel-navigation {
                    position: absolute;
                    top: 50%;
                    transform: translateY(-50%);
                    width: 100%;
                    display: flex;
                    justify-content: space-between;
                    padding: 0 20px;
                    pointer-events: none;
                }
                
                .carousel-prev,
                .carousel-next {
                    background: rgba(255, 255, 255, 0.9);
                    border: none;
                    width: 45px;
                    height: 45px;
                    border-radius: 50%;
                    font-size: 1.5em;
                    font-weight: bold;
                    color: #2980b9;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    pointer-events: all;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                
                .carousel-prev:hover,
                .carousel-next:hover {
                    background: white;
                    transform: scale(1.1);
                    box-shadow: 0 6px 20px rgba(0,0,0,0.25);
                }
                
                ${selectors.productList} {
                    padding: 30px;
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
                    gap: 25px;
                }
                
                ${selectors.productCard} {
                    background: white;
                    border-radius: 15px;
                    box-shadow: 0 8px 25px rgba(0,0,0,0.1);
                    overflow: hidden;
                    transition: all 0.3s ease;
                    opacity: 0;
                    transform: translateY(20px);
                }
                
                ${selectors.productCard}.loaded {
                    opacity: 1;
                    transform: translateY(0);
                }
                
                ${selectors.productCard}:hover {
                    transform: translateY(-10px);
                    box-shadow: 0 15px 35px rgba(0,0,0,0.2);
                }
                
                .product-image {
                    width: 100%;
                    height: 250px;
                    object-fit: contain;
                    background: #f8f9fa;
                    padding: 20px;
                    cursor: pointer;
                    transition: transform 0.3s ease;
                }
                
                .product-image:hover {
                    transform: scale(1.05);
                }
                
                .product-info {
                    padding: 20px;
                }
                
                .product-title {
                    font-size: 1.1em;
                    font-weight: bold;
                    margin-bottom: 10px;
                    color: #2c3e50;
                    height: 50px;
                    overflow: hidden;
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                }
                
                .product-price {
                    font-size: 1.5em;
                    color: #e74c3c;
                    font-weight: bold;
                    margin-bottom: 15px;
                }
                
                .product-category {
                    background: #3498db;
                    color: white;
                    padding: 5px 10px;
                    border-radius: 15px;
                    font-size: 0.8em;
                    display: inline-block;
                    margin-bottom: 15px;
                }
                
                .product-actions {
                    display: flex;
                    gap: 10px;
                    align-items: center;
                }
                
                ${selectors.addToCartButton} {
                    flex: 1;
                    padding: 12px;
                    background: linear-gradient(45deg, #27ae60, #2ecc71);
                    color: white;
                    border: none;
                    border-radius: 8px;
                    cursor: pointer;
                    font-weight: bold;
                    transition: all 0.3s ease;
                }
                
                ${selectors.addToCartButton}:hover {
                    background: linear-gradient(45deg, #229954, #27ae60);
                    transform: translateY(-2px);
                    box-shadow: 0 4px 8px rgba(0,0,0,0.2);
                }
                
                ${selectors.favoriteBtn} {
                    width: 45px;
                    height: 45px;
                    background: white;
                    border: 2px solid #e91e63;
                    border-radius: 8px;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 1.2em;
                    transition: all 0.3s ease;
                    color: #e91e63;
                }
                
                ${selectors.favoriteBtn}:hover {
                    background: #e91e63;
                    color: white;
                    transform: translateY(-2px);
                }
                
                ${selectors.favoriteBtn}.active {
                    background: #e91e63;
                    color: white;
                    animation: heartbeat 0.6s ease;
                }
                
                @keyframes heartbeat {
                    0%, 100% { transform: scale(1); }
                    50% { transform: scale(1.2); }
                }
                
                .detail-btn {
                    padding: 12px 20px;
                    background: linear-gradient(45deg, #3498db, #5dade2);
                    color: white;
                    border: none;
                    border-radius: 8px;
                    cursor: pointer;
                    font-weight: bold;
                    transition: all 0.3s ease;
                }
                
                .detail-btn:hover {
                    background: linear-gradient(45deg, #2980b9, #3498db);
                    transform: translateY(-2px);
                }
                
                ${selectors.cartSection} {
                    position: fixed;
                    top: 0;
                    right: -400px;
                    width: 400px;
                    height: 100vh;
                    background: white;
                    box-shadow: -5px 0 15px rgba(0,0,0,0.2);
                    transition: right 0.3s ease;
                    z-index: 1000;
                    overflow-y: auto;
                }
                
                ${selectors.cartSection}.open {
                    right: 0;
                }
                
                ${selectors.favoritesSection} {
                    position: fixed;
                    top: 0;
                    left: -400px;
                    width: 400px;
                    height: 100vh;
                    background: white;
                    box-shadow: 5px 0 15px rgba(0,0,0,0.2);
                    transition: left 0.3s ease;
                    z-index: 1000;
                    overflow-y: auto;
                }
                
                ${selectors.favoritesSection}.open {
                    left: 0;
                }
                
                .cart-header, .favorites-header {
                    background: #2c3e50;
                    color: white;
                    padding: 20px;
                    text-align: center;
                    position: sticky;
                    top: 0;
                    z-index: 10;
                }
                
                .favorites-header {
                    background: #e91e63;
                }
                
                .cart-items, .favorites-items {
                    padding: 20px;
                }
                
                ${selectors.cartItem}, ${selectors.favoriteItem} {
                    display: flex;
                    align-items: center;
                    gap: 15px;
                    padding: 15px;
                    border-bottom: 1px solid #eee;
                    animation: slideInRight 0.3s ease;
                }
                
                ${selectors.favoriteItem} {
                    animation: slideInLeft 0.3s ease;
                }
                
                @keyframes slideInLeft {
                    from { transform: translateX(-100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                
                @keyframes slideInRight {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                
                .cart-item-image {
                    width: 60px;
                    height: 60px;
                    object-fit: contain;
                    border-radius: 8px;
                }
                
                .favorite-item-image {
                    width: 60px;
                    height: 60px;
                    object-fit: contain;
                    border-radius: 8px;
                }
                
                .cart-item-info, .favorite-item-info {
                    flex: 1;
                }
                
                .cart-item-title, .favorite-item-title {
                    font-size: 0.9em;
                    margin-bottom: 5px;
                    color: #2c3e50;
                }
                
                .cart-item-price, .favorite-item-price {
                    color: #e74c3c;
                    font-weight: bold;
                }
                
                .remove-item, .remove-favorite {
                    background: #e74c3c;
                    color: white;
                    border: none;
                    padding: 5px 10px;
                    border-radius: 5px;
                    cursor: pointer;
                    transition: background 0.3s ease;
                }
                
                .remove-item:hover, .remove-favorite:hover {
                    background: #c0392b;
                }
                
                .add-to-cart-from-favorites {
                    background: #27ae60;
                    color: white;
                    border: none;
                    padding: 5px 10px;
                    border-radius: 5px;
                    cursor: pointer;
                    transition: background 0.3s ease;
                    margin-right: 5px;
                    font-size: 0.8em;
                }
                
                .add-to-cart-from-favorites:hover {
                    background: #229954;
                }
                
                ${selectors.clearCartBtn} {
                    width: 100%;
                    padding: 15px;
                    background: #e74c3c;
                    color: white;
                    border: none;
                    border-radius: 8px;
                    cursor: pointer;
                    font-weight: bold;
                    margin-top: 20px;
                    transition: all 0.3s ease;
                }
                
                ${selectors.clearCartBtn}:hover {
                    background: #c0392b;
                    transform: translateY(-2px);
                }
                
                .clear-favorites-btn {
                    width: 100%;
                    padding: 15px;
                    background: #e91e63;
                    color: white;
                    border: none;
                    border-radius: 8px;
                    cursor: pointer;
                    font-weight: bold;
                    margin-top: 20px;
                    transition: all 0.3s ease;
                }
                
                .clear-favorites-btn:hover {
                    background: #ad1457;
                    transform: translateY(-2px);
                }
                
                .side-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100vw;
                    height: 100vh;
                    background: rgba(0,0,0,0.5);
                    display: none;
                    z-index: 999;
                }
                
                .side-overlay.open {
                    display: block;
                }
                
                ${selectors.modalOverlay} {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100vw;
                    height: 100vh;
                    background: rgba(0,0,0,0.8);
                    display: none;
                    justify-content: center;
                    align-items: center;
                    z-index: 2000;
                    animation: fadeIn 0.3s ease;
                }
                
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                
                ${selectors.modalContent} {
                    background: white;
                    border-radius: 15px;
                    max-width: 600px;
                    max-height: 80vh;
                    overflow-y: auto;
                    position: relative;
                    animation: slideInUp 0.3s ease;
                }
                
                @keyframes slideInUp {
                    from { transform: translateY(50px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
                
                ${selectors.closeModal} {
                    position: absolute;
                    top: 15px;
                    right: 15px;
                    background: #e74c3c;
                    color: white;
                    border: none;
                    width: 30px;
                    height: 30px;
                    border-radius: 50%;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: bold;
                }
                
                .modal-image {
                    width: 100%;
                    height: 300px;
                    object-fit: contain;
                    background: #f8f9fa;
                    padding: 20px;
                }
                
                .modal-info {
                    padding: 30px;
                }
                
                .modal-title {
                    font-size: 1.5em;
                    color: #2c3e50;
                    margin-bottom: 15px;
                }
                
                .modal-description {
                    color: #7f8c8d;
                    line-height: 1.6;
                    margin-bottom: 20px;
                }
                
                .modal-price {
                    font-size: 2em;
                    color: #e74c3c;
                    font-weight: bold;
                    margin-bottom: 20px;
                }
                
                .loading {
                    text-align: center;
                    padding: 50px;
                    color: #7f8c8d;
                    font-size: 1.2em;
                }
                
                .loading::after {
                    content: '';
                    display: inline-block;
                    width: 20px;
                    height: 20px;
                    border: 3px solid #3498db;
                    border-radius: 50%;
                    border-top-color: transparent;
                    animation: spin 1s ease-in-out infinite;
                    margin-left: 10px;
                }
                
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
                
                @media (max-width: 768px) {
                    ${selectors.cartSection}, ${selectors.favoritesSection} {
                        width: 100%;
                        right: -100%;
                        left: -100%;
                    }

                    @media (max-width: 768px) {
    ${selectors.productList} {
        grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
        gap: 16px;
    }

    ${selectors.wrapper} {
        padding: 20px 10px;
    }

    ${selectors.header} h1 {
        font-size: 1.8em;
    }
}

                    
                    ${selectors.productList} {
                        grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
                        gap: 20px;
                    }
                    
                    ${selectors.header} {
                        flex-direction: column;
                        gap: 15px;
                        padding: 20px;
                    }
                    
                    .header-right {
                        justify-content: center;
                    }
                    
                    ${selectors.header} h1 {
                        font-size: 2em;
                    }
                    
                    ${selectors.heroCarousel} {
                        height: 300px;
                    }
                    
                    .hero-slide {
                        flex-direction: column;
                        padding: 20px;
                        text-align: center;
                    }
                    
                    .hero-content h2 {
                        font-size: 2em;
                    }
                    
                    .hero-image {
                        max-width: 250px;
                        max-height: 200px;
                    }
                }
            </style>
        `;
        $('head').append(customStyle);
    };

    self.buildHTML = () => {
        const html = `
            <div class="${classes.wrapper}">
                <div class="${classes.container}">
                    <header class="${classes.header}">
                        <div class="header-left"></div>
                        <div class="header-center">
                            <h1> AkgülShop</h1>
                            <p>En kaliteli ürünler, en uygun fiyatlarla</p>
                            <input type="text" class="${classes.searchBox}" placeholder="Ürün ara (ID ile)..." maxlength="10">
                        </div>
                        <div class="header-right">
                            <button class="${classes.favoritesToggle}">
                                Favoriler
                                <span class="${classes.favoritesCount}">0</span>
                            </button>
                            <button class="${classes.cartToggle}">
                             Sepet
                                <span class="${classes.cartCount}">0</span>
                            </button>
                        </div>
                    </header>
                    
                    <section class="${classes.heroCarousel}">
                        <div class="hero-slides">
                            <div class="hero-slide slide-1">
                                <div class="hero-content">
                                    <h2>🌟 Süper İndirimler</h2>
                                    <p>Seçili ürünlerde %50'ye varan indirimler! Kaçırılmayacak fırsatlar sizi bekliyor.</p>
                                    <button class="hero-cta" data-category="all">Hepsini Gör</button>
                                </div>
<img src="https://cdn.pixabay.com/photo/2017/05/26/05/38/discount-2345221_1280.png" alt="Süper İndirimler" class="hero-image">
                            </div>
                            <div class="hero-slide slide-2">
                                <div class="hero-content">
                                    <h2>👗 Moda Koleksiyonu</h2>
                                    <p>2025'in en trend parçaları şimdi mağazamızda! Stilinizi yansıtın.</p>
                                    <button class="hero-cta" data-category="women's clothing">Kadın Giyim</button>
                                </div>
    <img src="https://t3.ftcdn.net/jpg/03/34/79/68/360_F_334796865_VVTjg49nbLgQPG6rgKDjVqSb5XUhBVsW.jpg" alt="Moda Koleksiyonu" class="hero-image">
                            </div>
                            <div class="hero-slide slide-3">
                                <div class="hero-content">
                                    <h2>📱 Teknoloji Dünyası</h2>
                                    <p>En son teknoloji ürünleri burada! Geleceği bugünden yaşayın.</p>
                                    <button class="hero-cta" data-category="electronics">Elektronik</button>
                                </div>
    <img src="https://aussiemobilephonerepairs.com.au/wp-content/uploads/2024/01/samsung-vs-iphone.jpg" alt="Teknoloji" class="hero-image">
                            </div>
                        </div>
                        <div class="hero-nav">
                            <div class="hero-dot active" data-slide="0"></div>
                            <div class="hero-dot" data-slide="1"></div>
                            <div class="hero-dot" data-slide="2"></div>
                        </div>
                        <div class="hero-arrows">
                            <button class="hero-prev">‹</button>
                            <button class="hero-next">›</button>
                        </div>
                    </section>
                    
                    <section class="${classes.carousel}">
                        <h2>🔥 Kategorilere Göre Alışveriş Yapın</h2>
                        <div class="carousel-content">
                            <div class="carousel-item category-filter active" data-category="all">
                                <div class="category-icon">🛍️</div>
                                <h3>Tüm Ürünler</h3>
                                <p>Hepsini göster</p>
                            </div>
                            <div class="carousel-item category-filter" data-category="men's clothing">
                                <div class="category-icon">👔</div>
                                <h3>Erkek Giyim</h3>
                                <p>Şık ve modern</p>
                            </div>
                            <div class="carousel-item category-filter" data-category="women's clothing">
                                <div class="category-icon">👗</div>
                                <h3>Kadın Giyim</h3>
                                <p>Zarafet ve stil</p>
                            </div>
                            <div class="carousel-item category-filter" data-category="jewelery">
                                <div class="category-icon">💎</div>
                                <h3>Mücevherat</h3>
                                <p>Lüks koleksiyonlar</p>
                            </div>
                            <div class="carousel-item category-filter" data-category="electronics">
                                <div class="category-icon">📱</div>
                                <h3>Elektronik</h3>
                                <p>Son teknoloji</p>
                            </div>
                        </div>
                        <div class="carousel-navigation">
                            <button class="carousel-prev">‹</button>
                            <button class="carousel-next">›</button>
                        </div>
                    </section>
                    
                    <main class="${classes.productList}">
                        <div class="loading">Ürünler yükleniyor...</div>
                    </main>
                </div>
                
                <div class="side-overlay"></div>
                <aside class="${classes.favoritesSection}">
                    <div class="favorites-header">
                        <h2>💖 Favorilerim</h2>
                        <p>Beğendiğiniz ürünler</p>
                    </div>
                    <div class="favorites-items">
                        <p style="text-align: center; color: #7f8c8d; padding: 20px;">Favori ürününüz yok</p>
                    </div>
                    <button class="clear-favorites-btn">🗑️ Favorileri Temizle</button>
                </aside>
                
                <div class="side-overlay"></div>
                <aside class="${classes.cartSection}">
                    <div class="cart-header">
                        <h2>🛒 Sepetim</h2>
                        <p>Seçtiğiniz ürünler</p>
                    </div>
                    <div class="cart-items">
                        <p style="text-align: center; color: #7f8c8d; padding: 20px;">Sepetiniz boş</p>
                    </div>
                    <button class="${classes.clearCartBtn}">🗑️ Sepeti Temizle</button>
                </aside>
                
                <div class="${classes.modalOverlay}">
                    <div class="${classes.modalContent}">
                        <button class="${classes.closeModal}">×</button>
                        <div class="modal-body"></div>
                    </div>
                </div>
            </div>
        `;
        $(selectors.appendLocation).append(html);
    };

    self.loadProducts = () => {
        $.ajax({
            url: 'https://fakestoreapi.com/products',
            method: 'GET',
            dataType: 'json',
            success: (data) => {
                self.products = data;
                self.extractCategories(data);
                self.displayProducts(data);
                self.initializeCarousel();
            },
            error: () => {
                $(selectors.productList).html('<p style="text-align: center; color: #e74c3c; padding: 50px;">❌ Ürünler yüklenirken hata oluştu!</p>');
            }
        });
    };

    self.extractCategories = (products) => {
        self.categories = [...new Set(products.map(product => product.category))];
    };

    self.displayProducts = (products) => {
        const productHTML = products.map(product => `
    <div class="${classes.productCard}" data-id="${product.id}">
        <button class="${classes.favoriteBtn}" data-id="${product.id}">💖</button>
        <img src="${product.image}" alt="${product.title}" class="product-image">
        <div class="product-info">
            <div class="product-category">${product.category}</div>
            <h3 class="product-title">${product.title}</h3>
            <div class="product-price">${product.price}</div>
            <div class="product-actions">
                <button class="${classes.addToCartButton}" data-id="${product.id}">🛒 Sepete Ekle</button>
                <button class="detail-btn" data-id="${product.id}">Detay</button>
            </div>
        </div>
    </div>
`).join('');


        $(selectors.productList).html(productHTML);

        // Animate products on load
        setTimeout(() => {
            $(selectors.productCard).each((index, card) => {
                setTimeout(() => {
                    $(card).addClass('loaded');
                }, index * 100);
            });
        }, 100);
    };

    self.filterByCategory = (category) => {
        self.currentCategory = category;

        // Update active category in carousel
        $('.category-filter').removeClass('active');
        $(`.category-filter[data-category="${category}"]`).addClass('active');

        let filteredProducts;
        if (category === 'all') {
            filteredProducts = self.products;
        } else {
            filteredProducts = self.products.filter(product => product.category === category);
        }

        $(selectors.productList).html('<div class="loading">Ürünler yükleniyor...</div>');

        setTimeout(() => {
            self.displayProducts(filteredProducts);
            self.showCategoryNotification(category, filteredProducts.length);
        }, 300);
    };

    self.showCategoryNotification = (category, count) => {
        const categoryNames = {
            'all': 'Tüm Ürünler',
            "men's clothing": 'Erkek Giyim',
            "women's clothing": 'Kadın Giyim',
            'jewelery': 'Mücevherat',
            'electronics': 'Elektronik'
        };

        const categoryName = categoryNames[category] || category;
        const message = `${categoryName} kategorisinde ${count} ürün gösteriliyor`;
        self.advancedFeatures.createNotification(message, 'info');
    };

    self.initializeCarousel = () => {
        let currentIndex = 0;
        const items = $('.carousel-item');
        const itemWidth = 200; 

        setInterval(() => {
            if (items.length > 0) {
                const container = $('.carousel-content');
                const maxScroll = (items.length - 3) * itemWidth;

                if (currentIndex >= maxScroll) {
                    currentIndex = 0;
                } else {
                    currentIndex += itemWidth;
                }

                container.animate({
                    scrollLeft: currentIndex
                }, 800);
            }
        }, 4000);
    };

    self.loadFavoritesFromStorage = () => {
        const savedFavorites = localStorage.getItem('ecommerce_favorites');
        if (savedFavorites) {
            self.favorites = JSON.parse(savedFavorites);
        }
    };

    self.initHeroCarousel = () => {
        const slides = $('.hero-slides');
        const totalSlides = $('.hero-slide').length;

        // Auto-play carousel
        self.heroInterval = setInterval(() => {
            self.heroSlideIndex = (self.heroSlideIndex + 1) % totalSlides;
            self.updateHeroSlide();
        }, 5000);

        setTimeout(() => {
            $('.hero-content').addClass('animate');
        }, 500);
    };

    self.updateHeroSlide = () => {
        const slides = $('.hero-slides');
        const translateX = -self.heroSlideIndex * 100;
        slides.css('transform', `translateX(${translateX}%)`);

        $('.hero-dot').removeClass('active');
        $(`.hero-dot[data-slide="${self.heroSlideIndex}"]`).addClass('active');

        $('.hero-content').removeClass('animate');
        setTimeout(() => {
            $('.hero-content').addClass('animate');
        }, 100);
    };

    self.nextHeroSlide = () => {
        const totalSlides = $('.hero-slide').length;
        self.heroSlideIndex = (self.heroSlideIndex + 1) % totalSlides;
        self.updateHeroSlide();
    };

    self.prevHeroSlide = () => {
        const totalSlides = $('.hero-slide').length;
        self.heroSlideIndex = (self.heroSlideIndex - 1 + totalSlides) % totalSlides;
        self.updateHeroSlide();
    };

    self.goToHeroSlide = (index) => {
        self.heroSlideIndex = index;
        self.updateHeroSlide();
    };

    self.searchProduct = (searchTerm) => {
        if (!searchTerm.trim()) {
            self.filterByCategory(self.currentCategory);
            return;
        }

        clearTimeout(self.searchTimeout);
        self.searchTimeout = setTimeout(() => {
            const productId = parseInt(searchTerm);
            if (productId && productId > 0 && productId <= 20) {
                $.ajax({
                    url: `https://fakestoreapi.com/products/${productId}`,
                    method: 'GET',
                    dataType: 'json',
                    success: (product) => {
                        self.displayProducts([product]);
                    },
                    error: () => {
                        $(selectors.productList).html('<p style="text-align: center; color: #e74c3c; padding: 50px;">❌ Ürün bulunamadı!</p>');
                    }
                });
            } else {
                // Filter based on current category and search term
                let productsToSearch = self.currentCategory === 'all'
                    ? self.products
                    : self.products.filter(p => p.category === self.currentCategory);

                const filteredProducts = productsToSearch.filter(product =>
                    product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    product.category.toLowerCase().includes(searchTerm.toLowerCase())
                );
                self.displayProducts(filteredProducts);
            }
        }, 500); 
    };

    self.addToCart = (productId) => {
        const product = self.products.find(p => p.id == productId);
        if (!product) return;

        const existingItem = self.cart.find(item => item.id == productId);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            self.cart.push({ ...product, quantity: 1 });
        }

        self.updateCartDisplay();
        self.saveCartToStorage();
        self.showAddToCartAnimation(productId);
    };

    self.removeFromCart = (productId) => {
        self.cart = self.cart.filter(item => item.id != productId);
        self.updateCartDisplay();
        self.saveCartToStorage();
    };

    self.clearCart = () => {
        if (self.cart.length === 0) return;

        $(selectors.cartItem).fadeOut(300, function () {
            self.cart = [];
            self.updateCartDisplay();
            self.saveCartToStorage();
        });
    };

    self.updateCartDisplay = () => {
        const cartItemsContainer = $('.cart-items');
        $(selectors.cartCount).text(self.cart.length);

        if (self.cart.length === 0) {
            cartItemsContainer.html('<p style="text-align: center; color: #7f8c8d; padding: 20px;">Sepetiniz boş</p>');
            return;
        }

        const cartHTML = self.cart.map(item => `
            <div class="${classes.cartItem}" data-id="${item.id}">
                <img src="${item.image}" alt="${item.title}" class="cart-item-image">
                <div class="cart-item-info">
                    <div class="cart-item-title">${item.title.substring(0, 30)}...</div>
                    <div class="cart-item-price">${item.price} x ${item.quantity}</div>
                </div>
                <button class="remove-item" data-id="${item.id}">🗑️</button>
            </div>
        `).join('');

        cartItemsContainer.html(cartHTML);
    };

    self.addToFavorites = (productId) => {
        const product = self.products.find(p => p.id == productId);
        if (!product) return;

        const existingItem = self.favorites.find(item => item.id == productId);
        if (existingItem) {
            self.removeFromFavorites(productId);
            return;
        }

        self.favorites.push({ ...product });
        self.updateFavoritesDisplay();
        self.updateFavoriteButtons();
        self.saveFavoritesToStorage();
        self.showFavoriteAnimation(productId);
        self.advancedFeatures.createNotification('💖 Favorilere eklendi!', 'success');
    };

    self.removeFromFavorites = (productId) => {
        self.favorites = self.favorites.filter(item => item.id != productId);
        self.updateFavoritesDisplay();
        self.updateFavoriteButtons();
        self.saveFavoritesToStorage();
    };

    self.clearFavorites = () => {
        if (self.favorites.length === 0) return;

        $(selectors.favoriteItem).fadeOut(300, function () {
            self.favorites = [];
            self.updateFavoritesDisplay();
            self.updateFavoriteButtons();
            self.saveFavoritesToStorage();
        });
    };

    self.updateFavoritesDisplay = () => {
        const favoritesItemsContainer = $('.favorites-items');
        $(selectors.favoritesCount).text(self.favorites.length);

        if (self.favorites.length === 0) {
            favoritesItemsContainer.html('<p style="text-align: center; color: #7f8c8d; padding: 20px;">Favori ürününüz yok</p>');
            return;
        }

        const favoritesHTML = self.favorites.map(item => `
            <div class="${classes.favoriteItem}" data-id="${item.id}">
                <img src="${item.image}" alt="${item.title}" class="favorite-item-image">
                <div class="favorite-item-info">
                    <div class="favorite-item-title">${item.title.substring(0, 30)}...</div>
                    <div class="favorite-item-price">${item.price}</div>
                </div>
                <div style="display: flex; flex-direction: column; gap: 5px;">
                    <button class="add-to-cart-from-favorites" data-id="${item.id}">🛒</button>
                    <button class="remove-favorite" data-id="${item.id}">🗑️</button>
                </div>
            </div>
        `).join('');

        favoritesItemsContainer.html(favoritesHTML);
    };

    self.updateFavoriteButtons = () => {
        $(selectors.favoriteBtn).each(function () {
            const productId = $(this).data('id');
            const isFavorite = self.favorites.some(item => item.id == productId);

            if (isFavorite) {
                $(this).addClass('active').html('❤️');
            } else {
                $(this).removeClass('active').html('💖');
            }
        });
    };

    self.showProductModal = (productId) => {
        const product = self.products.find(p => p.id == productId);
        if (!product) return;

        const modalHTML = `
            <img src="${product.image}" alt="${product.title}" class="modal-image">
            <div class="modal-info">
                <h2 class="modal-title">${product.title}</h2>
                <div class="product-category">${product.category}</div>
                <p class="modal-description">${product.description}</p>
                <div class="modal-price">${product.price}</div>
                <button class="${classes.addToCartButton}" data-id="${product.id}">
                    🛒 Sepete Ekle
                </button>
            </div>
        `;

        $('.modal-body').html(modalHTML);
        $(selectors.modalOverlay).fadeIn(300);
    };

    self.showAddToCartAnimation = (productId) => {
        const productCard = $(selectors.productCard).filter(`[data-id="${productId}"]`);
        const cartButton = $(selectors.cartToggle);

        const flyingItem = productCard.find('.product-image').clone();
        flyingItem.css({
            position: 'fixed',
            top: productCard.offset().top,
            left: productCard.offset().left,
            width: '50px',
            height: '50px',
            zIndex: 9999,
            opacity: 0.8
        }).appendTo('body');

        flyingItem.animate({
            top: cartButton.offset().top,
            left: cartButton.offset().left,
            width: '20px',
            height: '20px',
            opacity: 0
        }, 800, function () {
            flyingItem.remove();
            cartButton.addClass('animate__pulse');
            setTimeout(() => cartButton.removeClass('animate__pulse'), 600);
        });
    };

    self.showFavoriteAnimation = (productId) => {
        const productCard = $(selectors.productCard).filter(`[data-id="${productId}"]`);
        const favoriteButton = $(selectors.favoritesToggle);

        const flyingHeart = $('<div>💖</div>');
        flyingHeart.css({
            position: 'fixed',
            top: productCard.offset().top,
            left: productCard.offset().left,
            fontSize: '2em',
            zIndex: 9999,
            color: '#e91e63',
            pointerEvents: 'none'
        }).appendTo('body');

        flyingHeart.animate({
            top: favoriteButton.offset().top,
            left: favoriteButton.offset().left,
            fontSize: '1em',
            opacity: 0
        }, 800, function () {
            flyingHeart.remove();
            favoriteButton.addClass('animate__pulse');
            setTimeout(() => favoriteButton.removeClass('animate__pulse'), 600);
        });
    };

    self.saveFavoritesToStorage = () => {
        localStorage.setItem('ecommerce_favorites', JSON.stringify(self.favorites));
    };

    self.saveCartToStorage = () => {
        localStorage.setItem('ecommerce_cart', JSON.stringify(self.cart));
    };

    self.loadCartFromStorage = () => {
        const savedCart = localStorage.getItem('ecommerce_cart');
        if (savedCart) {
            self.cart = JSON.parse(savedCart);
        }
    };

    // Event listeners
    self.setEvents = () => {
        // Search functionality with debounce
        $(document).on('input.ecommerce', selectors.searchBox, function () {
            self.searchProduct($(this).val());
        });

        // Add to favorites
        $(document).on('click.ecommerce', selectors.favoriteBtn, function (e) {
            e.preventDefault();
            const productId = $(this).data('id');
            self.addToFavorites(productId);
        });

        // Hero carousel controls
        $(document).on('click.ecommerce', '.hero-prev', function () {
            self.prevHeroSlide();
        });

        $(document).on('click.ecommerce', '.hero-next', function () {
            self.nextHeroSlide();
        });

        $(document).on('click.ecommerce', '.hero-dot', function () {
            const slideIndex = parseInt($(this).data('slide'));
            self.goToHeroSlide(slideIndex);
        });

        $(document).on('click.ecommerce', '.hero-cta', function () {
            const category = $(this).data('category');
            if (category) {
                self.filterByCategory(category);
                $('html, body').animate({
                    scrollTop: $(selectors.productList).offset().top - 100
                }, 800);
            }
        });

        $(document).on('click.ecommerce', selectors.favoritesToggle, function () {
            $(selectors.favoritesSection).toggleClass('open');
            $('.side-overlay').toggleClass('open');
        });

        $(document).on('click.ecommerce', selectors.addToCartButton, function (e) {
            e.preventDefault();
            const productId = $(this).data('id');
            self.addToCart(productId);
        });

        $(document).on('click.ecommerce', '.add-to-cart-from-favorites', function () {
            const productId = $(this).data('id');
            self.addToCart(productId);
        });

        $(document).on('click.ecommerce', '.detail-btn', function () {
            const productId = $(this).data('id');
            self.showProductModal(productId);
        });

        $(document).on('click.ecommerce', '.product-image', function () {
            const productId = $(this).closest(selectors.productCard).data('id');
            self.showProductModal(productId);
        });

        $(document).on('click.ecommerce', '.category-filter', function () {
            const category = $(this).data('category');
            self.filterByCategory(category);

            $(this).addClass('animate__pulse');
            setTimeout(() => $(this).removeClass('animate__pulse'), 600);
        });

        $(document).on('click.ecommerce', '.carousel-prev', function () {
            $('.carousel-content').animate({
                scrollLeft: '-=200'
            }, 300);
        });

        $(document).on('click.ecommerce', '.carousel-next', function () {
            $('.carousel-content').animate({
                scrollLeft: '+=200'
            }, 300);
        });

        $(document).on('click.ecommerce', selectors.cartToggle, function () {
            $(selectors.cartSection).toggleClass('open');
            $('.side-overlay').toggleClass('open');
        });

        $(document).on('click.ecommerce', '.side-overlay', function () {
            $(selectors.cartSection).removeClass('open');
            $(selectors.favoritesSection).removeClass('open');
            $('.side-overlay').removeClass('open');
        });

        $(document).on('click.ecommerce', '.remove-item', function () {
            const productId = $(this).data('id');
            $(this).closest(selectors.cartItem).slideUp(300, () => {
                self.removeFromCart(productId);
            });
        });

        $(document).on('click.ecommerce', '.remove-favorite', function () {
            const productId = $(this).data('id');
            $(this).closest(selectors.favoriteItem).slideUp(300, () => {
                self.removeFromFavorites(productId);
            });
        });

        $(document).on('click.ecommerce', selectors.clearCartBtn, function () {
            if (confirm('Sepeti temizlemek istediğinize emin misiniz?')) {
                self.clearCart();
            }
        });

        $(document).on('click.ecommerce', '.clear-favorites-btn', function () {
            if (confirm('Tüm favorileri temizlemek istediğinize emin misiniz?')) {
                self.clearFavorites();
            }
        });

        $(document).on('click.ecommerce', selectors.closeModal, function () {
            $(selectors.modalOverlay).fadeOut(300);
        });

        $(document).on('click.ecommerce', selectors.modalOverlay, function (e) {
            if (e.target === this) {
                $(selectors.modalOverlay).fadeOut(300);
            }
        });

        $(document).on('keydown.ecommerce', function (e) {
            if (e.key === 'Escape') {
                $(selectors.modalOverlay).fadeOut(300);
                $(selectors.cartSection).removeClass('open');
                $(selectors.favoritesSection).removeClass('open');
                $('.side-overlay').removeClass('open');
            }
        });

        $(document).on('mouseenter.ecommerce', selectors.productCard, function () {
            $(this).find('.product-image').fadeTo(200, 0.8);
        });

        $(document).on('mouseleave.ecommerce', selectors.productCard, function () {
            $(this).find('.product-image').fadeTo(200, 1);
        });
    };

    // Custom jQuery plugin for cart operations
    $.fn.cartPlugin = function (action, productData) {
        switch (action) {
            case 'add':
                if (productData) {
                    self.addToCart(productData.id);
                }
                break;
            case 'remove':
                if (productData) {
                    self.removeFromCart(productData.id);
                }
                break;
            case 'clear':
                self.clearCart();
                break;
            case 'count':
                return self.cart.length;
            case 'total':
                return self.cart.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2);
        }
        return this;
    };

    // Utility functions
    self.utils = {
        // Format price
        formatPrice: (price) => {
            return new Intl.NumberFormat('tr-TR', {
                style: 'currency',
                currency: 'USD'
            }).format(price);
        },

        truncateText: (text, length) => {
            return text.length > length ? text.substring(0, length) + '...' : text;
        },

        generateId: () => {
            return 'id_' + Math.random().toString(36).substr(2, 9);
        },

        // Validate product data
        validateProduct: (product) => {
            return product && product.id && product.title && product.price && product.image;
        }
    };

    // Advanced DOM manipulation examples
    self.advancedFeatures = {
        cloneProduct: (productId) => {
            const originalCard = $(selectors.productCard).filter(`[data-id="${productId}"]`);
            if (originalCard.length) {
                const clonedCard = originalCard.clone(true);
                clonedCard.find('.product-title').prepend('🔥 ');
                clonedCard.addClass('featured-product');
                return clonedCard;
            }
            return null;
        },

        findProductInfo: (element) => {
            const productCard = $(element).closest(selectors.productCard);
            if (productCard.length) {
                return {
                    id: productCard.data('id'),
                    title: productCard.find('.product-title').text(),
                    price: productCard.find('.product-price').text(),
                    image: productCard.find('.product-image').attr('src')
                };
            }
            return null;
        },

        createNotification: (message, type = 'success') => {
            const typeColors = {
                'success': '#27ae60',
                'error': '#e74c3c',
                'info': '#3498db',
                'warning': '#f39c12'
            };

            const typeIcons = {
                'success': '✅',
                'error': '❌',
                'info': 'ℹ️',
                'warning': '⚠️'
            };

            const notification = $(`
                <div class="notification notification-${type}" style="
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    background: ${typeColors[type] || typeColors.success};
                    color: white;
                    padding: 15px 20px;
                    border-radius: 8px;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                    z-index: 10000;
                    opacity: 0;
                    transform: translateX(100%);
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    max-width: 300px;
                ">
                    <span style="font-size: 1.2em;">${typeIcons[type] || typeIcons.success}</span>
                    <span>${message}</span>
                </div>
            `);

            $('body').append(notification);

            notification.animate({
                opacity: 1,
                right: '20px'
            }, 300);

            setTimeout(() => {
                notification.animate({
                    opacity: 0,
                    right: '-300px'
                }, 300, function () {
                    notification.remove();
                });
            }, 3000);
        }
    };

    $(document).ready(() => {
        self.init();

        setTimeout(() => {
            self.updateCartDisplay();
            self.updateFavoritesDisplay();
            self.updateFavoriteButtons();
        }, 100);

        setTimeout(() => {
            self.advancedFeatures.createNotification('🎉 AkgülShopHub E-Ticaret\'e Hoş Geldiniz!', 'success');
        }, 1000);

        // Console API for testing
        window.ecommerceAPI = {
            getCart: () => self.cart,
            getFavorites: () => self.favorites,
            addProduct: (id) => self.addToCart(id),
            addToFavorites: (id) => self.addToFavorites(id),
            removeProduct: (id) => self.removeFromCart(id),
            removeFavorite: (id) => self.removeFromFavorites(id),
            clearCart: () => self.clearCart(),
            clearFavorites: () => self.clearFavorites(),
            getProducts: () => self.products,
            searchProduct: (term) => self.searchProduct(term),
            filterByCategory: (category) => self.filterByCategory(category),
            getCurrentCategory: () => self.currentCategory,
            getCategories: () => self.categories,
            nextSlide: () => self.nextHeroSlide(),
            prevSlide: () => self.prevHeroSlide(),
            goToSlide: (index) => self.goToHeroSlide(index),
            utils: self.utils,
            features: self.advancedFeatures
        };

        console.log('🚀 E-Ticaret sitesi başarıyla yüklendi!');
        console.log('💡 Test için window.ecommerceAPI kullanabilirsiniz');
        console.log('📋 Örnek komutlar:');
        console.log('   window.ecommerceAPI.addProduct(1)');
        console.log('   window.ecommerceAPI.addToFavorites(2)');
        console.log('   window.ecommerceAPI.filterByCategory("electronics")');
        console.log('   window.ecommerceAPI.nextSlide()');
        console.log('🛍️ Kategoriler: Tüm ürünler, Erkek/Kadın giyim, Mücevherat, Elektronik');
        console.log('💖 Yeni özellik: Favoriler sistemi ve Hero Carousel!');
    });

})(jQuery);