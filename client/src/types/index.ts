// ===== Auth Types =====
export interface User {
  _id: string;
  email: string;
  username: string;
  role: 'user' | 'admin';
  profiles: Profile[];
  createdAt: string;
  updatedAt: string;
}

export interface Profile {
  _id: string;
  name: string;
  avatar: AlienAvatar;
  watchlist: number[];
  preferences: {
    genres: number[];
    language: string;
  };
}

export type AlienAvatar =
  | 'heatblast' | 'fourarms' | 'xlr8' | 'diamondhead' | 'upgrade'
  | 'ghostfreak' | 'ripjaws' | 'stinkfly' | 'wildmutt' | 'greymatter'
  | 'cannonbolt' | 'wildvine' | 'benwolf' | 'benmummy' | 'benvicktor'
  | 'way_big' | 'swampfire' | 'echo_echo' | 'humungousaur' | 'jetray'
  | 'big_chill' | 'chromastone' | 'brainstorm' | 'spidermonkey' | 'goop' | 'alien_x';

export interface AuthResponse {
  message: string;
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface TokenRefreshResponse {
  accessToken: string;
  refreshToken: string;
}

// ===== TMDB Types =====
export interface TMDBMovie {
  id: number;
  title: string;
  name?: string;
  original_title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  first_air_date?: string;
  vote_average: number;
  vote_count: number;
  genre_ids: number[];
  popularity: number;
  adult: boolean;
  video: boolean;
  original_language: string;
  media_type?: string;
}

export interface TMDBResponse {
  page: number;
  results: TMDBMovie[];
  total_pages: number;
  total_results: number;
}

export interface TMDBMovieDetails extends TMDBMovie {
  budget: number;
  genres: Genre[];
  homepage: string;
  imdb_id: string;
  production_companies: ProductionCompany[];
  revenue: number;
  runtime: number;
  status: string;
  tagline: string;
  videos?: { results: TMDBVideo[] };
  credits?: { cast: TMDBCast[]; crew: TMDBCrew[] };
  similar?: TMDBResponse;
}

export interface Genre {
  id: number;
  name: string;
}

export interface ProductionCompany {
  id: number;
  logo_path: string | null;
  name: string;
  origin_country: string;
}

export interface TMDBVideo {
  id: string;
  key: string;
  name: string;
  site: string;
  type: string;
  official: boolean;
}

export interface TMDBCast {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
  order: number;
}

export interface TMDBCrew {
  id: number;
  name: string;
  job: string;
  department: string;
  profile_path: string | null;
}

// ===== UI Types =====
export interface MovieRow {
  title: string;
  endpoint: string;
  movies: TMDBMovie[];
}

export interface AlienAvatarInfo {
  id: AlienAvatar;
  name: string;
  color: string;
  glowColor: string;
  emoji: string;
  description: string;
}

// ===== IMDb Types =====
export interface IMDbRating {
  source: string;
  value: string;
}

export interface IMDbData {
  imdbRating: number | null;
  imdbVotes: string | null;
  imdbId: string;
  ratings: IMDbRating[];
  metascore: number | null;
  rated: string | null;
  awards: string | null;
  boxOffice: string | null;
  director: string | null;
  writer: string | null;
  actors: string | null;
  country: string | null;
  language: string | null;
  dvd: string | null;
  production: string | null;
}
