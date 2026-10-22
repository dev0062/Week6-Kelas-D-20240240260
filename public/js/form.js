// BAGIAN 2: Ambil elemen dengan selector
const form = document.querySelector('#captionForm');
const inputNama = document.querySelector('#namaProduk');
const inputKeunggulan = document.querySelector('#keunggulanProduk');
const inputHarga = document.querySelector('#hargaProduk');
const inputJumlah = document.querySelector('#jumlahProduk');
const selectSuhu = document.querySelector('#suhuPenyajian');
const selectGaya = document.querySelector('#gayaCaption');
const btnFetch = document.querySelector('#btnFetch');
const btnCopy = document.querySelector('#btnCopy');
const statusArea = document.querySelector('#statusArea');
const outputArea = document.querySelector('#outputArea');

let presetIndex = 0;

const fallbackMenus = [
  { id: 1, nama: "Kopi Susu Gula Aren", harga: 18000, keunggulan: "100% Arabika lokal dengan gula aren organik yang creamy dan manisnya pas" },
  { id: 2, nama: "Americano Peach Cold Brew", harga: 22000, keunggulan: "Seduh dingin selama 16 jam dengan ekstrak buah persik segar yang bikin fokus" },
  { id: 3, nama: "Ceremonial Matcha Espresso", harga: 25000, keunggulan: "Perpaduan matcha Jepang asli dengan shot espresso hangat tanpa pemanis buatan" },
  { id: 4, nama: "Butterscotch Sea Salt Latte", harga: 23000, keunggulan: "Kombinasi sea salt foam gurih lembut dengan saus butterscotch homemade" }
];

function setStatus(text, type = 'normal') {
  statusArea.textContent = text;
  statusArea.className = 'status-banner';
  if (type === 'error') statusArea.classList.add('error');
  if (type === 'success') statusArea.classList.add('success');
}

// BAGIAN 3: Ambil data dengan Fetch
async function fetchMenuData() {
  try {
    const response = await fetch('./data/menu.json');
    if (!response.ok) throw new Error('Gagal memuat file JSON');
    return await response.json();
  } catch (err) {
    return fallbackMenus;
  }
}

function populateForm(item, qty = 1, temp = 'Ice') {
  inputNama.value = item.nama;
  inputKeunggulan.value = item.keunggulan;
  inputHarga.value = item.harga;
  inputJumlah.value = qty;
  selectSuhu.value = temp;
  setStatus(`Data "${item.nama}" (${qty}x ${temp}) berhasil dimuat otomatis!`, 'success');
}

// Jika datang dari klik Card Interaktif di index.html, langsung fetch & render otomatis
document.addEventListener('DOMContentLoaded', async () => {
  const params = new URLSearchParams(window.location.search);
  const id = Number(params.get('id'));
  const qty = Number(params.get('qty')) || 1;
  const temp = params.get('temp') || 'Ice';

  if (id) {
    const menus = await fetchMenuData();
    const selected = menus.find(m => m.id === id);
    if (selected) {
      populateForm(selected, qty, temp);
      form.requestSubmit(); // Langsung tampilkan hasil di panel kanan
    }
  }
});

// Event klik tombol Fetch Preset JSON (Bagian 3)
btnFetch.addEventListener('click', async () => {
  setStatus('Mengambil data preset dari menu.json...');
  const menus = await fetchMenuData();
  const item = menus[presetIndex];
  presetIndex = (presetIndex + 1) % menus.length;
  populateForm(item, 1, 'Ice');
});

// BAGIAN 2: Event Submit, Validasi nama & keunggulan, Tampilkan caption
form.addEventListener('submit', (e) => {
  e.preventDefault();

  const nama = inputNama.value.trim();
  const keunggulan = inputKeunggulan.value.trim();
  const harga = Number(inputHarga.value) || 0;
  const jumlah = Number(inputJumlah.value) || 1;
  const suhu = selectSuhu.value;
  const gaya = selectGaya.value;

  // Validasi nama dan keunggulan
  if (!nama || !keunggulan) {
    setStatus('Validasi Gagal: Nama Menu dan Keunggulan wajib diisi!', 'error');
    outputArea.textContent = '⚠️ Mohon lengkapi field Nama Menu dan Keunggulan terlebih dahulu.';
    return;
  }

  const total = harga * jumlah;
  let captionText = '';

  if (gaya === 'santai') {
    captionText = `Si paling butuh booster hari ini wajib merapat! ✨\nCobain ${nama} (${suhu}) dari Kopi Sederhana — hadir dengan ${keunggulan.toLowerCase()}.\n\nSatu gelas mana cukup? Yuk amankan pesananmu sekarang! ☕`;
  } else if (gaya === 'promo') {
    captionText = `🔥 PROMO SPESIAL HARI INI: ${nama.toUpperCase()} 🔥\nNikmati sensasi ${keunggulan.toLowerCase()} hanya Rp ${harga.toLocaleString('id-ID')}/cup!\n\nPesan ${jumlah} cup (${suhu}) sekarang juga sebelum kehabisan!`;
  } else {
    captionText = `Ada tenang di setiap tegukan. 🌿\n${nama} (${suhu}) diracik perlahan dengan ${keunggulan.toLowerCase()}, menemani jeda terbaikmu hari ini.`;
  }

  outputArea.textContent = 
`SUMMARY PESANAN
• Menu      : ${nama} (${suhu})
• Kuantitas : ${jumlah} Cup x Rp ${harga.toLocaleString('id-ID')}
• Total     : Rp ${total.toLocaleString('id-ID')}

-----------------------------------
GENERATED UMKM CAPTION (${gaya.toUpperCase()}):

${captionText}

#KopiSederhana #CraftCoffee #UMKMKopi`;

  setStatus(`Output & caption untuk "${nama}" berhasil dibuat!`, 'success');
});

// Fitur tambahan DOM: Copy ke Clipboard
btnCopy.addEventListener('click', () => {
  navigator.clipboard.writeText(outputArea.textContent);
  btnCopy.textContent = 'Tersalin! ✓';
  setTimeout(() => { btnCopy.textContent = 'Salin Teks'; }, 1500);
});