export interface Album {
  id: string;
  name: string;
  artistId: string;
  reviewScore?: number;
  reviewCount?: number;
  releaseDate: string;
  year?: string;
}

export interface Artist {
  id: string;
  name: string;
}

export interface AlbumReview {
  id: string;
  albumId: string;
  userId: string;
  score: number;
  createdAt: string;
  createdAtYearMonth: string;
  reviewText?: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  createdAt: string;
}

export interface RecentAlbumReviewsResponse {
  albumReviews: AlbumReview[];
  artists: Artist[];
  albums: Album[];
  users: User[];
}

export interface RecentAlbumReviewsResponse {
  albumReviews: AlbumReview[];
  artists: Artist[];
  albums: Album[];
  users: User[];
}

export interface UserAlbumReviewsResponse {
  reviews: AlbumReview[];
}

export interface AlbumChartsResponse {
  artists: Artist[];
  albums: Album[];
}

export interface ReviewAlbumRequest {
  artist: string;
  albumName: string;
  score: number;
  reviewText?: string;
}

export interface AotyItem {
  userId: string;
  year: string;
  albumId: string;
  artistId?: string;
}
