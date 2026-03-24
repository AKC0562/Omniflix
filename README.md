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
  <img src="https://img.shields.io/badge/Stack-MERN%20+%20TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white&labelColor=1a1a2e" alt="Stack"/>
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=white&labelColor=1a1a2e" alt="React"/>
  <img src="https://img.shields.io/badge/Redis-Cache-DC382D?style=for-the-badge&logo=redis&logoColor=white&labelColor=1a1a2e" alt="Redis"/>
  <img src="https://img.shields.io/badge/TMDB-API-01D277?style=for-the-badge&logo=themoviedatabase&logoColor=white" alt="TMDB"/>
</p>

---

## ✨ Features
OmniFlix is a premium, full-stack streaming platform combining **Netflix's layout architecture** with the **Ben 10 Omnitrix aesthetic**. 

- 🎬 **Cinematic UI:** Immersive, auto-rotating hero banners, frosted glassmorphism panels, and horizontal carousels built with **TailwindCSS & Framer Motion**.
- 👽 **Multi-Profile System:** Support for up to 5 individual user profiles featuring unique alien avatars and isolated watchlists.
- ⚡ **Redis-Accelerated Data Layer:** Global caching middleware guarantees lightning-fast API responses (~2ms) and dramatically reduces TMDB API rate-limit burn.
- 🎭 **Actor Details & Global Search:** Advanced multi-categorized search functionality and dedicated cinematic actor profile pages.
- 🔐 **Robust Security:** JWT-based access/refresh token rotation with a highly fault-tolerant global error interception system.

---

## 📸 Snapshots

*Simply replace the placeholder paths in this README with your actual screenshot files.*

<details>
<summary><b>Click to expand Platform Previews</b></summary>

| 🏠 Landing & Hero Banner | 👽 Profile Selection |
|:---:|:---:|
| <img src="/docs/hero-preview.png" alt="Hero Banner" width="400"/> | <img src="/docs/profiles-preview.png" alt="Profiles" width="400"/> |

| 🎬 Cinematic Actor Profiles | 🔍 Categorized Global Search |
|:---:|:---:|
| <img src="/docs/actor-preview.png" alt="Actor details" width="400"/> | <img src="/docs/search-preview.png" alt="Search grids" width="400"/> |

</details>

---

## 🚀 Quick Start

### 1️⃣ Clone & Install
```bash
git clone https://github.com/your-username/omniflix.git
cd omniflix

# Install Backend
cd server && npm install

# Install Frontend
cd ../client && npm install
```

### 2️⃣ Environment Configuration
Create a `.env` in the `server` directory:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/omniflix
REDIS_URL=redis://localhost:6379

JWT_ACCESS_SECRET=your_access_secret
JWT_REFRESH_SECRET=your_refresh_secret

TMDB_API_KEY=your_tmdb_api_key_here
```

Create a `.env` in the `client` directory:
```env
VITE_API_URL=http://localhost:5000/api
```

### 3️⃣ Run the Omniverse
Start your local MongoDB & Redis instances. Then:

```bash
# Terminal 1 - Boot the Server
cd server
npm run dev

# Terminal 2 - Ignite the Client
cd client
npm run dev
```
> 🖥️ View the app at **http://localhost:5173**

---

## 🛠️ Tech Stack
- **Frontend:** React 19, TypeScript, Vite, Tailwind v4, Zustand, Framer Motion
- **Backend:** Node.js, Express, MongoDB (Mongoose), Redis (Caching), Zod (Validation), TMDB API 

<p align="center">
  <img src="https://img.shields.io/badge/⚡-IT'S_HERO_TIME-00FF41?style=for-the-badge&labelColor=0A1A0F" alt="Hero Time"/>
</p>
