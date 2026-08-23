export type Manga = {
  id: number;
  title: string;
  author: string;
  chaptersRead: number;
  totalChapters: number;
  status: 'ongoing' | 'completed';
  coverUrl: string;
  description: string;
  isFavorite: boolean;
};

export type MangaFilter = 'all' | 'ongoing' | 'completed' | 'favorites';

export type MangaSort = 'az' | 'za';
