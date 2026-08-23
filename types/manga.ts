export type Manga = {
  id: number;
  title: string;
  author: string;
  chaptersRead: number;
  totalChapters: number;
  status: 'ongoing' | 'completed';
  coverUrl: string;
};

export type MangaFilter = 'all' | 'ongoing' | 'completed';
