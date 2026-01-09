export interface Album {
  id: string;
  title: string;
  artist: string;
  year?: number;
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

export interface ReviewAlbumRequest {
  artist: string;
  albumName: string;
  year: string;
  score: number;
}
