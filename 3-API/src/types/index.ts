export interface Album {
  id: string;
  title: string;
  artist: string;
  year?: number;
  genre?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Artist {
  id: string;
  name: string;
  genre?: string;
  country?: string;
  createdAt: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  createdAt: string;
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