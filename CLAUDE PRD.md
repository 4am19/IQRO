# Product Requirements Document (PRD) & Software Requirements Specification (SRS)
**Nama Produk:** Aplikasi Web Pintar Hijaiyah  
**Target Platform:** Web Application (Mobile-First Responsive)  
**Tech Stack:** React.js, Inertia.js, Laravel (PHP), MySQL  
**Versi Dokumen:** 1.0  

---

## 1. Pendahuluan
Aplikasi Pintar Hijaiyah dirancang sebagai platform edukasi interaktif untuk anak-anak dalam belajar huruf Hijaiyah. Sistem menggabungkan modul pembelajaran visual-audio dengan evaluasi berbasis gamifikasi (mencocokkan, menebalkan, menyusun kata). Sistem juga dilengkapi *dashboard* analitik untuk orang tua guna memantau progres belajar anak secara *real-time*.

## 2. Arsitektur Sistem & Standar Clean Code (Enterprise-Grade)
Pengembangan aplikasi mematuhi standar *clean architecture* untuk memastikan skalabilitas dan kemudahan *maintenance*:

### 2.1 Pola Arsitektur (Backend - Laravel)
* **Service-Repository Pattern:** Memisahkan *business logic* (Service) dari operasi *database* (Repository). *Controller* bertugas secara eksklusif untuk merutekan *request* dan memformat *response* via Inertia.
* **Form Requests:** Seluruh validasi data dan otorisasi *payload* ditangani di *Form Request classes*, menjaga *Controller* tetap ramping.
* **API/Inertia Resources:** Standarisasi format pengiriman data menggunakan Eloquent API Resources untuk menjaga konsistensi struktur JSON yang diterima oleh *frontend*.

### 2.2 Pola Arsitektur (Frontend - React & Inertia)
* **Atomic Design:** Pemisahan komponen UI secara modular:
  * *Atoms:* Tombol, *input field*, ikon suara.
  * *Molecules:* Kartu huruf, baris status nyawa/skor.
  * *Organisms:* *Header* navigasi, area *drag-and-drop*, *canvas board*.
  * *Pages:* Halaman utama yang di- *render* oleh Inertia.
* **Custom Hooks:** Ekstraksi *logic* yang berulang (contoh: `useAudioPlayer`, `useTracingCanvas`, `useGameEngine`) agar komponen antarmuka tetap bersih dan berfokus pada presentasi.

### 2.3 Infrastruktur & Skalabilitas
* Dirancang dengan pendekatan *stateless* pada *layer backend*, memungkinkan aplikasi untuk di-*deploy* ke infrastruktur *cloud* yang modern secara efisien, serta siap menghadapi eskalasi beban trafik dari ribuan pengguna simultan.

## 3. Alur Pengguna (User Flow)
1. **Autentikasi:** Orang tua melakukan registrasi/login dan membuat entitas profil anak.
2. **Dashboard Navigasi:** Pemilihan modul pembelajaran atau arena bermain.
3. **Sesi Belajar (Jilid & Level):** * Sistem memuat modul dasar (Jilid 1).
   * Pengguna mendengarkan pelafalan audio (*Text-to-Speech* atau rekaman asli) dan melihat visualisasi kata.
4. **Sesi Evaluasi (Gamifikasi):**
   * Pengguna menyelesaikan tantangan spesifik di setiap level.
   * *Threshold Gate:* Jika skor memenuhi batas minimal kelulusan, *flag* `is_unlocked` untuk jilid berikutnya diperbarui menjadi `true`.
5. **Pelaporan Analitik:** Progres skor dikirim secara asinkronus ke *backend* dan disajikan dalam bentuk metrik visual di *Dashboard* Orang Tua.

## 4. Kebutuhan Fungsional (Functional Requirements)

| Fitur Utama | Spesifikasi Teknis & Logika |
| :--- | :--- |
| **Sistem Autentikasi** | Menggunakan Laravel Breeze terintegrasi Inertia/React. Mengadopsi arsitektur *multi-tenant* sederhana di mana satu akun Orang Tua (*Parent*) menaungi banyak profil Anak (*Student*). |
| **Modul Belajar** | Komponen UI reaktif yang memicu HTML5 Audio API. Aset statis dikelola dan dilayani secara terpusat untuk efisiensi *bandwidth*. |
| **Game Pilihan Ganda** | Algoritma pengacakan soal di *backend*. Validasi interaksi ditangani di *client-side* untuk performa instan, namun verifikasi skor final dilakukan di *server-side* sebelum masuk ke *database*. |
| **Game Tracing (Menebalkan)** | Integrasi HTML5 `<canvas>`. Perekaman koordinat *pointer/touch events* secara berkesinambungan dan membandingkan *path* area coretan dengan *bounding box* huruf yang benar. |
| **Game Drag & Drop** | Mengimplementasikan sistem *drag-and-drop* yang sensitif terhadap interaksi sentuh (seperti `dnd-kit`). Validasi membandingkan *array index* target dengan *array index source*. |
| **Gating & Leveling System** | *Middleware* atau *Policy* di Laravel yang memblokir akses *routing* ke suatu jilid jika rekam jejak pada tabel `student_progress` belum memenuhi syarat skor. |

## 5. Struktur Database Relasional (MySQL Schema ERD)
Skema dinormalisasi untuk menjaga integritas data dan performa *query*:

* `users`: Akun utama/Orang tua (id, name, email, password, timestamps).
* `students`: Profil sub-akun (id, user_id, name, avatar_url, total_score).
* `volumes`: Data jilid utama (id, title, description, order_sequence).
* `levels`: Detail level per jilid (id, volume_id, title, game_type, minimum_passing_score).
* `letters`: Master data huruf (id, char_arabic, read_latin, pronunciation_desc, audio_path, example_word, example_image_path).
* `student_progress`: *Pivot table* status (student_id, level_id, is_completed, highest_score).
* `game_histories`: Log analitik (id, student_id, level_id, score_achieved, duration_seconds, played_at).

## 6. Kebutuhan Non-Fungsional (Non-Functional Requirements)
* **User Experience (UX) & Antarmuka:** Tata letak berpedoman pada fondasi desain UX yang berpusat pada pengguna (*user-centric*). Elemen interaktif diprioritaskan berukuran besar (minimal area sentuh 48x48px), hierarki visual yang jelas, serta transisi antar halaman yang halus untuk meminimalkan *cognitive load* pada anak-anak.
* **Performa & Optimasi:** Kompresi aset gambar ke format modern (WebP/AVIF). Mekanisme *lazy loading* untuk aset non-kritis dan *preloading* untuk aset audio.
* **Keamanan:** Proteksi CSRF (bawaan Laravel), *Prepared Statements* (bawaan Eloquent) untuk menghindari SQL Injection, dan sanitasi ketat pada *input payload* untuk mencegah kerentanan XSS.