<p align="center">
  <img src="https://img.shields.io/badge/🟢-OMNIFLIX-00FF41?style=for-the-badge&labelColor=0A1A0F" alt="OmniFlix" height="40"/>
</p>

<h1 align="center">OmniFlix — Stream the Omniverse</h1>

<p align="center">
  <em>A cinematic streaming platform powered by the Omnitrix</em>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Stack-MERN%20+%20TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white&labelColor=1a1a2e" alt="Stack"/>
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=white&labelColor=1a1a2e" alt="React"/>
  <img src="https://img.shields.io/badge/Node--Cache-In--Memory-01D277?style=for-the-badge&logo=nodedotjs&logoColor=white&labelColor=1a1a2e" alt="NodeCache"/>
  <img src="https://img.shields.io/badge/TMDB-API-01D277?style=for-the-badge&logo=themoviedatabase&logoColor=white" alt="TMDB"/>
</p>

---

##  What's New
- **Categorized Browse Hub:** Dedicated sections for Anime, Cartoons, Marvel, DC, Harry Potter, Bollywood, and Hollywood localized content.
- **Themed Error Pages:** Immersive custom 404/500 screens matching the signature Ben 10/Omnitrix aesthetic.
- **In-Memory Caching:** Replaced Redis with `node-cache` for a simpler, zero-config local caching layer and lightning-fast API responses.
- **Standardized Backend Responses:** Unified, reliable API payload format across all backend controllers.

---

##  Snapshots

*Simply place your actual screenshot files in the `/docs` directory.*

<details>
<summary><b>Click to expand Previews</b></summary>

| Hero Banner | Categorized Browse |
|:---:|:---:|
| <img src="/docs/hero-preview.png" alt="Hero Banner" width="400"/> | <img src="/docs/browse-preview.png" alt="Browse" width="400"/> |

| Themed Error Page | Actor Profiles |
|:---:|:---:|
| <img src="/docs/error-preview.png" alt="Error Page" width="400"/> | <img src="/docs/actor-preview.png" alt="Actor details" width="400"/> |

</details>

---

##  Quick Start

### 1. Zero-Config Setup
```bash
git clone https://github.com/your-username/omniflix.git
cd omniflix

# Install dependencies
cd server && npm install
cd ../client && npm install
```

### 2. Environment Variables
Create a `.env` in the `server` directory:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/omniflix

JWT_ACCESS_SECRET=your_access_secret
JWT_REFRESH_SECRET=your_refresh_secret

TMDB_API_KEY=your_tmdb_api_key
```

Create a `.env` in the `client` directory:
```env
VITE_API_URL=http://localhost:5000/api
```

### 3. Hero Time
Start your local MongoDB instance. (No Redis required!)

```bash
# Terminal 1 - Boot Server
cd server && npm run dev

# Terminal 2 - Ignite Client
cd client && npm run dev
```
> View the Omniverse at **http://localhost:5173**

---

##  Tech Stack
- **Frontend:** React 19, TypeScript, Vite, Tailwind v4, Zustand, Framer Motion
- **Backend:** Node.js, Express, MongoDB (Mongoose), `node-cache`, Zod, TMDB API 

<p align="center">
  <img src="https://img.shields.io/badge/⚡-IT'S_HERO_TIME-00FF41?style=for-the-badge&labelColor=0A1A0F" alt="Hero Time"/>
</p>
