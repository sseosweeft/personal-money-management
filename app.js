const KUNCI_TRANSAKSI = "transaksi";
const KUNCI_AMPLOP = "amplop";
const AMPLOP_AWAL = [
  { id: 1, nama: "Belanja Dapur", jatah: 1500000 },
  { id: 2, nama: "Listrik & Air", jatah: 500000 },
  { id: 3, nama: "Anak & Sekolah", jatah: 700000 },
  { id: 4, nama: "Transportasi", jatah: 300000 }
];
const KATEGORI_MASUK = ["Jatah Bulanan dari Suami", "Gaji", "Lainnya"];

let transaksi = [];
let amplop = [];

const elJenis = document.getElementById("jenis");
const elKategori = document.getElementById("kategori");
const elFilter = document.getElementById("filterKategori");
const elError = document.getElementById("pesanError");
const elErrorAmplop = document.getElementById("pesanErrorAmplop");

function formatRupiah(angka) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency", currency: "IDR", maximumFractionDigits: 0
  }).format(angka);
}

function tanggalHariIni() {
  const lokal = new Date(Date.now() - new Date().getTimezoneOffset() * 60000);
  return lokal.toISOString().slice(0, 10);
}

// ---------- Data ----------
function muatData() {
  try {
    transaksi = JSON.parse(localStorage.getItem(KUNCI_TRANSAKSI)) || [];
    amplop = JSON.parse(localStorage.getItem(KUNCI_AMPLOP)) || AMPLOP_AWAL.map(a => ({ ...a }));
  } catch (e) {
    transaksi = [];
    amplop = AMPLOP_AWAL.map(a => ({ ...a }));
  }
}

function simpanData() {
  localStorage.setItem(KUNCI_TRANSAKSI, JSON.stringify(transaksi));
  localStorage.setItem(KUNCI_AMPLOP, JSON.stringify(amplop));
}

// ---------- Perhitungan ----------
function hitungRingkasan() {
  const masuk = transaksi.filter(t => t.jenis === "pemasukan").reduce((n, t) => n + t.nominal, 0);
  const keluar = transaksi.filter(t => t.jenis === "pengeluaran").reduce((n, t) => n + t.nominal, 0);
  return { masuk, keluar, saldo: masuk - keluar };
}

// sisa amplop = jatah - total pengeluaran dengan kategori yang sama dengan nama amplop
function hitungSisaAmplop(a) {
  const terpakai = transaksi
    .filter(t => t.jenis === "pengeluaran" && t.kategori === a.nama)
    .reduce((n, t) => n + t.nominal, 0);
  return a.jatah - terpakai;
}

// ---------- Tampilan ----------
function buatEl(tag, teks, kelas) {
  const e = document.createElement(tag);
  if (teks !== undefined) e.textContent = teks;
  if (kelas) e.className = kelas;
  return e;
}

function renderRingkasan() {
  const r = hitungRingkasan();
  document.getElementById("totalMasuk").textContent = formatRupiah(r.masuk);
  document.getElementById("totalKeluar").textContent = formatRupiah(r.keluar);
  document.getElementById("saldo").textContent = formatRupiah(r.saldo);
}

function renderAmplop() {
  const wadah = document.getElementById("daftarAmplop");
  wadah.innerHTML = "";
  amplop.forEach(a => {
    const sisa = hitungSisaAmplop(a);
    const habis = sisa <= 0;
    const persen = a.jatah > 0 ? Math.max(0, Math.min(100, (sisa / a.jatah) * 100)) : 0;

    const kartu = buatEl("article", undefined, habis ? "amplop habis" : "amplop");
    if (habis) kartu.appendChild(buatEl("span", "HABIS", "lencana"));
    kartu.appendChild(buatEl("h3", a.nama));
    kartu.appendChild(buatEl("div", formatRupiah(sisa), "sisa"));

    const bar = buatEl("div", undefined, "bar");
    const isi = document.createElement("i");
    isi.style.width = persen + "%";
    bar.appendChild(isi);
    kartu.appendChild(bar);

    const label = buatEl("label", "Jatah awal bulan (Rp)");
    const input = document.createElement("input");
    input.type = "number";
    input.min = "0";
    input.value = a.jatah;
    input.addEventListener("change", () => ubahJatah(a.id, input.value));
    label.appendChild(input);
    kartu.appendChild(label);

    wadah.appendChild(kartu);
  });
}

function renderDaftar() {
  const daftar = document.getElementById("daftarTransaksi");
  daftar.innerHTML = "";
  const filter = elFilter.value;
  const tampil = transaksi
    .filter(t => !filter || t.kategori === filter)
    .sort((a, b) => b.tanggal.localeCompare(a.tanggal) || b.id - a.id);

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

function isiKategori() {
  const pilihan = elJenis.value === "pengeluaran" ? amplop.map(a => a.nama) : KATEGORI_MASUK;
  elKategori.innerHTML = "";
  pilihan.forEach(nama => elKategori.appendChild(new Option(nama, nama)));
}

function isiFilter() {
  const semua = [...amplop.map(a => a.nama), ...KATEGORI_MASUK];
  elFilter.innerHTML = "";
  elFilter.appendChild(new Option("Semua kategori", ""));
  semua.forEach(nama => elFilter.appendChild(new Option(nama, nama)));
}

function renderSemua() {
  renderRingkasan();
  renderAmplop();
  renderDaftar();
}

// ---------- Aksi pengguna ----------
function tampilkanError(pesan) {
  elError.textContent = pesan;
}

function tambahTransaksi(event) {
  event.preventDefault();
  const tanggal = document.getElementById("tanggal").value;
  const nominal = Number(document.getElementById("nominal").value);
  const kategori = elKategori.value;
  const inputNominal = document.getElementById("nominal");
  inputNominal.classList.remove("salah");

  if (!tanggal || !kategori) {
    tampilkanError("Tanggal dan kategori wajib diisi.");
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
    jenis: elJenis.value,
    kategori: kategori,
    nominal: nominal,
    catatan: document.getElementById("catatan").value.trim()
  });
  simpanData();
  inputNominal.value = "";
  document.getElementById("catatan").value = "";
  renderSemua();
}

function hapusTransaksi(id) {
  if (!confirm("Hapus transaksi ini?")) return;
  transaksi = transaksi.filter(t => t.id !== id);
  simpanData();
  renderSemua();
}

function ubahJatah(id, nilaiBaru) {
  const jatah = Number(nilaiBaru);
  if (nilaiBaru === "" || jatah < 0) {
    tampilkanError("Jatah amplop tidak boleh kosong atau negatif.");
    renderAmplop();
    return;
  }
  tampilkanError("");
  amplop.find(a => a.id === id).jatah = jatah;
  simpanData();
  renderSemua();
}

// ---------- Bonus: ekspor dan impor JSON ----------
function eksporData() {
  const isi = JSON.stringify({ transaksi: transaksi, amplop: amplop }, null, 2);
  const url = URL.createObjectURL(new Blob([isi], { type: "application/json" }));
  const tautan = document.createElement("a");
  tautan.href = url;
  tautan.download = "dompet-ibu-backup.json";
  tautan.click();
  URL.revokeObjectURL(url);
}

function imporData(event) {
  const file = event.target.files[0];
  if (!file) return;
  const pembaca = new FileReader();
  pembaca.onload = () => {
    try {
      const data = JSON.parse(pembaca.result);
      if (!Array.isArray(data.transaksi) || !Array.isArray(data.amplop)) {
        throw new Error("format salah");
      }
      transaksi = data.transaksi;
      amplop = data.amplop;
      simpanData();
      tampilkanError("");
      isiKategori();
      isiFilter();
      renderSemua();
    } catch (e) {
      tampilkanError("File tidak valid. Pilih file JSON hasil ekspor aplikasi ini.");
    }
  };
  pembaca.readAsText(file);
  event.target.value = "";
}

// Tambah amplop baru
function tambahAmplop(event) {
  event.preventDefault();
  const nama = document.getElementById("namaAmplop").value.trim();
  const isiJatah = document.getElementById("jatahAmplop").value;
  const namaSama = n => n.toLowerCase() === nama.toLowerCase();
  const sudahAda = amplop.some(a => namaSama(a.nama)) || KATEGORI_MASUK.some(namaSama);

  if (!nama) {
    elErrorAmplop.textContent = "Nama amplop wajib diisi.";
    return;
  }
  if (sudahAda) {
    elErrorAmplop.textContent = "Nama amplop sudah dipakai.";
    return;
  }
  if (isiJatah === "" || Number(isiJatah) < 0) {
    elErrorAmplop.textContent = "Jatah harus diisi dan tidak boleh negatif.";
    return;
  }
  elErrorAmplop.textContent = "";

  amplop.push({ id: Date.now(), nama: nama, jatah: Number(isiJatah) });
  simpanData();
  document.getElementById("namaAmplop").value = "";
  document.getElementById("jatahAmplop").value = "";
  isiKategori();
  isiFilter();
  renderSemua();
}

// ---------- Mulai ----------
document.getElementById("formTransaksi").addEventListener("submit", tambahTransaksi);
document.getElementById("formAmplop").addEventListener("submit", tambahAmplop);
elJenis.addEventListener("change", isiKategori);
elFilter.addEventListener("change", renderDaftar);
document.getElementById("btnEkspor").addEventListener("click", eksporData);
document.getElementById("btnImpor").addEventListener("click", () => document.getElementById("fileImpor").click());
document.getElementById("fileImpor").addEventListener("change", imporData);

muatData();
document.getElementById("tanggal").value = tanggalHariIni();
isiKategori();
isiFilter();
renderSemua();