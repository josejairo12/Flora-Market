const CATALOG_DATA = [
  { 
    id: 1, 
    name: "Llavero de flor amarilla", 
    category: "ramo", 
    price: 20, // precio en bolivianos
    desc: "Hermoso llavero de girasol de limpiapipas.", 
    img: "img/llavero de girasol.jpeg" 
  },
  { 
    id: 2, 
    name: "taza de Tulipanes ", 
    category: "individual", 
    price: 30, // precio en bolivianos
    desc: "Tulipanes artesanales de alta calidad con taza tambien de alta calidad.", 
    img: "img/taza de limpiaipas.jpg.jpeg" 
  },
  { 
    id: 3, 
    name: "jarron de flores mixtas", 
    category: "ramo", 
    price: 50, // precio en bolivianos
    desc: "Arreglo completo de rosas y flores mixtas en un jarron.", 
    img: "img/jarron de flores mixtas.jpg.jpeg" 
  },
  {

    id: 4, 
    name: "ramo de tulipanes", 
    category: "ramo", // Usa: "ramo", "individual" o "especial"
    price: 150, // Precio en Bolivianos (Bs.)
    desc: "hermoso ramo de tulipanes con un arreglo unico y bonito.", 
    img: "img/ramo de tulipanes.jpg" // Ruta de la imagen guardada en tu carpeta
  },
  { 
    id: 5, 
    name: "ramo de tulipanes con corona", 
    category: "especial", // Usa: "ramo", "individual" o "especial"
    price: 220, // Precio en Bolivianos (Bs.)
    desc: "hermoso ramo de tulipanes con estil unico y hermoso con corona para tu princesa.", 
    img: "img/ramo de tulipanes con corona.jpg" // Ruta de la imagen guardada en tu carpeta
  }
];

// Estado global de la aplicación
let cart = [];
let currentUser = null; 
let selectedColorName = "Amarillo Neón";
let currentDetailProduct = null; 
let detailQuantity = 1;

// Inicialización
document.addEventListener("DOMContentLoaded", () => {
  lucide.createIcons();
  renderCatalog(CATALOG_DATA);
  loadInitialStorage();
  updateUserNav();
  updateCustomizer();
});

// Navegación entre pestañas
function switchTab(tabId, btnElement) {
  document.querySelectorAll(".tab-content").forEach(el => el.classList.remove("active"));
  document.querySelectorAll(".nav-btn").forEach(el => el.classList.remove("active"));
  
  document.getElementById(`tab-${tabId}`).classList.add("active");
  if (btnElement) {
    btnElement.classList.add("active");
  }
}

function goToSection(tabId) {
  const navBtn = document.getElementById(`nav-btn-${tabId}`);
  switchTab(tabId, navBtn);
}

function renderCatalog(items) {
  const container = document.getElementById("products-container");
  container.innerHTML = "";
  
  items.forEach(p => {
    const card = document.createElement("div");
    card.className = "product-card";
    card.onclick = () => openProductDetail(p.id);
    card.style.cursor = "pointer";

    card.innerHTML = `
      <div class="product-img-box">
        <img src="${p.img}" alt="${p.name}" style="width: 100%; height: 100%; object-fit: cover;">
      </div>
      <div class="product-info">
        <span class="product-tag">${p.category.toUpperCase()}</span>
        <h3>${p.name}</h3>
        <p>${p.desc}</p>
        <div class="product-bottom">
          <span class="price">Bs. ${p.price.toFixed(2)}</span>
          <button class="add-btn" onclick="event.stopPropagation(); addToCart(${p.id})" title="Añadir rápido">
            <i data-lucide="plus"></i>
          </button>
        </div>
      </div>
    `;
    container.appendChild(card);
  });
  lucide.createIcons();
}

// ==========================================
// APARTADO DE DETALLE Y COMPRA DE PRODUCTO
// ==========================================

function openProductDetail(productId) {
  const product = CATALOG_DATA.find(p => p.id === productId);
  if (!product) return;

  currentDetailProduct = product;
  detailQuantity = 1;

  document.getElementById("detail-category").innerText = product.category.toUpperCase();
  document.getElementById("detail-img").src = product.img;
  document.getElementById("detail-title").innerText = product.name;
  document.getElementById("detail-price").innerText = `Bs. ${product.price.toFixed(2)}`;
  document.getElementById("detail-desc").innerText = product.desc;
  document.getElementById("detail-qty-val").innerText = detailQuantity;

  toggleProductDetailModal(true);
  lucide.createIcons();
}

function toggleProductDetailModal(show) {
  document.getElementById("product-detail-modal").classList.toggle("active", show);
}

function changeDetailQty(delta) {
  detailQuantity += delta;
  if (detailQuantity < 1) detailQuantity = 1;
  document.getElementById("detail-qty-val").innerText = detailQuantity;
}

function addFromDetailToCart() {
  if (!currentDetailProduct) return;

  const existing = cart.find(item => item.id === currentDetailProduct.id);
  if (existing) {
    existing.qty += detailQuantity;
  } else {
    cart.push({ ...currentDetailProduct, qty: detailQuantity });
  }

  updateCartUI();
  toggleProductDetailModal(false);
  alert(`Se agregaron ${detailQuantity} unidad(es) de "${currentDetailProduct.name}" al carrito.`);
}

function buyNowFromDetail() {
  if (!currentDetailProduct) return;

  const existing = cart.find(item => item.id === currentDetailProduct.id);
  if (existing) {
    existing.qty += detailQuantity;
  } else {
    cart.push({ ...currentDetailProduct, qty: detailQuantity });
  }

  updateCartUI();
  toggleProductDetailModal(false);
  proceedToCheckout();
}

// Personalizador de Ramos
function selectColor(colorName, btn) {
  document.querySelectorAll(".color-dot").forEach(b => b.classList.remove("active"));
  btn.classList.add("active");
  selectedColorName = colorName;
  updateCustomizer();
}

function updateCustomizer() {
  const flowerEl = document.querySelector('input[name="c-flower"]:checked');
  const flowerName = flowerEl.value;
  const flowerPrice = parseFloat(flowerEl.dataset.price);

  const qty = parseInt(document.getElementById("c-qty-slider").value);
  document.getElementById("c-qty-val").innerText = qty;

  const wrapEl = document.getElementById("c-wrap");
  const wrapName = wrapEl.value;
  const wrapPrice = parseFloat(wrapEl.options[wrapEl.selectedIndex].dataset.price);

  const hasLed = document.getElementById("c-led").checked;
  const hasCard = document.getElementById("c-card").checked;

  document.getElementById("card-note-container").style.display = hasCard ? "block" : "none";

  const stemsTotal = flowerPrice * qty;
  let extrasTotal = 0;
  if (hasLed) extrasTotal += parseFloat(document.getElementById("c-led").dataset.price);
  if (hasCard) extrasTotal += parseFloat(document.getElementById("c-card").dataset.price);

  const grandTotal = stemsTotal + wrapPrice + extrasTotal;

  document.getElementById("prev-title").innerText = `Ramo de ${flowerName}s`;
  document.getElementById("prev-details").innerText = `${qty} tallos • Tono: ${selectedColorName}`;
  
  const tagsContainer = document.getElementById("prev-tags");
  tagsContainer.innerHTML = `<span class="product-tag">${wrapName}</span>`;
  if (hasLed) tagsContainer.innerHTML += `<span class="product-tag">LEDs</span>`;
  if (hasCard) tagsContainer.innerHTML += `<span class="product-tag">Tarjeta</span>`;

  document.getElementById("pr-stems").innerText = `Bs. ${stemsTotal.toFixed(2)}`;
  document.getElementById("pr-wrap").innerText = `Bs. ${wrapPrice.toFixed(2)}`;
  document.getElementById("pr-extras").innerText = `Bs. ${extrasTotal.toFixed(2)}`;
  document.getElementById("pr-total").innerText = `Bs. ${grandTotal.toFixed(2)}`;
}

function addCustomToCart() {
  const flowerName = document.querySelector('input[name="c-flower"]:checked').value;
  const qty = document.getElementById("c-qty-slider").value;
  const priceText = document.getElementById("pr-total").innerText;
  const price = parseFloat(priceText.replace("Bs.", "").trim());

  const customItem = {
    id: "custom_" + Date.now(),
    name: `Ramo Personalizado (${flowerName})`,
    price: price,
    qty: 1,
    details: `${qty} tallos, Tono ${selectedColorName}`
  };

  cart.push(customItem);
  updateCartUI();
  alert("¡Tu ramo personalizado ha sido añadido al carrito!");
}

// Carrito de compras
function addToCart(productId) {
  const product = CATALOG_DATA.find(p => p.id === productId);
  const existing = cart.find(item => item.id === productId);

  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ ...product, qty: 1 });
  }

  updateCartUI();
}

function updateCartUI() {
  const countEl = document.getElementById("cart-count");
  const itemsContainer = document.getElementById("cart-items-container");
  const totalPriceEl = document.getElementById("cart-total-price");

  const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
  const totalMoney = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);

  countEl.innerText = totalItems;
  totalPriceEl.innerText = `Bs. ${totalMoney.toFixed(2)}`;

  if (cart.length === 0) {
    itemsContainer.innerHTML = `<p style="text-align:center; color:#888; margin: 40px 0;">Tu carrito está vacío.</p>`;
    return;
  }

  itemsContainer.innerHTML = "";
  cart.forEach(item => {
    const row = document.createElement("div");
    row.className = "cart-item";
    row.innerHTML = `
      <div>
        <strong>${item.name}</strong>
        <br><small style="color:#777">Bs. ${item.price.toFixed(2)} c/u</small>
      </div>
      <div class="cart-item-qty">
        <button class="qty-btn" onclick="changeQty('${item.id}', -1)">-</button>
        <span>${item.qty}</span>
        <button class="qty-btn" onclick="changeQty('${item.id}', 1)">+</button>
      </div>
    `;
    itemsContainer.appendChild(row);
  });
}

function changeQty(id, delta) {
  const item = cart.find(i => i.id == id);
  if (item) {
    item.qty += delta;
    if (item.qty <= 0) {
      cart = cart.filter(i => i.id != id);
    }
  }
  updateCartUI();
}

function toggleCartModal(show) {
  document.getElementById("cart-modal").classList.toggle("active", show);
}

// Pagos por QR
function proceedToCheckout() {
  if (cart.length === 0) return alert("Tu carrito está vacío");

  const date = document.getElementById("delivery-date").value;
  const time = document.getElementById("delivery-time").value;

  if (!date || !time) {
    return alert("Por favor selecciona la fecha y hora para la entrega de tu pedido.");
  }
  
  const totalMoney = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  document.getElementById("qr-total-amount").innerText = `Bs. ${totalMoney.toFixed(2)}`;

  toggleCartModal(false);
  toggleQRModal(true);
}

// Autenticación de Usuarios (localStorage)
function toggleQRModal(show) {
  const modal = document.getElementById("qr-modal");
  if (modal) {
    modal.style.display = show ? "flex" : "none";
  }
}

function switchAuthMode(mode) {
  document.getElementById("form-login").style.display = mode === "login" ? "block" : "none";
  document.getElementById("form-register").style.display = mode === "register" ? "block" : "none";
  document.getElementById("auth-title").innerText = mode === "login" ? "Iniciar Sesión" : "Crear Cuenta";
}

function handleRegister(e) {
  e.preventDefault();
  const name = document.getElementById("reg-name").value;
  const email = document.getElementById("reg-email").value;
  const password = document.getElementById("reg-password").value;

  let users = JSON.parse(localStorage.getItem("fm_users") || "[]");
  if (users.some(u => u.email === email)) {
    return alert("El correo ya está registrado");
  }

  const newUser = {
    id: "USR-" + Math.floor(1000 + Math.random() * 9000),
    name,
    email,
    password,
    registeredAt: new Date().toLocaleDateString(),
    lastLogin: new Date().toLocaleString()
  };

  users.push(newUser);
  localStorage.setItem("fm_users", JSON.stringify(users));
  currentUser = newUser;
  
  updateUserNav();
  toggleAuthModal(false);
  alert("¡Cuenta creada e inicio de sesión exitoso!");
}

function handleLogin(e) {
  e.preventDefault();
  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;

  let users = JSON.parse(localStorage.getItem("fm_users") || "[]");
  const user = users.find(u => u.email === email && u.password === password);

  if (!user) {
    return alert("Credenciales incorrectas");
  }

  user.lastLogin = new Date().toLocaleString();
  localStorage.setItem("fm_users", JSON.stringify(users));
  
  currentUser = user;
  updateUserNav();
  toggleAuthModal(false);
}

function logoutUser() {
  currentUser = null;
  updateUserNav();
}

function updateUserNav() {
  const container = document.getElementById("user-nav-area");
  if (currentUser) {
    container.innerHTML = `
      <div class="user-profile">
        <span class="user-name">Hola, ${currentUser.name.split(' ')[0]}</span>
        <button class="btn-logout" onclick="logoutUser()">Salir</button>
      </div>
    `;
  } else {
    container.innerHTML = `
      <button class="btn-auth" onclick="toggleAuthModal(true)">Cuenta / Acceso</button>
    `;
  }
}

// Panel de Administración / Base de Datos
function checkAdminPass() {
  const pass = document.getElementById("admin-pass").value;
  if (pass === "admin123") {
    document.getElementById("admin-login-box").style.display = "none";
    document.getElementById("admin-dashboard").style.display = "block";
    loadAdminData();
  } else {
    alert("Contraseña de administrador incorrecta");
  }
}

function logoutAdmin() {
  document.getElementById("admin-login-box").style.display = "block";
  document.getElementById("admin-dashboard").style.display = "none";
  document.getElementById("admin-pass").value = "";
}

function loadAdminData() {
  const users = JSON.parse(localStorage.getItem("fm_users") || "[]");
  document.getElementById("stat-users").innerText = users.length;
  document.getElementById("stat-logins").innerText = users.length > 0 ? users.length + 3 : 0;

  const tbody = document.getElementById("admin-users-table");
  tbody.innerHTML = "";

  if (users.length === 0) {
    tbody.innerHTML = `<tr><td colspan="5" style="text-align:center;">No hay usuarios registrados aún.</td></tr>`;
    return;
  }

  users.forEach(u => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td><strong>${u.id}</strong></td>
      <td>${u.name}</td>
      <td>${u.email}</td>
      <td>${u.registeredAt}</td>
      <td>${u.lastLogin || u.registeredAt}</td>
    `;
    tbody.appendChild(tr);
  });
}

function loadInitialStorage() {
  if (!localStorage.getItem("fm_users")) {
    const demoUsers = [
      { id: "USR-101", name: "Ana López", email: "ana@ejemplo.com", password: "123", registeredAt: "10/11/2026", lastLogin: "11/11/2026 14:20" },
      { id: "USR-102", name: "Carlos Ruiz", email: "carlos@ejemplo.com", password: "123", registeredAt: "08/11/2026", lastLogin: "09/11/2026 09:15" }
    ];
    localStorage.setItem("fm_users", JSON.stringify(demoUsers));
  }
}

function filterCatalog(category, btn) {
  document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
  btn.classList.add("active");
  
  if (category === "all") {
    renderCatalog(CATALOG_DATA);
  } else {
    const filtered = CATALOG_DATA.filter(p => p.category === category);
    renderCatalog(filtered);
  }
}
// Atajo secreto para abrir el panel de admin (Ctrl + Shift + A)
document.addEventListener("keydown", (e) => {
  if (e.ctrlKey && e.shiftKey && e.code === "KeyA") {
    e.preventDefault();
    // Crea o muestra la pestaña de admin si no está visible en el menú
    let adminTab = document.getElementById("tab-admin");
    if (adminTab) {
      document.querySelectorAll(".tab-content").forEach(el => el.classList.remove("active"));
      document.querySelectorAll(".nav-btn").forEach(el => el.classList.remove("active"));
      adminTab.classList.add("active");
      alert("Modo Administrador activado. Ingresa tu contraseña.");
    }
  }
});