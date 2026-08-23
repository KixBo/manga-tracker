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
  readingStatus: 'to-read' | 'reading' | 'completed';
};

export type MangaFilter = 'all' | 'to-read' | 'reading' | 'completed' | 'favorites';

export type MangaSort = 'az' | 'za';
