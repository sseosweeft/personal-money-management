const KUNCI_TRANSAKSI = "transaksi";
let transaksi = [];
const elError = document.getElementById("pesanError");

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

// W5: ringkasan
function hitungRingkasan() {
  const masuk = transaksi.filter(t => t.jenis === "pemasukan").reduce((n, t) => n + t.nominal, 0);
  const keluar = transaksi.filter(t => t.jenis === "pengeluaran").reduce((n, t) => n + t.nominal, 0);
  return { masuk, keluar, saldo: masuk - keluar };
}

function renderRingkasan() {
  const r = hitungRingkasan();
  document.getElementById("totalMasuk").textContent = formatRupiah(r.masuk);
  document.getElementById("totalKeluar").textContent = formatRupiah(r.keluar);
  document.getElementById("saldo").textContent = formatRupiah(r.saldo);
}

function renderSemua() {
  renderRingkasan();
  renderDaftar();
}

function tampilkanError(pesan) {
  elError.textContent = pesan;
}

// W1: tambah transaksi
function tambahTransaksi(event) {
  event.preventDefault();
  const tanggal = document.getElementById("tanggal").value;
  const inputNominal = document.getElementById("nominal");
  const nominal = Number(inputNominal.value);
  inputNominal.classList.remove("salah");

  // W6: validasi
  if (!tanggal) {
    tampilkanError("Tanggal wajib diisi.");
    return;
  }
  if (!(nominal > 0)) {
    tampilkanError("Nominal harus lebih dari 0.");
    inputNominal.classList.add("salah");
    return;
  }
  tampilkanError("");

  transaksi.push({
    id: Date.now(),
    tanggal: tanggal,
    jenis: document.getElementById("jenis").value,
    kategori: document.getElementById("kategori").value,
    nominal: nominal,
    catatan: document.getElementById("catatan").value.trim()
  });
  simpanData();
  document.getElementById("nominal").value = "";
  document.getElementById("catatan").value = "";
  renderSemua();
}

// W3: hapus dengan konfirmasi
function hapusTransaksi(id) {
  if (!confirm("Hapus transaksi ini?")) return;
  transaksi = transaksi.filter(t => t.id !== id);
  simpanData();
  renderSemua();
}

document.getElementById("formTransaksi").addEventListener("submit", tambahTransaksi);
muatData();
document.getElementById("tanggal").value = tanggalHariIni();
renderSemua();