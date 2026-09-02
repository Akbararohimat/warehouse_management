# Warehouse Management Dashboard RnD

Project **Warehouse Management Dashboard RnD** untuk mengelola data Contact, Product, Vendor/Principal, Request Sales, dan Sales Ticket.

Project terdiri dari:

* **Frontend** → Next.js + TypeScript
* **Backend** → Node.js + Express + TypeScript
* **Database** → PostgreSQL
* **ORM** → Prisma

---

## 1. Clone Project

Clone repository dari GitHub:

```bash
git clone <LINK_REPOSITORY>
```

Masuk ke folder project:

```bash
cd warehouse-management
```

---

# 2. Setup Frontend

Install dependency frontend:

```bash
npm install
```

---

# 3. Setup Backend

Masuk ke folder backend:

```bash
cd backend
```

Install dependency:

```bash
npm install
```

---

# 4. Setup PostgreSQL

Pastikan PostgreSQL sudah terinstall dan sedang berjalan.

Buat database baru, misalnya:

```text
warehouse_management
```

Database ini akan digunakan oleh backend.

---

# 5. Setup Environment Backend

Di dalam folder:

```text
backend/
```

buat file:

```text
.env
```

Copy isi dari:

```text
.env.example
```

Kemudian sesuaikan dengan konfigurasi PostgreSQL dan environment lokal.

Contoh:

```env
DATABASE_URL=postgresql://postgres:PASSWORD@localhost:5432/warehouse_management
JWT_SECRET=buat_secret_sendiri
PORT=5000

RND_NAME=Nama User RnD
RND_EMAIL=testrnd@example.com
RND_PASSWORD=password_rnd

SALES_NAME=Nama User Sales
SALES_EMAIL=testsales@example.com
SALES_PASSWORD=password_sales
```

# 6. Setup Database

Masih di dalam folder `backend`, jalankan:

```bash
npx prisma migrate deploy
```

Command ini akan menjalankan migration yang sudah tersedia di project ke database PostgreSQL.

---

# 7. Buat Akun Testing

Setelah database selesai dibuat, jalankan:

```bash
npm run seed:test-users
```

Command ini akan membuat akun testing:

### RnD

```text
Email:
testrnd@example.com
```

### Sales

```text
Email:
testsales@example.com
```

Password mengikuti nilai yang sudah diatur di file `.env`.

---

# 8. Jalankan Backend

Masih di folder `backend`:

```bash
npm run dev
```

Backend akan berjalan di:

```text
http://localhost:5000
```

Jangan tutup terminal ini selama aplikasi sedang digunakan.

---

# 9. Jalankan Frontend

Buka terminal baru.

Kembali ke folder utama:

```bash
cd warehouse-management
```

Jalankan:

```bash
npm run dev
```

Frontend akan berjalan di:

```text
http://localhost:3000
```

Buka alamat tersebut di browser.

---

# 10. Login Testing

Gunakan salah satu akun berikut.

### RnD

```text
Email: testrnd@example.com
Password: sesuai RND_PASSWORD di .env
```

### Sales

```text
Email: testsales@example.com
Password: sesuai SALES_PASSWORD di .env
```

Role/division user akan otomatis mengikuti data yang dibuat oleh seed.

---

# 11. Struktur Folder

```text
warehouse-management/
│
├── backend/
│   ├── prisma/
│   │   ├── migrations/
│   │   ├── schema.prisma
│   │   └── seed/
│   │
│   ├── src/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── lib/
│   │   └── server.ts
│   │
│   ├── .env.example
│   └── package.json
│
├── src/
│   ├── app/
│   ├── components/
│   └── ...
│
├── package.json
└── README.md
```

---

# 12. Kalau Ada Perubahan Database

Kalau ada perubahan pada Prisma schema, migration baru perlu dibuat dari environment development.

Contoh:

```bash
npx prisma migrate dev --name nama_perubahan
```

Setelah migration dibuat, migration tersebut ikut di-push ke GitHub.

Pada environment lain, jalankan:

```bash
npx prisma migrate deploy
```

---

# 13. Setelah Pull Perubahan dari GitHub

Kalau project sudah pernah di-clone sebelumnya dan ada perubahan terbaru:

```bash
git pull origin main
```

Kalau ada perubahan dependency:

```bash
npm install
```

Untuk backend:

```bash
cd backend
npm install
```

Kalau ada migration baru:

```bash
npx prisma migrate deploy
```

Kemudian jalankan kembali backend dan frontend.

---

# 14. Troubleshooting

### Backend tidak bisa connect ke database

Cek:

* PostgreSQL sedang berjalan
* Nama database benar
* Username PostgreSQL benar
* Password PostgreSQL benar
* Port PostgreSQL benar
* `DATABASE_URL` di `.env` benar

---

### Prisma error

Pastikan berada di folder:

```text
backend/
```

Kemudian jalankan:

```bash
npx prisma generate
```

Lalu:

```bash
npx prisma migrate deploy
```

---

### Port 5000 sudah digunakan

Cek proses yang menggunakan port tersebut atau ubah:

```env
PORT=5001
```

Jika port backend diubah, konfigurasi API di frontend juga harus menyesuaikan.

---

### Port 3000 sudah digunakan

Next.js biasanya akan menawarkan port lain secara otomatis, misalnya:

```text
http://localhost:3001
```

---

# 15. Urutan Singkat

Kalau semuanya sudah pernah disetup, urutannya cukup:

### Terminal 1 — Backend

```bash
cd backend
npm install
npx prisma migrate deploy
npm run dev
```

### Terminal 2 — Frontend

```bash
npm install
npm run dev
```

Kemudian buka:

```text
http://localhost:3000
```

dan login menggunakan akun RnD atau Sales.
