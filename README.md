
# Blender Add-on Converter

Web app buat bantu convert add-on Blender dari versi lama (2.79b) ke versi baru (2.80, 3.x, 4.x).

---

## 🚀 Fitur Utama

### Code Converter

* Upload atau paste code add-on Blender
* Pilih target versi (2.80, 3.0, 3.6, 4.0, 4.1)
* Hasil convert otomatis + penjelasan
* Bisa langsung copy

---

### Referensi Perubahan API

* List perubahan API antar versi Blender
* Filter berdasarkan versi & tingkat penting
* Contoh code lama vs baru
* Level: critical, high, medium, low

---

### Contoh Conversion

* Contoh nyata
* Perbandingan side-by-side
* Bisa difilter
* Ada penjelasan

---

### Database Backend

* PostgreSQL + Drizzle ORM
* Nyimpen data versi, perubahan API, pola conversion

---

## 🔄 Versi yang Didukung

* Dari: 2.79b, 2.80, 2.90
* Ke: 2.80, 3.0, 3.6, 4.0, 4.1

---

## ⚠️ Perubahan API yang Sering Kena

### Critical

* `context.scene.objects.active` → `context.view_layer.objects.active`
* `obj.select = True` → `obj.select_set(state=True)`
* `obj.hide = True` → `obj.hide_set(True)`
* Blender Internal dihapus → pakai EEVEE / Cycles

### High

* `mesh.uv_textures` → `mesh.uv_layers`
* Warna jadi RGBA (4 value)

### Medium

* `vertex_groups.new("name")` → `vertex_groups.new(name="name")`
* Panel butuh `bl_space_type` & `bl_region_type`

---

## 🧠 Teknologi

* Next.js 14, React, TypeScript, Tailwind
* API Next.js
* PostgreSQL + Drizzle ORM

---

## 🛠️ Cara Jalanin

### Syarat

* Node.js 18+
* PostgreSQL
* npm / yarn

### Install

```bash
npm install
```

### Setup env

```bash
cp .env.example .env
```

### Setup database

```bash
npx drizzle-kit push
npm run seed
```

### Run

```bash
npm run dev
```

---

## 📦 Database

* blender_versions
* api_changes
* conversion_examples
* addon_submissions
* conversion_patterns

---

## 🎯 Cara Pakai

1. Paste code
2. Pilih versi
3. Ambil hasil

---

## 🌐 API

* POST /api/convert
* GET /api/health

---

## 🤝 Kontribusi

* Tambah pola conversion
* Tambah contoh
* Improve error detection
* UI/UX

---

## ⚠️ Disclaimer

Bukan tool official Blender.
Hasil convert belum tentu 100% akurat, tetap test manual.

---

## ❤️ Support

Tolong suport gw di:

* GitHub ⭐ (star repo ini)
* Share ke orang lain
* Kasih feedback
