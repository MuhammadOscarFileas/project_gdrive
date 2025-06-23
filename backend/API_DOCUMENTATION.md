# 📚 API Documentation - File Storage System

Base URL: `http://localhost:5000/api`

## 🔐 Authentication Endpoints

### 1. User Registration
**POST** `/users/register`

**Deskripsi:** Mendaftarkan user baru ke sistem

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response Success (201):**
```json
{
  "msg": "Registrasi berhasil"
}
```

**Response Error (409):**
```json
{
  "msg": "Email sudah digunakan"
}
```

**Response Error (500):**
```json
{
  "msg": "Registrasi gagal",
  "error": "Error message"
}
```

---

### 2. User Login
**POST** `/users/login`

**Deskripsi:** Login user dan mendapatkan access token + refresh token

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response Success (200):**
```json
{
  "msg": "Login berhasil",
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid-user-id",
    "email": "user@example.com"
  }
}
```

**Response Error (404):**
```json
{
  "msg": "User tidak ditemukan"
}
```

**Response Error (401):**
```json
{
  "msg": "Password salah"
}
```

**Notes:** 
- Refresh token disimpan sebagai httpOnly cookie
- Access token berlaku 15 menit
- Refresh token berlaku 7 hari

---

### 3. Refresh Access Token
**POST** `/users/refresh-token`

**Deskripsi:** Memperbarui access token menggunakan refresh token

**Request:** Tidak perlu body, refresh token diambil dari cookie

**Response Success (200):**
```json
{
  "msg": "Token berhasil diperbarui",
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid-user-id",
    "email": "user@example.com"
  }
}
```

**Response Error (401):**
```json
{
  "msg": "Refresh token tidak ditemukan"
}
```

**Response Error (403):**
```json
{
  "msg": "Refresh token tidak valid"
}
```

---

### 4. User Logout
**POST** `/users/logout`

**Deskripsi:** Logout user dan menghapus refresh token

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response Success (200):**
```json
{
  "msg": "Logout berhasil"
}
```

**Notes:** 
- Menghapus refresh token dari database
- Clear httpOnly cookie

---

## 👤 User Management Endpoints

### 5. Update User Profile
**PUT** `/users/edit`

**Deskripsi:** Mengubah email dan/atau password user

**Headers:**
```
Authorization: Bearer <access_token>
```

**Request Body:**
```json
{
  "email": "newemail@example.com",
  "password": "newpassword123"
}
```

**Response Success (200):**
```json
{
  "msg": "Profil berhasil diperbarui"
}
```

**Response Error (500):**
```json
{
  "msg": "Update profil gagal",
  "error": "Error message"
}
```

---

### 6. Delete User Account
**DELETE** `/users/delete`

**Deskripsi:** Menghapus akun user dan semua file yang dimiliki

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response Success (200):**
```json
{
  "msg": "Akun dan semua file berhasil dihapus"
}
```

**Response Error (500):**
```json
{
  "msg": "Gagal menghapus akun",
  "error": "Error message"
}
```

---

## 📁 File Management Endpoints

### 7. Upload File
**POST** `/files`

**Deskripsi:** Mengunggah file ke Google Cloud Storage

**Headers:**
```
Authorization: Bearer <access_token>
Content-Type: multipart/form-data
```

**Request Body (Form Data):**
```
file: [binary file data]
```

**Response Success (201):**
```json
{
  "msg": "File berhasil diunggah",
  "file": {
    "id": "uuid-file-id",
    "user_id": "uuid-user-id",
    "filename": "document.pdf",
    "gcs_path": "uploads/user-id/filename.pdf",
    "mimetype": "application/pdf",
    "size": 1024000,
    "share_id": "abc123def456",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

**Response Error (500):**
```json
{
  "msg": "Upload file gagal",
  "error": "Error message"
}
```

---

### 8. Get All Files
**GET** `/files`

**Deskripsi:** Mendapatkan daftar semua file milik user

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response Success (200):**
```json
{
  "msg": "Berhasil mengambil daftar file",
  "files": [
    {
      "id": "uuid-file-id",
      "user_id": "uuid-user-id",
      "filename": "document.pdf",
      "gcs_path": "uploads/user-id/filename.pdf",
      "mimetype": "application/pdf",
      "size": 1024000,
      "share_id": "abc123def456",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

**Response Error (500):**
```json
{
  "msg": "Gagal mengambil file",
  "error": "Error message"
}
```

---

### 9. Update Filename
**PUT** `/files/:id`

**Deskripsi:** Mengubah nama file

**Headers:**
```
Authorization: Bearer <access_token>
```

**Request Body:**
```json
{
  "filename": "new_filename.pdf"
}
```

**Response Success (200):**
```json
{
  "msg": "Nama file berhasil diperbarui"
}
```

**Response Error (404):**
```json
{
  "msg": "File tidak ditemukan"
}
```

**Response Error (500):**
```json
{
  "msg": "Gagal mengubah nama file",
  "error": "Error message"
}
```

---

### 10. Get File Preview
**GET** `/files/preview/:id`

**Deskripsi:** Mendapatkan URL preview file (untuk gambar, PDF, dll)

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response Success (200):**
```json
{
  "msg": "Preview tersedia",
  "previewUrl": "https://storage.googleapis.com/bucket-name/path/to/file?signature..."
}
```

**Response Error (404):**
```json
{
  "msg": "File tidak ditemukan"
}
```

**Response Error (500):**
```json
{
  "msg": "Gagal mengambil preview",
  "error": "Error message"
}
```

---

### 11. Download File
**GET** `/files/download/:id`

**Deskripsi:** Mengunduh file (redirect ke signed URL)

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response:** Redirect ke signed URL untuk download

**Response Error (404):**
```json
{
  "msg": "File tidak ditemukan"
}
```

**Response Error (500):**
```json
{
  "msg": "Gagal mengunduh file",
  "error": "Error message"
}
```

---

### 12. Delete File
**DELETE** `/files/:id`

**Deskripsi:** Menghapus file dari storage dan database

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response Success (200):**
```json
{
  "msg": "File berhasil dihapus"
}
```

**Response Error (404):**
```json
{
  "msg": "File tidak ditemukan"
}
```

**Response Error (500):**
```json
{
  "msg": "Gagal menghapus file",
  "error": "Error message"
}
```

---

## 🔗 Public File Sharing

### 13. Get Shared File
**GET** `/files/share/:shareId`

**Deskripsi:** Mengakses file yang dibagikan tanpa login (public access)

**Response Success (200):**
```json
{
  "msg": "Link berhasil ditemukan",
  "file": {
    "filename": "shared_document.pdf",
    "url": "https://storage.googleapis.com/bucket-name/path/to/file?signature..."
  }
}
```

**Response Error (404):**
```json
{
  "msg": "File tidak ditemukan atau link tidak valid"
}
```

**Response Error (500):**
```json
{
  "msg": "Gagal mengambil link file",
  "error": "Error message"
}
```

---

## 📋 Error Response Format

Semua endpoint mengembalikan error dalam format yang konsisten:

```json
{
  "msg": "Pesan error yang user-friendly",
  "error": "Detail error untuk debugging (opsional)"
}
```

## 🔒 Authentication

### Access Token
- **Format:** `Bearer <token>`
- **Header:** `Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
- **Durasi:** 15 menit
- **Penggunaan:** Untuk semua endpoint yang memerlukan autentikasi

### Refresh Token
- **Format:** httpOnly cookie
- **Durasi:** 7 hari
- **Penggunaan:** Untuk memperbarui access token

## 📊 HTTP Status Codes

| Code | Description |
|------|-------------|
| 200 | Success |
| 201 | Created |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 409 | Conflict |
| 500 | Internal Server Error |

## 🚀 Contoh Penggunaan

### Flow Login & Upload File
```bash
# 1. Login
curl -X POST http://localhost:5000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'

# 2. Upload file dengan access token
curl -X POST http://localhost:5000/api/files \
  -H "Authorization: Bearer <access_token>" \
  -F "file=@document.pdf"

# 3. Get files
curl -X GET http://localhost:5000/api/files \
  -H "Authorization: Bearer <access_token>"
``` 