const KUNCI_TRANSAKSI = "transaksi";
let transaksi = [];

function formatRupiah(angka) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency", currency: "IDR", maximumFractionDigits: 0
  }).format(angka);
}

function tanggalHariIni() {
  const lokal = new Date(Date.now() - new Date().getTimezoneOffset() * 60000);
  return lokal.toISOString().slice(0, 10);
}

// W4: data persisten
function muatData() {
  try {
    transaksi = JSON.parse(localStorage.getItem(KUNCI_TRANSAKSI)) || [];
  } catch (e) {
    transaksi = [];
  }
}

function simpanData() {
  localStorage.setItem(KUNCI_TRANSAKSI, JSON.stringify(transaksi));
}

function buatEl(tag, teks, kelas) {
  const e = document.createElement(tag);
  if (teks !== undefined) e.textContent = teks;
  if (kelas) e.className = kelas;
  return e;
}

// W2: daftar dirender dari array, terbaru di atas
function renderDaftar() {
  const daftar = document.getElementById("daftarTransaksi");
  daftar.innerHTML = "";
  const tampil = [...transaksi].sort((a, b) => b.tanggal.localeCompare(a.tanggal) || b.id - a.id);

  if (tampil.length === 0) {
    daftar.appendChild(buatEl("li", "Belum ada transaksi. Catat pengeluaran pertamamu di atas.", "kosong"));
    return;
  }
  tampil.forEach(t => {
    const li = buatEl("li", undefined, t.jenis);
    const info = buatEl("div", undefined, "info");
    info.appendChild(buatEl("strong", t.kategori));
    info.appendChild(buatEl("small", t.tanggal + (t.catatan ? " - " + t.catatan : "")));
    const tanda = t.jenis === "pengeluaran" ? "-" : "+";
    const nominal = buatEl("span", tanda + formatRupiah(t.nominal), "nominal");
    const hapus = buatEl("button", "Hapus");
    hapus.type = "button";
    hapus.addEventListener("click", () => hapusTransaksi(t.id));
    li.append(info, nominal, hapus);
    daftar.appendChild(li);
  });
}

// W1: tambah transaksi
function tambahTransaksi(event) {
  event.preventDefault();
  transaksi.push({
    id: Date.now(),
    tanggal: document.getElementById("tanggal").value,
    jenis: document.getElementById("jenis").value,
    kategori: document.getElementById("kategori").value,
    nominal: Number(document.getElementById("nominal").value),
    catatan: document.getElementById("catatan").value.trim()
  });
  simpanData();
  document.getElementById("nominal").value = "";
  document.getElementById("catatan").value = "";
  renderDaftar();
}

// W3: hapus dengan konfirmasi
function hapusTransaksi(id) {
  if (!confirm("Hapus transaksi ini?")) return;
  transaksi = transaksi.filter(t => t.id !== id);
  simpanData();
  renderDaftar();
}

document.getElementById("formTransaksi").addEventListener("submit", tambahTransaksi);
muatData();
document.getElementById("tanggal").value = tanggalHariIni();
renderDaftar();