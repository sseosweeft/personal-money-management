# AI-LOG

AI yang dipakai: Claude. Kode awal aplikasi dibuat dengan bantuan AI, lalu saya coba di browser, baca, dan ubah sebagian sesuai kebutuhan persona saya.

## 1. Kerangka aplikasi W1-W3 (form, daftar, hapus)
- Prompt: minta aplikasi pencatat keuangan HTML/CSS/JS murni untuk persona ibu rumah tangga dengan fitur amplop, dipecah per tahap commit.
- Dipakai: index.html, style.css, app.js; fungsi tambahTransaksi(), renderDaftar(), hapusTransaksi(), formatRupiah().
- Diubah: judul menjadi "Dompet Ibu" dan tagline "Catat pemasukan dan pengeluaranmu dengan rapi"; menambah kategori pemasukan "Jatah Bulanan dari Suami" sesuai persona.

## 2. Tema warna ungu
- Prompt: minta tema warna diganti menjadi ungu.
- Dipakai: variabel warna di :root pada style.css.
- Diubah: tidak mengubah kode; hasil dicek di browser dan dipakai.

## 3. Perataan kolom nominal di Riwayat
- Prompt: menanyakan kenapa nominal di daftar riwayat tidak lurus (dengan screenshot).
- Dipakai: li memakai display: grid dengan grid-template-columns: 1fr 130px auto, nominal rata kanan.
- Diubah: tidak ada; hasil dicek dengan menambah beberapa transaksi.

## 4. W4 localStorage
- Prompt: minta fungsi untuk menyimpan dan memuat data dari localStorage.
- Dipakai: muatData() (JSON.parse) dan simpanData() (JSON.stringify); simpanData() dipanggil setelah tambah dan hapus.
- Diubah: tidak ada; diuji dengan refresh dan menutup tab, data tetap ada.

## 5. W5-W6 ringkasan dan validasi
- Prompt: minta ringkasan total pemasukan, pengeluaran, saldo, serta validasi form dengan pesan error di halaman.
- Dipakai: hitungRingkasan(), renderRingkasan(), renderSemua(), tampilkanError(), blok validasi di tambahTransaksi().
- Diubah: tidak ada; diuji dengan tanggal kosong, nominal kosong, dan nominal 0.

## 6. Fitur khas amplop  
- Prompt: minta fitur amplop: jatah per amplop, tambah amplop baru, pengeluaran mengurangi amplop, sisa tampil, amplop habis ditandai.
- Dipakai: hitungSisaAmplop(), renderAmplop(), ubahJatah(), tambahAmplop(), isiKategori().
- Diubah: KATEGORI_MASUK diganti "Jatah Bulanan dari Suami" (cek app.js, hapus kalimat ini jika tidak diubah).

## 7. Bonus filter kategori 
- Prompt: minta filter riwayat berdasarkan kategori.
- Dipakai: isiFilter() dan filter di renderDaftar().
- Diubah: tidak ada.

## 8. Bonus ekspor dan impor JSON 
- Prompt: minta fitur ekspor data ke file JSON dan impor kembali sebagai backup.
- Dipakai: eksporData() (Blob dan createObjectURL) dan imporData() (FileReader, JSON.parse, cek Array.isArray).
- Diubah: tidak ada; diuji dengan ekspor, hapus semua transaksi, lalu impor kembali.