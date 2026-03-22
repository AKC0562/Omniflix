<p align="center">
  <img src="https://img.shields.io/badge/🟢-OMNIFLIX-00FF41?style=for-the-badge&labelColor=0A1A0F" alt="OmniFlix" height="40"/>
</p>

<h1 align="center">
  🟢 OmniFlix — Stream the Omniverse
</h1>

<p align="center">
  <em>A cinematic Netflix-style streaming platform powered by the Omnitrix</em>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Theme-Ben%2010%20Omnitrix-00FF41?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PGNpcmNsZSBjeD0iMTIiIGN5PSIxMiIgcj0iMTAiIGZpbGw9IiMwMEZGNDEiLz48L3N2Zz4=&labelColor=0A1A0F" alt="Theme"/>
  <img src="https://img.shields.io/badge/Stack-MERN%20+%20TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white&labelColor=1a1a2e" alt="Stack"/>
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=white&labelColor=1a1a2e" alt="React"/>
  <img src="https://img.shields.io/badge/Vite-8-646CFF?style=for-the-badge&logo=vite&logoColor=white&labelColor=1a1a2e" alt="Vite"/>
  <img src="https://img.shields.io/badge/License-MIT-blue?style=for-the-badge&labelColor=1a1a2e" alt="License"/>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/MongoDB-Atlas-47A248?style=flat-square&logo=mongodb&logoColor=white" alt="MongoDB"/>
  <img src="https://img.shields.io/badge/Express-4.21-000000?style=flat-square&logo=express&logoColor=white" alt="Express"/>
  <img src="https://img.shields.io/badge/TailwindCSS-v4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white" alt="Tailwind"/>
  <img src="https://img.shields.io/badge/Docker-Ready-2496ED?style=flat-square&logo=docker&logoColor=white" alt="Docker"/>
  <img src="https://img.shields.io/badge/TMDB-API-01D277?style=flat-square&logo=themoviedatabase&logoColor=white" alt="TMDB"/>
</p>

---

## 📸 Screenshots

### 🏠 Landing Page

> The hero section with the iconic Omnitrix-themed branding, floating alien characters, and a cinematic dark UI.

| Hero Section | Trending & Features |
|:---:|:---:|
| ![Landing Page - Hero](screenshorts/P1.png) | ![Landing Page - Content](screenshorts/P2.png) |

---

### 🔐 Authentication

> Clean, minimal auth forms with Omnitrix green accents and glowing input fields.

| Register | Login |
|:---:|:---:|
| ![Register Page](screenshorts/P3.png) | ![Login Page](screenshorts/P4.png) |

---

### 👽 Profile Management

> Ben 10 alien avatar selector with transformation animations. Supports up to 5 profiles per account.

| Add Profile (Alien Avatar Selector) | Profile Selector — "Who's Watching?" |
|:---:|:---:|
| ![Add Profile](screenshorts/P5.png) | ![Profile Selector](screenshorts/P6.png) |

---

### 🎬 Browse Experience

> Netflix-style browsing with auto-rotating hero banner, horizontal scroll rows, and genre-based discovery.

| Hero Banner | Bollywood / Hollywood Rows |
|:---:|:---:|
| ![Browse Hero](screenshorts/P7.png) | ![Browse Rows](screenshorts/P8.png) |

| TV Shows — Anime Series | Movies — Genre Rows |
|:---:|:---:|
| ![TV Shows](screenshorts/P9.png) | ![Movie Genres](screenshorts/P10.png) |

---

### 📋 My List

> Personal watchlist synced per profile with holographic card effects.

| My List |
|:---:|
| ![My List](screenshorts/P11.png) |

---

### 🎥 Movie Details & Trailers

> Detailed modals with cast info, trailers, similar titles, and inline video playback.

| Movie Detail — Cast View | Movie Detail — Another Movie |
|:---:|:---:|
| ![Movie Detail 1](screenshorts/P12.png) | ![Movie Detail 2](screenshorts/P13.png) |

| Trailer View (Modal) | Trailer Player |
|:---:|:---:|
| ![Trailer Modal](screenshorts/P14.png) | ![Trailer Player](screenshorts/P15.png) |

---

### ⚙️ Account

> Account management page with profile overview and settings.

| Account Page |
|:---:|
| ![Account Page](screenshorts/P16.png) |

---

### 🛡️ Admin Panel

> Full-featured admin dashboard with user management, analytics, and system monitoring — styled as the Omnitrix **Command Center**.

| Dashboard | User Management | Analytics |
|:---:|:---:|:---:|
| ![Admin Dashboard](screenshorts/P17.png) | ![Admin Users](screenshorts/P18.png) | ![Admin Analytics](screenshorts/P19.png) |

---

### 🔍 Search

> Instant search with debounced queries and categorized results across movies and TV shows.

| Search Page | Search Results |
|:---:|:---:|
| ![Search](screenshorts/P20.png) | ![Search Results](screenshorts/P21.png) |

---

### 🚨 Error Pages

> Custom-themed error pages with Omnitrix-inspired animations — each error code has a unique Ben 10 dimension twist.

| 404 — Dimension Not Found | 401 — Unauthorized Access | 403 — Forbidden Zone | 408 — Timeout |
|:---:|:---:|:---:|:---:|
| ![404](screenshorts/PE1.png) | ![401](screenshorts/PE2.png) | ![403](screenshorts/PE3.png) | ![408](screenshorts/PE4.png) |

| 429 — Too Many Requests | 500 — Server Error | 502 — Bad Gateway | 503 — Service Unavailable |
|:---:|:---:|:---:|:---:|
| ![429](screenshorts/PE5.png) | ![500](screenshorts/PE6.png) | ![502](screenshorts/PE7.png) | ![503](screenshorts/PE8.png) |

---

## ✨ Features

### 🎬 Core Streaming (Netflix-like)

- ✅ **User Authentication** — Register / Login / Logout with secure JWT
- ✅ **Token Security** — Access + Refresh token rotation with auto-refresh on 401
- ✅ **Multi-Profile Support** — Up to 5 profiles per account with alien avatars
- ✅ **TMDB Integration** — Browse real movies & TV shows via The Movie Database API
- ✅ **Content Categories** — Trending, Popular, Top Rated, Now Playing, Upcoming
- ✅ **Detail Modals** — Cast, trailers, ratings, and similar recommendations
- ✅ **Search** — Instant search with debounced queries
- ✅ **Watchlist** — Per-profile "My List" management
- ✅ **Responsive Design** — Fully optimized for mobile, tablet, and desktop
- ✅ **Hero Banner** — Auto-rotating featured content with cinematic backdrops
- ✅ **Scroll Rows** — Netflix-style horizontal content carousels

### 🟢 Ben 10 / Omnitrix Theme

- 🟢 **Dark Omnitrix Palette** — Deep blacks with neon green accents (`#00FF41`)
- 🟢 **Glassmorphism + Neon UI** — Frosted glass panels with glowing borders
- 🟢 **Alien Avatar System** — 20 unique alien characters as profile avatars
- 🟢 **Omnitrix Transformation** — Animated profile-switch with dial effect
- 🟢 **Custom Loading Spinner** — Omnitrix-style rotating transformation dial
- 🟢 **Energy Pulse Effects** — Holographic cards and scan-line overlays
- 🟢 **Themed Error Pages** — Unique Ben 10 dimension names for each HTTP error

### ⚡ Advanced

- ⚡ **Framer Motion Animations** — Page transitions, micro-interactions, hover effects
- ⚡ **Skeleton Loading** — Smooth content placeholders while data loads
- ⚡ **Server Caching** — NodeCache-powered TMDB response caching
- ⚡ **Rate Limiting** — Express rate limiter to prevent API abuse
- ⚡ **Role-Based Auth** — Admin vs. User authorization
- ⚡ **Admin Dashboard** — User management, analytics, and system stats
- ⚡ **Docker Ready** — One-command deployment with Docker Compose

---

## 🛠️ Tech Stack

<table>
<tr>
<td align="center" width="50%">

### 🖥️ Frontend

| Technology | Purpose |
|:---|:---|
| **React 19** | UI framework |
| **TypeScript** | Type-safe development |
| **Vite 8** | Build tool & dev server |
| **TailwindCSS v4** | Utility-first styling |
| **Framer Motion** | Animations & transitions |
| **Zustand** | State management |
| **Axios** | HTTP client with interceptors |
| **React Router v7** | Client-side routing |
| **React Player** | Video/trailer playback |

</td>
<td align="center" width="50%">

### ⚙️ Backend

| Technology | Purpose |
|:---|:---|
| **Node.js** | Runtime environment |
| **Express 4** | Web framework |
| **TypeScript** | Type-safe development |
| **MongoDB + Mongoose** | Database & ODM |
| **JWT** | Auth (Access + Refresh) |
| **bcrypt** | Password hashing |
| **Zod** | Request validation |
| **Winston** | Structured logging |
| **NodeCache** | Response caching |
| **Docker** | Containerized deployment |

</td>
</tr>
</table>

---

## 📁 Project Structure

```
omniflix/
├── 📂 client/                      # ⚛️  React Frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── layout/             # Navbar, ProtectedRoute, Footer
│   │   │   ├── movie/              # HeroBanner, MovieCard, MovieRow, MovieModal
│   │   │   └── ui/                 # OmnitrixSpinner, ErrorPage
│   │   ├── data/                   # Alien avatars, content catalogs
│   │   ├── hooks/                  # useTMDB, useDebounce, useIntersection
│   │   ├── pages/                  # All route pages (Browse, Login, Admin, etc.)
│   │   ├── services/               # Axios API service layer
│   │   ├── store/                  # Zustand stores (auth, ui)
│   │   ├── types/                  # TypeScript interfaces
│   │   ├── App.tsx                 # Root component + routing
│   │   ├── main.tsx                # Entry point
│   │   └── index.css               # TailwindCSS + theme + animations
│   ├── index.html
│   ├── vite.config.ts
│   └── package.json
│
├── 📂 server/                      # 🟢 Express Backend
│   ├── src/
│   │   ├── config/                 # DB connection, env vars
│   │   ├── controllers/            # Auth, Profile, TMDB, Admin controllers
│   │   ├── middleware/             # Auth guard, error handler, rate limiter
│   │   ├── models/                 # User + Profile Mongoose schemas
│   │   ├── routes/                 # Express route definitions
│   │   ├── services/               # TMDB service, Token service
│   │   ├── types/                  # TypeScript types
│   │   ├── utils/                  # Logger utility
│   │   └── index.ts                # Server entry point
│   ├── .env.example
│   ├── tsconfig.json
│   └── package.json
│
├── 🐳 Dockerfile
├── 🐳 docker-compose.yml
└── 📄 README.md
```

---

## 🚀 Quick Start

### Prerequisites

| Requirement | Version |
|:---|:---|
| Node.js | 18+ |
| MongoDB | Local or [Atlas](https://www.mongodb.com/atlas) |
| TMDB API Key | [Get one here →](https://www.themoviedb.org/settings/api) |

### 1️⃣ Clone & Install

```bash
git clone https://github.com/your-username/omniflix.git
cd omniflix

# Install server dependencies
cd server
cp .env.example .env      # ← Edit with your values
npm install

# Install client dependencies
cd ../client
cp .env.example .env
npm install --legacy-peer-deps
```

### 2️⃣ Configure Environment

Edit `server/.env`:

```env
# Database
MONGODB_URI=mongodb+srv://your-user:your-pass@cluster.mongodb.net/omniflix

# Auth Secrets
JWT_ACCESS_SECRET=your_secure_access_secret_here
JWT_REFRESH_SECRET=your_secure_refresh_secret_here

# TMDB API
TMDB_API_KEY=your_tmdb_api_key_here
```

### 3️⃣ Run Development

```bash
# Terminal 1 — Start backend
cd server
npm run dev

# Terminal 2 — Start frontend
cd client
npm run dev
```

| Service | URL |
|:---|:---|
| 🖥️ Client | [http://localhost:5173](http://localhost:5173) |
| ⚙️ Server API | [http://localhost:5000/api](http://localhost:5000/api) |

### 4️⃣ Docker Deployment

```bash
# Set environment variables
export JWT_ACCESS_SECRET=your_secret
export JWT_REFRESH_SECRET=your_secret
export TMDB_API_KEY=your_key

# Build and run
docker-compose up --build -d
```

---

## 🎨 Design System

### Color Palette

| Token | Hex | Preview | Usage |
|:---|:---|:---:|:---|
| `omnitrix-green` | `#00FF41` | 🟢 | Primary accent, glows, CTA buttons |
| `omnitrix-dark` | `#0A1A0F` | ⬛ | Background base |
| `omnitrix-panel` | `#0D2818` | 🟫 | Panel backgrounds, cards |
| `omnitrix-glow` | `#39FF14` | 💚 | Hover states, neon effects |
| `alien-cyan` | `#00E5FF` | 🔵 | Secondary accent, info states |
| `alien-orange` | `#FF6D00` | 🟠 | Heatblast accents, warnings |
| `surface-dark` | `#070B0A` | ⚫ | Deep dark surfaces |
| `surface-card` | `#0F1A14` | 🃏 | Card backgrounds |

### Typography

- **Primary Font**: System UI / Inter — clean, modern, highly readable
- **Display Font**: Custom sci-fi letterforms for headings and branding
- **Monospace**: Used in admin dashboard stats and error codes

---

## 🧬 Alien Avatars

Each profile features a unique Ben 10 alien character as its avatar with custom colors:

| Alien | Emoji | Theme Color | Alien | Emoji | Theme Color |
|:---|:---:|:---|:---|:---:|:---|
| Heatblast | 🔥 | Orange | Ghostfreak | 👻 | Grey |
| Four Arms | 💪 | Red | Cannonbolt | 🛡️ | Yellow |
| XLR8 | ⚡ | Cyan | Wildvine | 🌿 | Forest Green |
| Diamondhead | 💎 | Crystal Green | Blitzwolfer | 🐺 | Silver |
| Upgrade | 🤖 | Omnitrix Green | Snare-Oh | 🧟 | Sand |
| Stinkfly | 🪰 | Lime | Frankenstrike | ⚡ | Electric Blue |
| Ripjaws | 🦈 | Deep Blue | Eye Guy | 👁️ | Purple |
| Grey Matter | 🧠 | Grey | Way Big | 🌟 | White/Red |
| Alien X | ✨ | Cosmic Blue | Echo Echo | 🔊 | White |
| Swampfire | 🔥 | Green/Orange | Humungousaur | 🦕 | Brown |

---

## 📡 API Reference

### 🔐 Authentication

| Method | Endpoint | Auth | Description |
|:---:|:---|:---:|:---|
| `POST` | `/api/auth/register` | ❌ | Register new user |
| `POST` | `/api/auth/login` | ❌ | Login & get tokens |
| `POST` | `/api/auth/refresh` | ❌ | Refresh access token |
| `POST` | `/api/auth/logout` | ✅ | Invalidate session |
| `GET` | `/api/auth/me` | ✅ | Get current user |

### 👤 Profiles

| Method | Endpoint | Auth | Description |
|:---:|:---|:---:|:---|
| `GET` | `/api/profiles` | ✅ | List all profiles |
| `POST` | `/api/profiles` | ✅ | Create new profile |
| `PUT` | `/api/profiles/:id` | ✅ | Update profile |
| `DELETE` | `/api/profiles/:id` | ✅ | Delete profile |
| `GET` | `/api/profiles/:id/watchlist` | ✅ | Get watchlist |
| `POST` | `/api/profiles/:id/watchlist` | ✅ | Add to watchlist |
| `DELETE` | `/api/profiles/:id/watchlist/:movieId` | ✅ | Remove from watchlist |

### 🎬 TMDB Content

| Method | Endpoint | Description |
|:---:|:---|:---|
| `GET` | `/api/tmdb/trending` | Trending movies & TV |
| `GET` | `/api/tmdb/movies/popular` | Popular movies |
| `GET` | `/api/tmdb/movies/top-rated` | Top rated movies |
| `GET` | `/api/tmdb/movies/now-playing` | Now playing in theaters |
| `GET` | `/api/tmdb/movies/upcoming` | Upcoming releases |
| `GET` | `/api/tmdb/movies/:id` | Movie details + credits |
| `GET` | `/api/tmdb/tv/popular` | Popular TV shows |
| `GET` | `/api/tmdb/tv/top-rated` | Top rated TV |
| `GET` | `/api/tmdb/tv/:id` | TV show details |
| `GET` | `/api/tmdb/search?q=` | Search across all content |
| `GET` | `/api/tmdb/genres` | All genre categories |

### 🛡️ Admin

| Method | Endpoint | Auth | Description |
|:---:|:---|:---:|:---|
| `GET` | `/api/admin/stats` | 🔒 Admin | Platform statistics |
| `GET` | `/api/admin/users` | 🔒 Admin | List all users |
| `PUT` | `/api/admin/users/:id` | 🔒 Admin | Update user role |
| `DELETE` | `/api/admin/users/:id` | 🔒 Admin | Delete user |

---

## 🐳 Docker

```yaml
# docker-compose.yml
services:
  app:
    build: .
    ports:
      - "5000:5000"
    environment:
      - MONGODB_URI=mongodb://mongo:27017/omniflix
      - JWT_ACCESS_SECRET=${JWT_ACCESS_SECRET}
      - JWT_REFRESH_SECRET=${JWT_REFRESH_SECRET}
      - TMDB_API_KEY=${TMDB_API_KEY}
    depends_on:
      - mongo

  mongo:
    image: mongo:7
    ports:
      - "27017:27017"
    volumes:
      - mongo-data:/data/db
```

---

## 🤝 Contributing

1. **Fork** the repository
2. **Create** your feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

<p align="center">
  <strong>Built with the power of the Omnitrix ⚡</strong>
</p>

<p align="center">
  <sub>Made with ❤️ by <a href="https://github.com/your-username">Arcain</a></sub>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/⚡-IT'S_HERO_TIME-00FF41?style=for-the-badge&labelColor=0A1A0F" alt="Hero Time"/>
</p>
