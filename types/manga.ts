export type Manga = {
  id: number;
  title: string;
  chaptersRead: number;
  totalChapters: number;
};

export type MangaFilter = 'all' | 'inProgress' | 'upToDate';
