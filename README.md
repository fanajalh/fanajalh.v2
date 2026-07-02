# Fanajah Customer Web Portal 🌟

Website portal utama pelanggan **Fanajalah Design & PhotoStudio Mini** yang menyediakan katalog desain poster premium, deals of the day, sistem pembayaran QRIS instan yang aman, serta PhotoStudio Mini/Photobooth interaktif berbasis kamera web.

---

## 🚀 Teknologi yang Digunakan (Tech Stack)

- **Framework**: [Next.js](https://nextjs.org/) (App Router, React 18, TypeScript)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) & Vanilla CSS
- **Animasi**: [Framer Motion](https://www.framer.com/motion/) (transisi halaman & elemen interaktif)
- **Database**: PostgreSQL (Kueri instan via SQL helper)
- **Ikon**: [Lucide React](https://lucide.dev/)
- **Notifikasi**: [Sonner](https://setup.sonner.dev/)

---

## 📂 Struktur Direktori Proyek (Project Structure)

Berikut adalah struktur file dan folder pada proyek `fanajah`:

```bash
fanajah/
├── app/                        # Next.js App Router (Routing Halaman & API)
│   ├── 403/                    # Halaman Error Akses Dilarang
│   ├── 409/                    # Halaman Error Konflik Data
│   ├── api/                    # Backend API Routes (Serverless Functions)
│   │   ├── admin/              # Kueri internal untuk data portfolio & desain
│   │   ├── auth/               # Endpoint autentikasi user
│   │   ├── contact/            # Endpoint form kontak/saran
│   │   ├── frames/             # Endpoint manajemen frame photobooth
│   │   ├── payment/            # Endpoint pembuatan & konfirmasi pembayaran QRIS
│   │   │   ├── confirm/        # Konfirmasi mutasi pembayaran
│   │   │   └── create/         # Pembuatan transaksi & generator QRIS
│   │   ├── photobooth-share/   # API pemrosesan berkas share memori photobooth
│   │   ├── products/           # Endpoint penarikan data produk dinamis
│   │   ├── send-photobooth/    # API penyimpanan gambar photobooth hasil capture
│   │   └── website-settings/   # Endpoint penarikan config tampilan homepage
│   ├── forgot-password/        # Halaman lupa kata sandi
│   ├── frames/                 # Halaman pemilihan bingkai (frames) photobooth
│   ├── login/                  # Halaman masuk (login) user/pelanggan
│   ├── loginUser/              # Halaman alternatif login
│   ├── payment/                # Halaman checkout & instruksi pembayaran QRIS
│   ├── poster-portfolio/       # Halaman Creative Gallery (Katalog poster & filter)
│   ├── product/                # Folder routing dinamis detail produk
│   │   └── [slug]/             # Halaman detail produk (/product/nama-produk)
│   ├── reset-password/         # Halaman penyetelan ulang kata sandi
│   ├── server-error/           # Halaman penanganan error internal server (500)
│   ├── share/                  # Halaman berbagi foto photobooth (/share/id)
│   ├── studio/                 # Halaman interaktif studio webcam capture (Photobooth)
│   ├── globals.css             # Konfigurasi CSS global & variabel tema
│   ├── layout.tsx              # Wrapper layout utama aplikasi
│   └── page.tsx                # Landing page utama (Beranda)
├── components/                 # React Components (Reusable UI)
│   ├── sections/               # Komponen seksi visual homepage
│   │   ├── CountdownBanner.tsx # Banner hitung mundur promo (Slideshow & Lightbox)
│   │   ├── DealsOfDay.tsx      # Penawaran DoD dinamis dengan stok & persentase
│   │   ├── FeaturedCategories.tsx # Kategori pilihan dinamis & overflow fix
│   │   ├── FeaturedProducts.tsx # Grid katalog produk dengan label stok
│   │   ├── PhotoboothSection.tsx # Seksi CTA studio photobooth
│   │   └── ...
│   └── ui/                     # Komponen UI dasar (FadeIn, Buttons, dll.)
├── hooks/                      # Custom React Hooks
├── lib/                        # Konfigurasi utility, helper DB, & klien SQL
├── public/                     # Static assets (Gambar, Ikon, Bingkai, SVG)
├── tailwind.config.js          # Konfigurasi desain & breakpoint Tailwind CSS
├── tsconfig.json               # Konfigurasi TypeScript compiler
└── package.json                # Pengelola dependensi & script proyek
```

---

## 💻 Penjelasan Detail Halaman Depan (Frontend Pages)

### 1. Halaman Utama / Beranda (`app/page.tsx`)
- **Fitur**: Menampilkan navigasi utama, banner promosi dinamis, kategori produk terpopuler, galeri portofolio unggulan, serta seksi PhotoStudio Mini.
- **Dinamisasi**: Semua teks judul, diskon, dan countdown banner disinkronkan dari database lewat endpoint `/api/website-settings`.

### 2. Creative Gallery / Portofolio (`app/poster-portfolio/page.tsx`)
- **Fitur**: Katalog lengkap seluruh karya poster digital. Pelanggan dapat memfilter desain berdasarkan kategori ("Semua", "Event", "Bisnis", dll.) dan melakukan pencarian langsung.
- **Interaksi**: Klik pada kartu desain akan membuka **Detail Modal (Lynk.id Style)**. Modal ini menampilkan status stok saat ini, detail deskripsi, galeri thumbnail gambar jika produk memiliki banyak gambar (multi-cover), serta tombol instant checkout.

### 3. Detail Produk (`app/product/[slug]/page.tsx`)
- **Fitur**: Halaman detail khusus untuk satu produk/desain berbasis slug dinamis.
- **Visual**: Dilengkapi dengan list checklist kelengkapan (Canva Access, High-Res PDF, PSD), status stok aktual ("Stok Habis" dengan overlay gelap, "Sisa Sedikit", "Tersedia"), dan preview gambar slider bawah yang interaktif.

### 4. Halaman Pembayaran QRIS (`app/payment/page.tsx`)
- **Fitur**: Halaman formulir pengisian data pembeli (Nama, Email, No. WhatsApp) yang tersambung ke QRIS generator.
- **Sistem Keamanan**: Saat memuat produk, sistem akan melakukan pencocokan silang (cross-check) nama produk ke database untuk memverifikasi harga aslinya. Tindakan manipulasi parameter query URL seperti `price=10` pada produk seharga Rp 10.000 akan **ditolak & ditulis ulang secara otomatis** sesuai harga diskon resmi database.
- **QRIS Timer**: Terdapat hitung mundur (countdown 10 menit) untuk menyelesaikan pembayaran QRIS sebelum transaksi dianggap kedaluwarsa.

### 5. PhotoStudio Mini / Photobooth (`app/frames/page.tsx` & `app/studio/page.tsx`)
- **Fitur**: Simulasi photobooth digital interaktif. Pengguna memilih bingkai (frame) di `/frames` lalu diarahkan ke `/studio` untuk mengakses webcam, mengambil 4 jepretan foto otomatis, menggabungkannya ke dalam bingkai canvas, mengunduh hasil foto, dan membagikannya ke publik via `/share/[id]`.

---

## ⚙️ Penjelasan Detail API Backend (Backend API Routes)

Semua backend API diletakkan di bawah direktori `app/api/` dan berjalan sebagai serverless endpoints.

### 1. Produk (`app/api/products/route.ts`)
- **Method**: `GET`
- **Output**: List seluruh produk aktif, mencakup properti: `id`, `title`, `description`, `price_original`, `price_discount`, `image` (terpisah karakter pipe `|` jika banyak), `stock`, `items_sold`, dan `category_id`.

### 2. Tautan Pembayaran (`app/api/payment/create/route.ts`)
- **Method**: `POST`
- **Tugas**:
  1. Menerima data pembeli (`name`, `email`, `phone`) dan rincian produk (`title`, `packageId`).
  2. Melakukan kueri ulang ke database untuk memverifikasi harga produk sesungguhnya agar aman dari peretasan harga klien.
  3. Menghasilkan kode invoice unik berformat `FNT-XXXXXXXX`.
  4. Mengonversi nominal harga menjadi string standar QRIS.
  5. Memasukkan transaksi baru ke database orders.
  6. Mengembalikan payload QRIS & rincian order ke klien.

### 3. Pengaturan Konten (`app/api/website-settings/route.ts`)
- **Method**: `GET`
- **Output**: Memuat konfigurasi teks promosi, durasi countdown banner, link redirect tombol promo, serta daftar harga paket standar (`basic`, `professional`, `enterprise`).

### 4. Frame Photobooth (`app/api/frames/route.ts`)
- **Method**: `GET`
- **Output**: List url bingkai aktif beserta ukuran dimensi canvas untuk photobooth studio.

---

## 🔒 Sistem Keamanan & Kebijakan Checkout

1. **Anti URL-Tampering (Bebas Manipulasi Harga)**
   Pembayaran tidak mempercayai data harga dari frontend. Nominal pembayaran QRIS dihitung & divalidasi langsung di server sisi backend menggunakan nilai `price_discount` resmi dari tabel database.
2. **Tanpa Potongan Nominal Unik Suffix**
   Pembayaran disetel persis sesuai harga yang tertera tanpa menambahkan nominal unik Rp 1 - Rp 99 di belakangnya, memberikan kemudahan bagi pembeli untuk membayar dengan nominal bulat yang tepat.
3. **Pemisah Gambar Karakter Pipe `|`**
   Untuk mendukung multi-gambar berformat Base64 (yang memiliki koma bawaan seperti `data:image/png;base64,`), sistem menyimpan dan memisahkan gambar cover menggunakan tanda pipa `|` (misal: `gambar1.png|gambar2.png|data:image/png;base64,...`).

---

## 🛠️ Langkah Menjalankan Aplikasi Secara Lokal (Development Setup)

1. **Instalasi Dependensi**:
   ```bash
   npm install
   ```

2. **Pengaturan Variabel Lingkungan**:
   Buat file `.env` di folder root dan isi dengan kredensial database Anda:
   ```env
   POSTGRES_URL="postgresql://username:password@localhost:5432/dbname"
   ```

3. **Menjalankan Dev Server**:
   ```bash
   npm run dev
   ```
   Aplikasi akan berjalan pada alamat [http://localhost:3000](http://localhost:3000).

4. **Pemeriksaan Tipe Kode**:
   ```bash
   npx tsc --noEmit
   ```