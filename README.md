# Dompet Ibu - ETS Pemrograman Web: Personal Money Management

**Nama:** Rokhmatul Ilma Khanifa
**NRP:** 5053251001
**Persona:** 4 - Ibu rumah tangga

**Link GitHub Pages:** https://sseosweeft.github.io/personal-money-management/

## Persona dan masalahnya
Ibu rumah tangga yang mengatur uang belanja keluarga. Masalahnya, uang sering habis sebelum akhir bulan karena tidak jelas berapa sisa tiap pos (dapur, listrik dan air, anak dan sekolah, transportasi), sehingga pengeluaran satu pos mudah menggerus pos lain. Aplikasi ini membagi uang ke beberapa amplop dan menunjukkan sisa tiap amplop.

## Fitur yang selesai
**Fitur wajib**
- [x] W1 Tambah transaksi (tanggal, jenis, kategori, nominal, catatan)
- [x] W2 Daftar transaksi dirender dari array JavaScript, terbaru di atas, format Rupiah
- [x] W3 Hapus transaksi dengan konfirmasi
- [x] W4 Data persisten dengan localStorage
- [x] W5 Ringkasan pemasukan, pengeluaran, dan saldo
- [x] W6 Validasi form dengan pesan error di halaman

**Fitur khas persona (amplop belanja)**
- [x] 4 amplop: Belanja Dapur, Listrik & Air, Anak & Sekolah, Transportasi
- [x] Jatah tiap amplop bisa diatur
- [x] Tambah amplop baru (nama dan jatah)
- [x] Pengeluaran mengurangi amplop terkait
- [x] Sisa tiap amplop tampil, amplop yang habis ditandai merah "HABIS"

**Bonus**
- [x] Filter riwayat berdasarkan kategori
- [x] Tampilan responsif untuk layar HP
- [x] Ekspor dan impor data JSON (backup)

## Fitur yang belum selesai
- Edit transaksi yang sudah tersimpan
- Budget per kategori dengan peringatan

## Catatan
Sisa amplop dihitung dari jatah dikurangi semua pengeluaran berkategori sama yang tercatat (belum dibatasi per bulan).

## Struktur file
`index.html`, `style.css`, `app.js`, `README.md`, `AI-LOG.md`, `PROSES.md`