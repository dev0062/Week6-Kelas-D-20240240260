const menuList = document.querySelector('#menuList');
const statusCatalog = document.querySelector('#statusCatalog');
const filterTabs = document.querySelector('#filterTabs');
const searchInput = document.querySelector('#searchInput');

let allMenus = [];
let activeCategory = 'all';

const fallbackData = [
  { id: 1, nama: "Kopi Susu Gula Aren", tipe: "Coffee", kategori: "Best Seller", harga: 18000, gambar: "https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&w=600&q=80", keunggulan: "100% Arabika lokal dengan gula aren organik yang creamy dan manisnya pas" },
  { id: 2, nama: "Americano Peach Cold Brew", tipe: "Signature", kategori: "Segar", harga: 22000, gambar: "https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?auto=format&fit=crop&w=600&q=80", keunggulan: "Seduh dingin selama 16 jam dengan ekstrak buah persik segar yang bikin fokus" },
  { id: 3, nama: "Ceremonial Matcha Espresso", tipe: "Signature", kategori: "Signature", harga: 25000, gambar: "https://images.unsplash.com/photo-1536256263959-770b48d82b0a?auto=format&fit=crop&w=600&q=80", keunggulan: "Perpaduan matcha Jepang asli dengan shot espresso hangat tanpa pemanis buatan" },
  { id: 4, nama: "Butterscotch Sea Salt Latte", tipe: "Coffee", kategori: "Menu Baru", harga: 23000, gambar: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=600&q=80", keunggulan: "Kombinasi sea salt foam gurih lembut dengan saus butterscotch homemade" },
  { id: 5, nama: "Belgian Dark Chocolate", tipe: "Non-Coffee", kategori: "Favorit", harga: 21000, gambar: "https://images.unsplash.com/photo-1542990253-0d0f5be5f0ed?auto=format&fit=crop&w=600&q=80", keunggulan: "Cokelat hitam Belgia pekat dengan tekstur susu steamed yang velvety dan menenangkan" },
  { id: 6, nama: "Hojicha Oat Milk Latte", tipe: "Non-Coffee", kategori: "Plant Based", harga: 24000, gambar: "https://images.unsplash.com/photo-1572442388796-11668a67e53d?auto=format&fit=crop&w=600&q=80", keunggulan: "Teh hijau panggang khas Jepang berpadu dengan oat milk rendah kalori yang nutty" }
];

const formatRp = (num) => 'Rp ' + Number(num).toLocaleString('id-ID');

// Render Card Interaktif ke DOM
function renderCards(data) {
  if (data.length === 0) {
    menuList.innerHTML = `<p style="color:#71717a; grid-column: 1/-1;">Menu tidak ditemukan.</p>`;
    return;
  }

  menuList.innerHTML = data.map(item => `
    <article class="menu-card" data-id="${item.id}" data-price="${item.harga}" data-temp="Ice" data-qty="1">
      <div class="card-img">
        <span class="badge">${item.kategori}</span>
        <img src="${item.gambar}" alt="${item.nama}">
      </div>
      <div class="card-content">
        <div class="card-header-row">
          <h3>${item.nama}</h3>
          <span class="price-tag">${formatRp(item.harga)}</span>
        </div>
        <p class="card-desc">${item.keunggulan}</p>

        <!-- Kontrol DOM Interaktif di dalam Card -->
        <div class="card-controls">
          <div class="temp-toggle">
            <button type="button" class="temp-btn active" data-temp-val="Ice">🧊 Ice</button>
            <button type="button" class="temp-btn" data-temp-val="Hot">☕ Hot</button>
          </div>
          <div class="qty-control">
            <button type="button" class="qty-btn" data-action="minus">−</button>
            <span class="qty-val">1</span>
            <button type="button" class="qty-btn" data-action="plus">+</button>
          </div>
        </div>

        <button type="button" class="btn-order">
          Pesan Sekarang • <span class="btn-total">${formatRp(item.harga)}</span>
        </button>
      </div>
    </article>
  `).join('');
}

// Filter berdasarkan kategori & pencarian
function filterMenu() {
  const keyword = searchInput.value.toLowerCase().trim();
  const filtered = allMenus.filter(item => {
    const matchCategory = activeCategory === 'all' || item.tipe === activeCategory;
    const matchSearch = item.nama.toLowerCase().includes(keyword) || item.keunggulan.toLowerCase().includes(keyword);
    return matchCategory && matchSearch;
  });

  statusCatalog.textContent = `Menampilkan ${filtered.length} dari ${allMenus.length} menu tersedia`;
  renderCards(filtered);
}

// Event Listener untuk Tab Filter Kategori
filterTabs.addEventListener('click', (e) => {
  const btn = e.target.closest('.tab-btn');
  if (!btn) return;

  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  activeCategory = btn.dataset.filter;
  filterMenu();
});

// Event Listener untuk Live Search
searchInput.addEventListener('input', filterMenu);

// Event Delegation untuk Interaksi DOM di dalam Card (Toggle Ice/Hot, Plus/Minus Qty, & Klik Pesan)
menuList.addEventListener('click', (e) => {
  const card = e.target.closest('.menu-card');
  if (!card) return;

  const basePrice = Number(card.dataset.price);
  let qty = Number(card.dataset.qty);

  // 1. Jika klik tombol suhu (Ice / Hot)
  const tempBtn = e.target.closest('.temp-btn');
  if (tempBtn) {
    card.querySelectorAll('.temp-btn').forEach(b => b.classList.remove('active'));
    tempBtn.classList.add('active');
    card.dataset.temp = tempBtn.dataset.tempVal;
    return;
  }

  // 2. Jika klik tombol Plus / Minus jumlah
  const qtyBtn = e.target.closest('.qty-btn');
  if (qtyBtn) {
    const action = qtyBtn.dataset.action;
    if (action === 'plus') qty += 1;
    if (action === 'minus' && qty > 1) qty -= 1;

    card.dataset.qty = qty;
    card.querySelector('.qty-val').textContent = qty;
    card.querySelector('.btn-total').textContent = formatRp(basePrice * qty);
    return;
  }

  // 3. Jika klik tombol "Pesan Sekarang" -> Bawa pilihan ke form.html
  const orderBtn = e.target.closest('.btn-order');
  if (orderBtn) {
    const id = card.dataset.id;
    const temp = card.dataset.temp;
    window.location.href = `./form.html?id=${id}&qty=${qty}&temp=${temp}`;
  }
});

// Load data awal dengan Fetch
async function initCatalog() {
  try {
    const res = await fetch('./data/menu.json');
    if (!res.ok) throw new Error('Fetch gagal');
    allMenus = await res.json();
    filterMenu();
  } catch (err) {
    allMenus = fallbackData;
    filterMenu();
  }
}

document.addEventListener('DOMContentLoaded', initCatalog);