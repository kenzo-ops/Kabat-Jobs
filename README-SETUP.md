# Setup Instructions - User Profile Feature

## Langkah Setup Database Supabase

Untuk mengaktifkan fitur profil user dengan friends dan follows, ikuti langkah-langkah berikut:

### 1. Buka Supabase Dashboard
- Login ke [https://supabase.com](https://supabase.com)
- Pilih project **Kabat Jobs** Anda
- Buka **SQL Editor** dari sidebar

### 2. Jalankan SQL Schema
Copy dan paste seluruh isi file `supabase-schema.sql` ke SQL Editor, lalu klik **Run**.

File ini akan membuat:
- **Tabel `friends`** - Untuk sistem pertemanan dengan status (pending, accepted, rejected)
- **Tabel `follows`** - Untuk sistem follow/unfollow
- **RPC Functions**:
  - `get_friend_requests(p_user_id)` - Ambil daftar friend request
  - `get_user_friends(p_user_id)` - Ambil daftar teman user
  - `accept_friend_request(p_request_id)` - Terima friend request
  - `reject_friend_request(p_request_id)` - Tolak friend request
  - `get_user_followers(p_user_id)` - Ambil daftar followers
  - `get_user_following(p_user_id)` - Ambil daftar yang di-follow
- **Row Level Security (RLS)** policies untuk keamanan data
- **Indexes** untuk performa query yang optimal

### 3. Verifikasi Setup
Setelah menjalankan SQL, verifikasi bahwa tabel sudah dibuat:
1. Buka **Table Editor** di Supabase
2. Pastikan tabel `friends` dan `follows` sudah ada
3. Cek **Database** → **Functions** untuk melihat RPC functions

### 4. Test Fitur
Setelah setup database selesai, fitur-fitur berikut sudah bisa digunakan:

#### ✅ Klik Avatar/Username
- Klik avatar atau username user di PostList → redirect ke profil user
- Klik avatar atau username di PostDetailPage → redirect ke profil user
- Klik avatar atau username di Comments → redirect ke profil user

#### ✅ User Profile Page (`/user/:userId`)
- Tampilan profil modern dengan avatar, nama, bio, lokasi
- Stats: Posts count, Followers count, Friends count
- Grid posts yang dibuat user
- Tombol **Follow/Unfollow** (warna biru)
- Tombol **Add Friend** (dengan status pending)

#### ✅ Friends System
- User bisa kirim friend request ke user lain
- Status friend request: pending, accepted, rejected
- Bisa lihat daftar teman di halaman Friends

#### ✅ Follows System
- User bisa follow/unfollow user lain
- Tracking followers dan following
- Realtime count di profile page

## Struktur Routing

```
/user/:userId        → UserProfilePage (profil user lain)
/profile             → ProfilePage (profil sendiri)
/friends             → FriendsPage (daftar teman)
/home                → HomePage (feed posts)
/post/:id            → PostDetailPage (detail post)
```

## UI Features

### UserProfilePage
- **Header**: Avatar besar, nama, email, lokasi, join date
- **Stats Bar**: Posts, Followers, Friends count
- **Bio Section**: Deskripsi singkat user
- **Action Buttons**: Follow/Unfollow, Add Friend
- **Posts Grid**: Grid 2 kolom (responsive 1 kolom di mobile)
- **Post Card**: Preview gambar, title, description, likes, comments
- **Tema**: Modern glass morphism dengan dark theme

### Interaksi
- Avatar & username → **Clickable** ke profil user
- Hover effect pada clickable elements
- Smooth transition animations
- Loading states yang smooth
- Error handling yang baik

## Database Schema

### Tabel `friends`
```sql
- id: SERIAL PRIMARY KEY
- user_id: UUID (yang kirim request)
- friend_id: UUID (yang diterima request)
- status: VARCHAR(20) (pending/accepted/rejected)
- created_at: TIMESTAMPTZ
- updated_at: TIMESTAMPTZ
```

### Tabel `follows`
```sql
- id: SERIAL PRIMARY KEY
- follower_id: UUID (yang follow)
- following_id: UUID (yang di-follow)
- created_at: TIMESTAMPTZ
```

## Security (RLS Policies)

### Friends Table
- ✅ User bisa view friends mereka sendiri
- ✅ User bisa send friend requests
- ✅ User bisa accept/reject requests yang diterima
- ✅ User bisa delete friend relationship

### Follows Table
- ✅ Semua user bisa view follows (public)
- ✅ User bisa follow user lain
- ✅ User bisa unfollow

## Troubleshooting

### Error: "relation friends does not exist"
→ Jalankan SQL schema di Supabase SQL Editor

### Error: "function get_user_profile does not exist"
→ Pastikan RPC function sudah dibuat di step sebelumnya

### Avatar tidak muncul
→ Cek apakah user memiliki avatar_url atau custom_avatar_url di tabel users

### Tidak bisa add friend
→ Cek RLS policies di tabel friends sudah aktif

### Count followers/friends tidak update
→ Pastikan trigger dan RPC functions sudah berjalan dengan benar

## Next Steps

1. ✅ Setup database dengan menjalankan `supabase-schema.sql`
2. ✅ Test klik avatar/username di berbagai halaman
3. ✅ Test fitur follow/unfollow
4. ✅ Test fitur add friend
5. ⏳ (Optional) Tambahkan notifikasi untuk friend requests
6. ⏳ (Optional) Tambahkan chat/messaging feature
7. ⏳ (Optional) Tambahkan mutual friends indicator

## Support

Jika ada masalah atau pertanyaan, silakan check:
- Supabase logs di Dashboard → Logs
- Browser console untuk error messages
- Network tab untuk API requests

Happy coding! 🚀
