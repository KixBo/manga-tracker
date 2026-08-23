export type Manga = {
  id: number;
  title: string;
  author: string;
  chaptersRead: number;
  totalChapters: number;
  status: 'ongoing' | 'completed';
};

export type MangaFilter = 'all' | 'inProgress' | 'upToDate';
