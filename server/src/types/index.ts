export interface IUser {
  _id: string;
  email: string;
  password: string;
  username: string;
  role: 'user' | 'admin';
  profiles: IProfile[];
  refreshTokens: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IProfile {
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
  | 'heatblast'
  | 'fourarms'
  | 'xlr8'
  | 'diamondhead'
  | 'upgrade'
  | 'ghostfreak'
  | 'ripjaws'
  | 'stinkfly'
  | 'wildmutt'
  | 'greymatter'
  | 'cannonbolt'
  | 'wildvine'
  | 'benwolf'
  | 'benmummy'
  | 'benvicktor'
  | 'way_big'
  | 'swampfire'
  | 'echo_echo'
  | 'humungousaur'
  | 'jetray'
  | 'big_chill'
  | 'chromastone'
  | 'brainstorm'
  | 'spidermonkey'
  | 'goop'
  | 'alien_x';

export interface ITokenPayload {
  userId: string;
  profileId?: string;
  role: string;
}

export interface TMDBMovie {
  id: number;
  title: string;
  original_title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  vote_count: number;
  genre_ids: number[];
  popularity: number;
  adult: boolean;
  video: boolean;
  original_language: string;
  media_type?: string;
}

export interface TMDBTVShow {
  id: number;
  name: string;
  original_name: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  first_air_date: string;
  vote_average: number;
  vote_count: number;
  genre_ids: number[];
  popularity: number;
  origin_country: string[];
  original_language: string;
  media_type?: string;
}

export interface TMDBResponse<T> {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
}

export interface TMDBMovieDetails extends TMDBMovie {
  budget: number;
  genres: { id: number; name: string }[];
  homepage: string;
  imdb_id: string;
  production_companies: {
    id: number;
    logo_path: string | null;
    name: string;
    origin_country: string;
  }[];
  revenue: number;
  runtime: number;
  status: string;
  tagline: string;
  videos?: {
    results: TMDBVideo[];
  };
  credits?: {
    cast: TMDBCast[];
    crew: TMDBCrew[];
  };
  similar?: TMDBResponse<TMDBMovie>;
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

export interface ApiError {
  message: string;
  statusCode: number;
  stack?: string;
}
