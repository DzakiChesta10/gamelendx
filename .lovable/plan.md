# Rencana: Dokumen Penjelasan GameLendX (PDF)

Membuat satu file PDF berbahasa Indonesia yang bisa diunduh dan dipakai saat presentasi/demo. Output disimpan ke `/mnt/documents/gamelendx-penjelasan.pdf` dengan tampilan rapi (cover, heading, bullet, tabel), lalu di-QA halaman per halaman sebagai gambar sebelum diserahkan.

## Isi dokumen

1. **Cover**
   - Judul: "GameLendX — Platform Penyewaan Aset Game Berbasis Blockchain Solana"
   - Subjudul: Panduan Penggunaan & Penjelasan Teknologi
   - Tanggal & label "Materi Presentasi"

2. **Ringkasan Singkat**
   - Apa itu GameLendX (marketplace sewa aset game on-chain di jaringan Solana)
   - Masalah yang diselesaikan (aset game mahal, idle, sulit dipinjamkan secara aman)

3. **Sasaran Pengguna (Untuk Siapa?)**
   - Gamer kasual yang ingin mencoba item langka tanpa membeli
   - Pemilik aset / kolektor NFT game yang ingin memonetisasi item idle
   - Komunitas Web3 gaming & developer game blockchain
   - Investor / pengamat ekosistem GameFi

4. **Peran Pengguna di Aplikasi**
   - **User (Penyewa)**: telusuri katalog, sewa aset, kelola sewa aktif, lihat riwayat
   - **Admin (Pengelola Platform)**: kelola katalog game (tambah/edit/hapus), pantau seluruh transaksi sewa, lihat siapa menyewa apa & berapa lama

5. **Cara Menggunakan — User**
   Langkah bernomor:
   1. Buka halaman login → pilih "Masuk sebagai User" → klik Sign In (kredensial demo terisi otomatis)
   2. Hubungkan wallet Solana (mode demo, tanpa install Phantom)
   3. Buka **Catalog**, filter berdasarkan game/rarity
   4. Klik **RENT**, pilih durasi (jam/hari), konfirmasi transaksi
   5. Pantau sewa di halaman **My Rentals**, lihat sisa waktu
   6. Setelah selesai, sewa pindah ke **History**

6. **Cara Menggunakan — Admin**
   1. Login → pilih "Masuk sebagai Admin" → Sign In
   2. Masuk dashboard **Admin** → lihat KPI (total sewa aktif, pendapatan, dll.)
   3. Tab **OPERATIONS**: lihat daftar sewa — siapa penyewa, game apa, aset apa, durasi, biaya, waktu mulai, sisa waktu
   4. Tab **MANAGE GAMES**: tambah game baru, edit detail (nama, rarity, harga/hari, gambar), atau hapus
   5. Pantau aktivitas on-chain via tabel transaksi

7. **Transaksi yang Tersedia di Blockchain**
   Tabel ringkas:
   | Transaksi | Pemicu | Yang Tercatat On-Chain |
   |---|---|---|
   | Connect Wallet | User membuka aplikasi | Public key Solana |
   | Approve Token (GAME SPL) | Saat menyewa | Persetujuan pembayaran |
   | Rent Asset | Konfirmasi sewa | Aset, durasi, biaya, penyewa, signature |
   | Return / Expire | Otomatis saat durasi habis | Status pengembalian aset |
   | Admin Mutation (opsional) | Tambah/edit aset | Metadata aset |

8. **Keunggulan Teknologi Blockchain (Solana)**
   - **Transparansi**: setiap sewa punya signature yang bisa diverifikasi
   - **Kecepatan**: Solana memproses ribuan TPS, biaya gas sangat rendah (~$0.00025)
   - **Keamanan kepemilikan**: aset tetap milik pemilik, hanya hak pakai yang berpindah sementara
   - **Tanpa perantara**: smart contract menjamin pengembalian otomatis saat durasi habis
   - **Programmable money**: pembayaran SPL token otomatis & terjadwal
   - **Interoperabilitas**: aset bisa dipakai lintas game yang mendukung standar SPL/NFT

9. **Penutup**
   - Rangkuman manfaat untuk user, admin, dan ekosistem
   - Catatan: implementasi saat ini adalah **demo wallet** (tanpa Phantom asli) untuk keperluan presentasi

## Detail Teknis Pembuatan

- Tools: Python + `reportlab` (Platypus) untuk layout multi-halaman, tabel, dan heading
- Warna mengikuti tema cyber/neon GameLendX (aksen ungu/cyan pada heading, body hitam pada background putih agar mudah dicetak)
- Font: Helvetica (bawaan reportlab, aman tanpa font tambahan)
- Tidak ada karakter sub/superscript Unicode
- Output: `/mnt/documents/gamelendx-penjelasan.pdf`
- **QA**: render setiap halaman ke JPG via `pdftoppm`, inspeksi visual (overflow, overlap, margin), perbaiki jika perlu, baru kirim
- Tag `<presentation-artifact>` disertakan agar user bisa langsung unduh

## Yang TIDAK dilakukan
- Tidak mengubah kode aplikasi (`src/`)
- Tidak menambah halaman web baru
- Tidak membuat slide PPTX
