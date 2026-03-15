# 🟢 OmniFlix — Stream the Omniverse

A **Netflix-style streaming platform** with a **Ben 10 / Omnitrix inspired theme**, built on the **MERN stack with TypeScript**.

![Theme](https://img.shields.io/badge/Theme-Ben%2010%20Omnitrix-00FF41?style=flat-square)
![Stack](https://img.shields.io/badge/Stack-MERN%20+%20TypeScript-3178C6?style=flat-square)
![License](https://img.shields.io/badge/License-MIT-blue?style=flat-square)

---

## 🎬 Features

### Core (Netflix-like)
- ✅ User authentication (Register / Login / Logout)
- ✅ JWT protected routes with refresh token rotation
- ✅ Multiple profile management (up to 5)
- ✅ Browse movies & TV shows from **TMDB API**
- ✅ Categories: Trending, Popular, Top Rated, Now Playing, Upcoming
- ✅ Movie / TV detail modal with cast, trailers, and similar titles
- ✅ Search functionality with instant results
- ✅ Watchlist / My List per profile
- ✅ Responsive UI (mobile + desktop)
- ✅ Hero banner with auto-rotating featured content
- ✅ Netflix-style horizontal scroll rows

### Ben 10 Theme
- 🟢 Dark Omnitrix green + black color palette
- 🟢 Sci-fi glowing UI elements (glassmorphism + neon)
- 🟢 Alien avatar system for profiles
- 🟢 Omnitrix transformation animation on profile switch
- 🟢 Animated loading spinner (Omnitrix style)
- 🟢 Energy pulse effects and holographic cards
- 🟢 Scan-line effects on hero banner

### Advanced
- ⚡ Framer Motion powered animations everywhere
- ⚡ Skeleton loading states
- ⚡ Auto token refresh on 401
- ⚡ Server-side TMDB caching (NodeCache)
- ⚡ API rate limiting
- ⚡ Role-based authorization
- ⚡ Docker deployment ready

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19 + TypeScript + Vite 8 |
| Styling | TailwindCSS v4 + Custom Theme |
| Animations | Framer Motion |
| State | Zustand |
| HTTP | Axios with interceptors |
| Backend | Node.js + Express + TypeScript |
| Database | MongoDB + Mongoose |
| Auth | JWT (Access + Refresh tokens) + bcrypt |
| API | TMDB (The Movie Database) |
| Validation | Zod |
| Logging | Winston |
| Deployment | Docker + Docker Compose |

---

## 📁 Project Structure

```
omniflix/
├── client/                     # React Frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── layout/         # Navbar, ProtectedRoute
│   │   │   ├── movie/          # HeroBanner, MovieCard, MovieRow, MovieModal
│   │   │   └── ui/             # OmnitrixSpinner
│   │   ├── data/               # alienAvatars data
│   │   ├── hooks/              # Custom hooks (useTMDB, useDebounce, etc.)
│   │   ├── pages/              # All route pages
│   │   ├── services/           # API service layer (axios)
│   │   ├── store/              # Zustand stores (auth, ui)
│   │   ├── types/              # TypeScript interfaces
│   │   ├── App.tsx             # Root component + routing
│   │   ├── main.tsx            # Entry point
│   │   └── index.css           # TailwindCSS + theme + animations
│   ├── index.html
│   ├── vite.config.ts
│   └── package.json
│
├── server/                     # Express Backend
│   ├── src/
│   │   ├── config/             # DB connection, env config
│   │   ├── controllers/        # Auth, Profile, TMDB controllers
│   │   ├── middleware/         # Auth, error handler, rate limiter
│   │   ├── models/             # User + Profile Mongoose models
│   │   ├── routes/             # Express routes
│   │   ├── services/           # TMDB service, Token service
│   │   ├── types/              # TypeScript types
│   │   ├── utils/              # Logger
│   │   └── index.ts            # Server entry point
│   ├── .env.example
│   ├── tsconfig.json
│   └── package.json
│
├── Dockerfile
├── docker-compose.yml
└── README.md
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- TMDB API Key — [Get one here](https://www.themoviedb.org/settings/api)

### 1. Clone & Install

```bash
# Install server dependencies
cd server
cp .env.example .env   # Edit with your values
npm install

# Install client dependencies
cd ../client
cp .env.example .env
npm install --legacy-peer-deps
```

### 2. Configure Environment

Edit `server/.env`:
```env
MONGODB_URI=mongodb://localhost:27017/omniflix
JWT_ACCESS_SECRET=your_secure_access_secret
JWT_REFRESH_SECRET=your_secure_refresh_secret
TMDB_API_KEY=your_tmdb_api_key
```

### 3. Run Development

```bash
# Terminal 1 — Start server
cd server
npm run dev

# Terminal 2 — Start client
cd client
npm run dev
```

- **Client**: http://localhost:5173
- **Server**: http://localhost:5000/api

### 4. Docker Deployment

```bash
# Set environment variables
export JWT_ACCESS_SECRET=your_secret
export JWT_REFRESH_SECRET=your_secret
export TMDB_API_KEY=your_key

# Build and run
docker-compose up --build -d
```

---

## 🎨 Color Palette

| Token | Value | Usage |
|-------|-------|-------|
| `omnitrix-green` | `#00FF41` | Primary accent, glows |
| `omnitrix-dark` | `#0A1A0F` | Background base |
| `omnitrix-panel` | `#0D2818` | Panel backgrounds |
| `omnitrix-glow` | `#39FF14` | Hover glows, neon |
| `alien-cyan` | `#00E5FF` | Secondary accent |
| `alien-orange` | `#FF6D00` | Heatblast accents |
| `surface-dark` | `#070B0A` | Dark surfaces |
| `surface-card` | `#0F1A14` | Card surfaces |

---

## 🧬 Alien Avatars

Each profile uses a Ben 10 alien character as its avatar:

| Alien | Emoji | Color |
|-------|-------|-------|
| Heatblast | 🔥 | Orange |
| Four Arms | 💪 | Red |
| XLR8 | ⚡ | Cyan |
| Diamondhead | 💎 | Green |
| Upgrade | 🤖 | Omnitrix Green |
| Ghostfreak | 👻 | Grey |
| Alien X | ✨ | Deep Blue |
| ...and 13 more! | | |

---

## 📡 API Endpoints

### Auth
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | No | Register new user |
| POST | `/api/auth/login` | No | Login user |
| POST | `/api/auth/refresh` | No | Refresh access token |
| POST | `/api/auth/logout` | Yes | Logout user |
| GET | `/api/auth/me` | Yes | Get current user |

### Profiles
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/profiles` | Yes | Get all profiles |
| POST | `/api/profiles` | Yes | Create profile |
| PUT | `/api/profiles/:id` | Yes | Update profile |
| DELETE | `/api/profiles/:id` | Yes | Delete profile |
| GET | `/api/profiles/:id/watchlist` | Yes | Get watchlist |
| POST | `/api/profiles/:id/watchlist` | Yes | Add to watchlist |
| DELETE | `/api/profiles/:id/watchlist/:movieId` | Yes | Remove from watchlist |

### TMDB
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/tmdb/trending` | Trending content |
| GET | `/api/tmdb/movies/popular` | Popular movies |
| GET | `/api/tmdb/movies/top-rated` | Top rated movies |
| GET | `/api/tmdb/movies/now-playing` | Now playing |
| GET | `/api/tmdb/movies/upcoming` | Upcoming movies |
| GET | `/api/tmdb/movies/:id` | Movie details |
| GET | `/api/tmdb/tv/popular` | Popular TV shows |
| GET | `/api/tmdb/tv/top-rated` | Top rated TV |
| GET | `/api/tmdb/tv/:id` | TV show details |
| GET | `/api/tmdb/search?q=` | Search all |
| GET | `/api/tmdb/genres` | All genres |

---

## 📄 License

MIT License — Built with the power of the Omnitrix ⚡
