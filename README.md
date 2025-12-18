# DAVID_AI_REVISI — Panduan Singkat (Bahasa Indonesia)

Panduan singkat ini dibuat agar siapapun (termasuk non-teknis) bisa menjalankan dan men-deploy proyek ini.

---

## 1) Apa yang perlu disiapkan
- Node.js (versi 18 atau lebih baru) 
- Git

## 2) Cara install (di komputer Anda)
1. Buka terminal di folder proyek, lalu jalankan:
   ```bash
   npm install
   ```
2. Salin file contoh `.env.example` menjadi `.env` dan isi kunci Gemini Anda:
   ```text
   VITE_GEMINI_API_KEY=ISIKAN_API_KEY_ANDA_DI_SINI
   ```
   **Penting:** jangan upload/commit file `.env` ke GitHub — file ini sudah ada di `.gitignore`.

## 3) Cara menjalankan aplikasi secara lokal
1. Jalankan:
   ```bash
   npm run dev
   ```
2. Buka browser ke: http://localhost:3000

## 4) Cara membuat versi produksi (build)
1. Jalankan:
   ```bash
   npm run build
   ```
2. Hasil build ada di folder `dist/`.
3. Untuk melihat hasil build secara lokal:
   ```bash
   npm run preview
   ```

## 5) Cara deploy ke GitHub Pages (otomatis)
Proyek ini sudah punya workflow GitHub Actions yang otomatis membangun dan mem-publish folder `dist/` ke branch `gh-pages`.

Langkah singkat:
1. Buat Personal Access Token (PAT) di GitHub dengan izin `repo` dan `workflow`.
2. Di GitHub → repository Anda → Settings → Secrets and variables → Actions, tambahkan secret:
   - `GH_PAGES_TOKEN` = (isi dengan PAT Anda)
   - `VITE_GEMINI_API_KEY` = (isi kalau mau dipakai waktu build di GitHub)
3. Pastikan `vite.config.ts` punya `base: '/DAVID_AI_REVISI/'` supaya path cocok di GitHub Pages.
4. Push ke branch `main` → workflow akan jalan otomatis. Jika berhasil, situs akan muncul di:
   `https://frgwnabim.github.io/DAVID_AI_REVISI/`

Jika langkah Deploy gagal, buka tab **Actions** di GitHub, pilih run terbaru, lalu buka log langkah **Deploy** untuk melihat pesan kesalahan (biasanya terkait izin/token).

## 6) Hal penting tentang keamanan (bahasa gampang)
- Kunci yang dimulai dengan `VITE_` akan dimasukkan ke file aplikasi yang bisa dilihat publik saat build. Jadi: **jangan** masukkan kunci sensitif yang harus dirahasiakan di sini. Jika kunci sangat rahasia, gunakan server/backend untuk menyimpan kunci dan memanggil API dari sana.

## 7) Lokasi kode yang penting
- Tempat pemanggilan Gemini: `services/geminiService.ts`
- Konfigurasi Vite dan `base`: `vite.config.ts`
- Workflow deploy: `.github/workflows/gh-pages.yml`
- Tipe env untuk TypeScript: `env.d.ts`

---

Kalau mau, saya bisa bantu satu per satu: membuat secret di repo, mengubah workflow supaya pakai `GH_PAGES_TOKEN`, atau mengecek log Actions jika deploy gagal. Mau saya bantu yang mana?