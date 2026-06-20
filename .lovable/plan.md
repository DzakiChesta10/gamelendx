## Rencana: Fitur "Lupa Password" untuk Admin (Email Default Lovable)

### Tujuan
Admin atau user yang lupa password bisa meminta link reset password lewat email, lalu membuat password baru melalui halaman khusus.

### Yang akan dikerjakan

1. **Tambah tab/link "Forgot Password" di halaman /auth**
   - Di tab Login, tambahkan link kecil "Forgot password?".
   - Klik link akan membuka tab/form khusus untuk memasukkan email.
   - Form memanggil `supabase.auth.resetPasswordForEmail(email, { redirectTo: window.location.origin + '/reset-password' })`.
   - Tampilkan toast sukses/error setelah submit.

2. **Buat halaman /reset-password baru**
   - Route ini bersifat publik (tidak di dalam ProtectedRoute).
   - Saat halaman dibuka, cek URL hash untuk parameter `type=recovery` (token recovery dari Supabase).
   - Jika token recovery ada, tampilkan form "New Password" + "Confirm Password".
   - Saat submit, panggil `supabase.auth.updateUser({ password })`.
   - Setelah sukses, arahkan user ke `/auth` untuk login dengan password baru.
   - Jika token tidak valid/hilang, tampilkan pesan error + tombol kembali ke /auth.

3. **Daftarkan route di src/App.tsx**
   - Tambahkan `<Route path="/reset-password" element={<ResetPassword />} />` di luar `<ProtectedRoute>`.

4. **(Opsional tapi disarankan) Aktifkan HIBP password check**
   - Melindungi dari password yang bocor/sering digunakan.
   - Hanya perlu konfigurasi auth, tanpa mengubah UI.

### File yang akan diubah
- `src/pages/Auth.tsx` — tambah form "Forgot Password".
- `src/pages/ResetPassword.tsx` — halaman baru.
- `src/App.tsx` — daftarkan route /reset-password.

### Catatan keamanan
- Password lama tidak bisa dilihat/dicek; hanya bisa di-reset.
- Link recovery di email memiliki masa aktif terbatas dan hanya bisa dipakai sekali.
- Email reset password dikirim otomatis oleh Lovable auth default tanpa perlu domain khusus.

### Setelah di-approve
- Saya akan implementasi langsung dan uji flow di preview.