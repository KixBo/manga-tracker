export type Manga = {
  id: number;
  title: string;
  author: string;
  chaptersRead: number;
  totalChapters: number;
};

export type MangaFilter = 'all' | 'inProgress' | 'upToDate';
