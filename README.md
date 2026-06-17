# Erdinus Portfolio App

Web app portofolio personal dengan admin panel. Bisa tambah/edit/hapus profil, project, skill, pengalaman, dan membaca pesan kontak.

## Fitur

- Landing page portofolio profesional
- Admin login via Supabase Auth
- CRUD Project
- CRUD Skill
- CRUD Pengalaman
- Edit profil, kontak, dan social link
- Form kontak masuk ke tabel `messages`
- Fallback mode lokal kalau Supabase belum dikonfigurasi
- Siap deploy ke Vercel tanpa proses build berat

## Struktur File

```text
index.html
styles.css
app.js
config.js
vercel.json
supabase/schema.sql
README.md
```

## Setup Supabase

1. Buat project baru di Supabase.
2. Buka SQL Editor.
3. Jalankan file `supabase/schema.sql`.
4. Buka Authentication → Users.
5. Tambahkan user admin dengan email dan password kamu.
6. Buka Project Settings → API.
7. Copy Project URL dan anon public key.
8. Buka `config.js`, lalu isi:

```js
export const SUPABASE_URL = 'https://xxxx.supabase.co';
export const SUPABASE_ANON_KEY = 'ey...';
```

Anon key boleh tampil di frontend. Yang penting RLS di SQL tetap aktif.

## Deploy ke Vercel

1. Upload folder ini ke GitHub.
2. Buka Vercel → Add New Project.
3. Import repository.
4. Framework preset: Other.
5. Build command: kosongkan.
6. Output directory: kosongkan.
7. Deploy.

## Cara Pakai Admin

1. Buka website.
2. Klik tombol `Admin`.
3. Login pakai akun yang dibuat di Supabase Authentication.
4. Edit profil, project, skill, dan pengalaman.

## Catatan Keamanan

- Jangan matikan Row Level Security.
- Jangan pakai service role key di frontend.
- Anon key boleh dipakai di frontend karena aksesnya dibatasi oleh RLS.
- Kalau nanti ingin multi-admin atau role khusus, tambahkan tabel `admin_users` dan policy berdasarkan `auth.uid()`.

## Pengembangan Lanjutan yang Disarankan

- Upload gambar project ke Supabase Storage.
- Tambah halaman CV/resume download PDF.
- Tambah blog personal.
- Tambah custom domain.
- Tambah analytics ringan.
