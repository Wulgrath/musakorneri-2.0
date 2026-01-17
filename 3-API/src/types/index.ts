export interface Album {
  id: string;
  name: string;
  artistId: string;
  year?: string;
  createdAt: string;
}

export interface Artist {
  id: string;
  name: string;
  createdAt: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  createdAt: string;
}

export interface AlbumReview {
  id: string;
  userId: string;
  artistId: string;
  albumId: string;
  score: number;
  createdAt: string;
  createdAtYearMonth: string;
}

export interface CreateAlbumRequest {
  id?: string;
  title: string;
  artist: string;
  year?: number;
  genre?: string;
}

export interface CreateArtistRequest {
  id?: string;
  name: string;
  genre?: string;
  country?: string;
}

export interface CreateUserRequest {
  id?: string;
  username: string;
  email: string;
}
