# PROSES

## Persona dan masalahnya
Saya mendapat persona ibu rumah tangga. Ia mengatur uang belanja keluarga, tetapi sering kehabisan uang sebelum akhir bulan karena tidak tahu sisa tiap pos. Solusinya sistem amplop: uang dibagi ke pos-pos di awal bulan, dan pengeluaran mengurangi pos yang sesuai.

## Rancangan struktur data
Dua data disimpan di localStorage sebagai array objek (JSON.stringify / JSON.parse).

Kunci `transaksi`:
`{ id: 1739251200000, tanggal: "2026-10-19", jenis: "pengeluaran", kategori: "Belanja Dapur", nominal: 25000, catatan: "sayur" }`

Kunci `amplop`:
`{ id: 1, nama: "Belanja Dapur", jatah: 1500000 }`

Nominal disimpan sebagai angka, dan id unik memakai Date.now().

## Keputusan desain
Sisa amplop tidak disimpan, tetapi dihitung setiap kali dari jatah dikurangi total pengeluaran yang kategorinya sama dengan nama amplop (hitungSisaAmplop(), memakai filter dan reduce). Alasannya supaya sisa selalu cocok dengan data transaksi, termasuk setelah transaksi dihapus, dan tidak ada dua data yang harus disinkronkan.

## Bug dan kendala
1. **Push ke GitHub ditolak**
   - Gejala: `git push` gagal dengan pesan "rejected ... fetch first".
   - Penyebab: repo di GitHub sudah berisi file otomatis yang belum ada di laptop.
   - Cara mengatasi: `git pull origin main --allow-unrelated-histories` (menyimpan pesan merge di vim dengan `:wq`), lalu push lagi.

2. **GitHub Pages menampilkan README, bukan aplikasi**
   - Gejala: link Pages hanya menampilkan isi README.
   - Penyebab: `index.html` belum ada di root repo, jadi Pages menampilkan README.
   - Cara mengatasi: memastikan `index.html`, `style.css`, dan `app.js` berada di root repo lalu push ulang.

3. **Nominal di Riwayat tidak lurus**
   - Gejala: posisi nominal bergeser-geser tergantung panjang nama kategori.
   - Penyebab: baris memakai flex dengan justify-content: space-between, sehingga nominal diletakkan di tengah sisa ruang.
   - Cara mengatasi: mengganti dengan CSS grid tiga kolom (`1fr 130px auto`) dan nominal rata kanan.

4. **Kategori tidak sesuai jenis transaksi**
   - Gejala: "Listrik & Air" bisa tercatat sebagai pemasukan, padahal itu nama amplop.
   - Penyebab: dropdown kategori masih satu daftar tetap di HTML untuk semua jenis.
   - Cara mengatasi: mengisi kategori lewat JavaScript (`isiKategori()`): pengeluaran memakai nama amplop, pemasukan memakai daftar `KATEGORI_MASUK`, dan dipanggil setiap jenis berubah.