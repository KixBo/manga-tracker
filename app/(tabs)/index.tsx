import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text } from 'react-native';

import { AddMangaForm } from '@/components/AddMangaForm';
import { EditMangaForm } from '@/components/EditMangaForm';
import { MangaCard } from '@/components/MangaCard';
import { MangaFilters } from '@/components/MangaFilters';
import type { Manga, MangaFilter } from '@/types/manga';

const MANGAS_STORAGE_KEY = 'mangas';

export default function HomeScreen() {
  const router = useRouter();
  const [mangas, setMangas] = useState<Manga[]>([
    { id: 1, title: 'One Piece', author: 'Eiichiro Oda', chaptersRead: 112, totalChapters: 115, status: 'ongoing', coverUrl: '' },
    { id: 2, title: 'Berserk', author: 'Kentaro Miura', chaptersRead: 50, totalChapters: 60, status: 'ongoing', coverUrl: '' },
    { id: 3, title: 'Vinland Saga', author: 'Makoto Yukimura', chaptersRead: 80, totalChapters: 90, status: 'completed', coverUrl: '' },
    { id: 4, title: 'Kingdom', author: 'Yasuhisa Hara', chaptersRead: 35, totalChapters: 40, status: 'ongoing', coverUrl: '' },
    { id: 5, title: 'Kagurabachi', author: 'Takeru Hokazono', chaptersRead: 35, totalChapters: 100, status: 'ongoing', coverUrl: '' },
  ]);
  const [selectedFilter, setSelectedFilter] = useState<MangaFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [newMangaTitle, setNewMangaTitle] = useState('');
  const [newMangaAuthor, setNewMangaAuthor] = useState('');
  const [newMangaCoverUrl, setNewMangaCoverUrl] = useState('');
  const [newMangaTotalChapters, setNewMangaTotalChapters] = useState('');
  const [newMangaStatus, setNewMangaStatus] = useState<Manga['status']>('ongoing');
  const [formError, setFormError] = useState('');
  const [isStorageLoaded, setIsStorageLoaded] = useState(false);
  const [editingMangaId, setEditingMangaId] = useState<number | null>(null);
  const [editMangaTitle, setEditMangaTitle] = useState('');
  const [editMangaAuthor, setEditMangaAuthor] = useState('');
  const [editMangaCoverUrl, setEditMangaCoverUrl] = useState('');
  const [editMangaTotalChapters, setEditMangaTotalChapters] = useState('');
  const [editMangaStatus, setEditMangaStatus] = useState<Manga['status']>('ongoing');

  useEffect(() => {
    async function loadMangas() {
      try {
        const storedValue = await AsyncStorage.getItem(MANGAS_STORAGE_KEY);
        if (storedValue !== null) {
          const parsedMangas: Manga[] = JSON.parse(storedValue);
          const demoAuthors: Record<string, string> = {
            'One Piece': 'Eiichiro Oda',
            'Berserk': 'Kentaro Miura',
            'Vinland Saga': 'Makoto Yukimura',
            'Kingdom': 'Yasuhisa Hara',
            'Kagurabachi': 'Takeru Hokazono',
          };
          const migratedMangas = parsedMangas.map((manga) => {
            return {
              ...manga,
              author:
                typeof manga.author === 'string'
                  ? manga.author
                  : demoAuthors[manga.title] ?? '',
              status:
                manga.status === 'ongoing' || manga.status === 'completed'
                  ? manga.status
                  : manga.title === 'Vinland Saga'
                    ? 'completed'
                    : 'ongoing',
              coverUrl: typeof manga.coverUrl === 'string' ? manga.coverUrl : '',
            };
          });
          setMangas(migratedMangas);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsStorageLoaded(true);
      }
    }

    loadMangas();
  }, []);

  useEffect(() => {
    if (!isStorageLoaded) {
      return;
    }

    async function saveMangas() {
      try {
        await AsyncStorage.setItem(MANGAS_STORAGE_KEY, JSON.stringify(mangas));
      } catch (error) {
        console.error(error);
      }
    }

    saveMangas();
  }, [mangas, isStorageLoaded]);

  function incrementChapter(id: number) {
    setMangas((currentMangas) =>
      currentMangas.map((manga) =>
        manga.id === id
          ? { ...manga, chaptersRead: Math.min(manga.totalChapters, manga.chaptersRead + 1) }
          : manga
      )
    );
  }

  function decrementChapter(id: number) {
    setMangas((currentMangas) =>
      currentMangas.map((manga) =>
        manga.id === id
          ? { ...manga, chaptersRead: Math.max(0, manga.chaptersRead - 1) }
          : manga
      )
    );
  }

  function deleteManga(id: number, title: string) {
    Alert.alert(
      `Supprimer ${title} ?`,
      'Voulez-vous vraiment supprimer ce manga ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: () => {
            setMangas((currentMangas) =>
              currentMangas.filter((manga) => manga.id !== id)
            );
          },
        },
      ]
    );
  }

  function addManga() {
    const title = newMangaTitle.trim();
    if (title === '') {
      setFormError('Le titre est obligatoire.');
      return;
    }

    const totalChapters = Number(newMangaTotalChapters);
    if (!Number.isFinite(totalChapters) || totalChapters <= 0) {
      setFormError('Le nombre de chapitres doit être supérieur à 0.');
      return;
    }

    setFormError('');

    const newManga: Manga = {
      id: Math.max(0, ...mangas.map((manga) => manga.id)) + 1,
      title,
      author: newMangaAuthor.trim(),
      coverUrl: newMangaCoverUrl.trim(),
      chaptersRead: 0,
      totalChapters,
      status: newMangaStatus,
    };

    setMangas((currentMangas) => [...currentMangas, newManga]);
    setNewMangaTitle('');
    setNewMangaAuthor('');
    setNewMangaCoverUrl('');
    setNewMangaTotalChapters('');
    setNewMangaStatus('ongoing');
  }

  function openManga(id: number) {
    router.push({
      pathname: '/manga/[id]',
      params: { id },
    });
  }

  function startEditingManga(manga: Manga) {
    setEditingMangaId(manga.id);
    setEditMangaTitle(manga.title);
    setEditMangaAuthor(manga.author);
    setEditMangaCoverUrl(manga.coverUrl);
    setEditMangaTotalChapters(String(manga.totalChapters));
    setEditMangaStatus(manga.status);
  }

  function cancelEditing() {
    setEditingMangaId(null);
    setEditMangaTitle('');
    setEditMangaAuthor('');
    setEditMangaCoverUrl('');
    setEditMangaTotalChapters('');
    setEditMangaStatus('ongoing');
  }

  function saveEditingManga() {
    if (editingMangaId === null) {
      return;
    }

    const title = editMangaTitle.trim();
    if (title === '') {
      Alert.alert('Erreur', 'Le titre est obligatoire.');
      return;
    }

    const totalChapters = Number(editMangaTotalChapters);
    if (!Number.isFinite(totalChapters) || totalChapters <= 0) {
      Alert.alert('Erreur', 'Le nombre de chapitres doit être supérieur à 0.');
      return;
    }

    setMangas((currentMangas) =>
      currentMangas.map((manga) =>
        manga.id === editingMangaId
          ? {
              ...manga,
              title,
              author: editMangaAuthor.trim(),
              coverUrl: editMangaCoverUrl.trim(),
              totalChapters,
              status: editMangaStatus,
              chaptersRead: Math.min(manga.chaptersRead, totalChapters),
            }
          : manga
      )
    );

    cancelEditing();
  }

  const filteredMangas = mangas.filter((manga) => {
    const matchesSearch = manga.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    if (!matchesSearch) {
      return false;
    }

    if (selectedFilter === 'inProgress') {
      return manga.chaptersRead < manga.totalChapters;
    }
    if (selectedFilter === 'upToDate') {
      return manga.chaptersRead === manga.totalChapters;
    }
    return true;
  });

  const editingManga = mangas.find((manga) => manga.id === editingMangaId);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Manga Tracker</Text>
      <Text style={styles.subtitle}>Ma bibliothèque</Text>

      <MangaFilters
        searchQuery={searchQuery}
        selectedFilter={selectedFilter}
        onSearchChange={setSearchQuery}
        onFilterChange={setSelectedFilter}
      />

      <AddMangaForm
        title={newMangaTitle}
        author={newMangaAuthor}
        coverUrl={newMangaCoverUrl}
        totalChapters={newMangaTotalChapters}
        status={newMangaStatus}
        formError={formError}
        onTitleChange={setNewMangaTitle}
        onAuthorChange={setNewMangaAuthor}
        onCoverUrlChange={setNewMangaCoverUrl}
        onTotalChaptersChange={setNewMangaTotalChapters}
        onStatusChange={setNewMangaStatus}
        onSubmit={addManga}
      />

      {editingManga && (
        <EditMangaForm
          mangaTitle={editingManga.title}
          title={editMangaTitle}
          author={editMangaAuthor}
          coverUrl={editMangaCoverUrl}
          totalChapters={editMangaTotalChapters}
          status={editMangaStatus}
          onTitleChange={setEditMangaTitle}
          onAuthorChange={setEditMangaAuthor}
          onCoverUrlChange={setEditMangaCoverUrl}
          onTotalChaptersChange={setEditMangaTotalChapters}
          onStatusChange={setEditMangaStatus}
          onCancel={cancelEditing}
          onSave={saveEditingManga}
        />
      )}

      {filteredMangas.length === 0 ? (
        <Text style={styles.emptyText}>Aucun manga</Text>
      ) : (
        filteredMangas.map((manga) => (
          <MangaCard
            key={manga.id}
            title={manga.title}
            author={manga.author}
            status={manga.status}
            coverUrl={manga.coverUrl}
            chaptersRead={manga.chaptersRead}
            totalChapters={manga.totalChapters}
            onIncrement={() => incrementChapter(manga.id)}
            onDecrement={() => decrementChapter(manga.id)}
            onDelete={() => deleteManga(manga.id, manga.title)}
            onEdit={() => startEditingManga(manga)}
            onOpen={() => openManga(manga.id)}
          />
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 64,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111111',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: '#555555',
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 14,
    color: '#777777',
    marginBottom: 12,
  },
});
