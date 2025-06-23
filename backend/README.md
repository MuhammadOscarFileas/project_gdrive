# Backend - File Storage API

Backend untuk aplikasi file storage dengan Google Cloud Storage integration dan JWT refresh token authentication.

## Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Variables
Copy file `env.example` ke `.env` dan sesuaikan konfigurasinya:

```bash
cp env.example .env
```

### 3. Konfigurasi Database
Pastikan MySQL server berjalan dan buat database sesuai dengan `DB_NAME` di file `.env`.

### 4. Google Cloud Storage
- Upload file `f-07-450706-aa2307f7a8c6.json` ke folder backend
- Sesuaikan `GOOGLE_CLOUD_PROJECT_ID` dan `GOOGLE_CLOUD_BUCKET_NAME` di file `.env`

### 5. Run Application

**Development:**
```bash
npm run dev
```

**Production:**
```bash
npm start
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | 5000 |
| `NODE_ENV` | Environment mode | development |
| `DB_HOST` | Database host | localhost |
| `DB_PORT` | Database port | 3306 |
| `DB_NAME` | Database name | b_drive |
| `DB_USER` | Database user | root |
| `DB_PASSWORD` | Database password | (empty) |
| `DB_DIALECT` | Database dialect | mysql |
| `JWT_SECRET` | JWT access token secret | (required) |
| `JWT_REFRESH_SECRET` | JWT refresh token secret | (required) |
| `JWT_EXPIRES_IN` | JWT expiration | 24h |
| `GOOGLE_CLOUD_PROJECT_ID` | GCS project ID | (required) |
| `GOOGLE_CLOUD_BUCKET_NAME` | GCS bucket name | (required) |
| `CORS_ORIGIN` | CORS origin | http://localhost:3000 |

## Authentication Flow

### 1. Login
- User login dengan email dan password
- Server generate access token (15 menit) dan refresh token (7 hari)
- Refresh token disimpan di database dan sebagai httpOnly cookie
- Access token dikembalikan ke client

### 2. Access Token Expired
- Client hit endpoint `/api/users/refresh-token`
- Server verify refresh token dari cookie
- Jika valid, generate access token baru
- Jika tidak valid, user harus login ulang

### 3. Logout
- Server hapus refresh token dari database
- Server clear cookie refresh token

## API Endpoints

### Authentication
- `POST /api/users/register` - User registration
- `POST /api/users/login` - User login (returns access token)
- `POST /api/users/logout` - User logout (requires auth)
- `POST /api/users/refresh-token` - Refresh access token

### User Management
- `PUT /api/users/edit` - Update user profile (requires auth)
- `DELETE /api/users/delete` - Delete user account (requires auth)

### File Management
- `POST /api/files/upload` - Upload file (requires auth)
- `GET /api/files` - Get user files (requires auth)
- `DELETE /api/files/:id` - Delete file (requires auth)

## Token Usage

### Access Token
- Durasi: 15 menit
- Digunakan untuk autentikasi API calls
- Dikirim via Authorization header: `Bearer <token>`

### Refresh Token
- Durasi: 7 hari
- Disimpan sebagai httpOnly cookie
- Digunakan untuk mendapatkan access token baru
- Otomatis dihapus saat logout 