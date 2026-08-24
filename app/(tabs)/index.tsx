import AsyncStorage from '@react-native-async-storage/async-storage';
import { Href, useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text } from 'react-native';

import { AddMangaForm } from '@/components/AddMangaForm';
import { MangaCard } from '@/components/MangaCard';
import { MangaFilters } from '@/components/MangaFilters';
import type { Manga, MangaFilter, MangaSort } from '@/types/manga';

const MANGAS_STORAGE_KEY = 'mangas';

function migrateStoredMangas(parsedMangas: Manga[]): Manga[] {
  const demoAuthors: Record<string, string> = {
    'One Piece': 'Eiichiro Oda',
    'Berserk': 'Kentaro Miura',
    'Vinland Saga': 'Makoto Yukimura',
    'Kingdom': 'Yasuhisa Hara',
    'Kagurabachi': 'Takeru Hokazono',
  };

  return parsedMangas.map((manga) => {
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
      description: typeof manga.description === 'string' ? manga.description : '',
      isFavorite: typeof manga.isFavorite === 'boolean' ? manga.isFavorite : false,
      readingStatus:
        manga.readingStatus === 'to-read' ||
        manga.readingStatus === 'reading' ||
        manga.readingStatus === 'completed'
          ? manga.readingStatus
          : manga.chaptersRead === 0
            ? 'to-read'
            : 'reading',
    };
  });
}

export default function HomeScreen() {
  const router = useRouter();
  const [mangas, setMangas] = useState<Manga[]>([
    { id: 1, title: 'One Piece', author: 'Eiichiro Oda', chaptersRead: 112, totalChapters: 115, status: 'ongoing', coverUrl: '', description: '', isFavorite: false, readingStatus: 'reading' },
    { id: 2, title: 'Berserk', author: 'Kentaro Miura', chaptersRead: 50, totalChapters: 60, status: 'ongoing', coverUrl: '', description: '', isFavorite: false, readingStatus: 'reading' },
    { id: 3, title: 'Vinland Saga', author: 'Makoto Yukimura', chaptersRead: 80, totalChapters: 90, status: 'completed', coverUrl: '', description: '', isFavorite: false, readingStatus: 'reading' },
    { id: 4, title: 'Kingdom', author: 'Yasuhisa Hara', chaptersRead: 35, totalChapters: 40, status: 'ongoing', coverUrl: '', description: '', isFavorite: false, readingStatus: 'reading' },
    { id: 5, title: 'Kagurabachi', author: 'Takeru Hokazono', chaptersRead: 35, totalChapters: 100, status: 'ongoing', coverUrl: '', description: '', isFavorite: false, readingStatus: 'reading' },
  ]);
  const [selectedFilter, setSelectedFilter] = useState<MangaFilter>('all');
  const [selectedSort, setSelectedSort] = useState<MangaSort>('az');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddFormVisible, setIsAddFormVisible] = useState(false);
  const [newMangaTitle, setNewMangaTitle] = useState('');
  const [newMangaAuthor, setNewMangaAuthor] = useState('');
  const [newMangaCoverUrl, setNewMangaCoverUrl] = useState('');
  const [newMangaDescription, setNewMangaDescription] = useState('');
  const [chaptersRead, setChaptersRead] = useState('0');
  const [newMangaTotalChapters, setNewMangaTotalChapters] = useState('');
  const [newMangaStatus, setNewMangaStatus] = useState<Manga['status']>('ongoing');
  const [newMangaReadingStatus, setNewMangaReadingStatus] = useState<Manga['readingStatus']>('to-read');
  const [formError, setFormError] = useState('');
  const [isStorageLoaded, setIsStorageLoaded] = useState(false);

  useFocusEffect(
    useCallback(() => {
      async function loadMangas() {
        try {
          const storedValue = await AsyncStorage.getItem(MANGAS_STORAGE_KEY);
          if (storedValue !== null) {
            const parsedMangas: Manga[] = JSON.parse(storedValue);
            setMangas(migrateStoredMangas(parsedMangas));
          }
        } catch (error) {
          console.error(error);
        } finally {
          setIsStorageLoaded(true);
        }
      }

      loadMangas();
    }, [])
  );

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
      currentMangas.map((manga) => {
        if (manga.id !== id) {
          return manga;
        }

        const nextChaptersRead = Math.min(manga.totalChapters, manga.chaptersRead + 1);
        let nextReadingStatus =
          manga.chaptersRead === 0 &&
          nextChaptersRead === 1 &&
          manga.readingStatus === 'to-read'
            ? 'reading'
            : manga.readingStatus;

        if (nextChaptersRead === manga.totalChapters) {
          nextReadingStatus = 'completed';
        }

        return {
          ...manga,
          chaptersRead: nextChaptersRead,
          readingStatus: nextReadingStatus,
        };
      })
    );
  }

  function decrementChapter(id: number) {
    setMangas((currentMangas) =>
      currentMangas.map((manga) => {
        if (manga.id !== id) {
          return manga;
        }

        const nextChaptersRead = Math.max(0, manga.chaptersRead - 1);
        let nextReadingStatus =
          manga.chaptersRead === 1 &&
          nextChaptersRead === 0 &&
          manga.readingStatus === 'reading'
            ? 'to-read'
            : manga.readingStatus;

        if (
          manga.readingStatus === 'completed' &&
          nextChaptersRead < manga.totalChapters
        ) {
          nextReadingStatus = 'reading';
        }

        return {
          ...manga,
          chaptersRead: nextChaptersRead,
          readingStatus: nextReadingStatus,
        };
      })
    );
  }

  function toggleFavorite(id: number) {
    setMangas((currentMangas) =>
      currentMangas.map((manga) =>
        manga.id === id
          ? { ...manga, isFavorite: !manga.isFavorite }
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
    if (!Number.isInteger(totalChapters) || totalChapters <= 0) {
      setFormError(
        'Le nombre total de chapitres doit être un nombre entier supérieur à 0.'
      );
      return;
    }

    const parsedChaptersRead = Number(chaptersRead);
    if (!Number.isInteger(parsedChaptersRead) || parsedChaptersRead < 0) {
      setFormError(
        'Le nombre de chapitres lus doit être un nombre entier supérieur ou égal à 0.'
      );
      return;
    }

    let nextChaptersRead = parsedChaptersRead;

    if (newMangaReadingStatus === 'to-read') {
      nextChaptersRead = 0;
    } else if (newMangaReadingStatus === 'completed') {
      nextChaptersRead = totalChapters;
    } else if (newMangaReadingStatus === 'reading') {
      if (nextChaptersRead <= 0) {
        setFormError(
          'Un manga en cours de lecture doit avoir au moins 1 chapitre lu.'
        );
        return;
      }
      if (nextChaptersRead >= totalChapters) {
        setFormError(
          'Un manga en cours de lecture doit avoir moins de chapitres lus que le nombre total de chapitres.'
        );
        return;
      }
    }

    if (nextChaptersRead > totalChapters) {
      setFormError(
        'Le nombre de chapitres lus ne peut pas dépasser le nombre total de chapitres.'
      );
      return;
    }

    setFormError('');

    const newManga: Manga = {
      id: Math.max(0, ...mangas.map((manga) => manga.id)) + 1,
      title,
      author: newMangaAuthor.trim(),
      coverUrl: newMangaCoverUrl.trim(),
      description: newMangaDescription.trim(),
      isFavorite: false,
      chaptersRead: nextChaptersRead,
      totalChapters,
      status: newMangaStatus,
      readingStatus: newMangaReadingStatus,
    };

    setMangas((currentMangas) => [...currentMangas, newManga]);
    setNewMangaTitle('');
    setNewMangaAuthor('');
    setNewMangaCoverUrl('');
    setNewMangaDescription('');
    setChaptersRead('0');
    setNewMangaTotalChapters('');
    setNewMangaStatus('ongoing');
    setNewMangaReadingStatus('to-read');
    setIsAddFormVisible(false);
  }

  function openManga(id: number) {
    router.push({
      pathname: '/manga/[id]',
      params: { id },
    });
  }

  const filteredMangas = mangas.filter((manga) => {
    const matchesSearch = manga.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    if (!matchesSearch) {
      return false;
    }

    if (selectedFilter === 'to-read') {
      return manga.readingStatus === 'to-read';
    }
    if (selectedFilter === 'reading') {
      return manga.readingStatus === 'reading';
    }
    if (selectedFilter === 'completed') {
      return manga.readingStatus === 'completed';
    }
    if (selectedFilter === 'favorites') {
      return manga.isFavorite === true;
    }
    return true;
  }).sort((a, b) => {
    const comparison = a.title.localeCompare(b.title, 'fr', { sensitivity: 'base' });
    return selectedSort === 'za' ? -comparison : comparison;
  });

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Manga Tracker</Text>
      <Text style={styles.subtitle}>Ma bibliothèque</Text>

      <MangaFilters
        searchQuery={searchQuery}
        selectedFilter={selectedFilter}
        selectedSort={selectedSort}
        onSearchChange={setSearchQuery}
        onFilterChange={setSelectedFilter}
        onSortChange={setSelectedSort}
      />

      {isAddFormVisible ? (
        <AddMangaForm
          title={newMangaTitle}
          author={newMangaAuthor}
          coverUrl={newMangaCoverUrl}
          description={newMangaDescription}
          chaptersRead={chaptersRead}
          totalChapters={newMangaTotalChapters}
          status={newMangaStatus}
          readingStatus={newMangaReadingStatus}
          formError={formError}
          onTitleChange={setNewMangaTitle}
          onAuthorChange={setNewMangaAuthor}
          onCoverUrlChange={setNewMangaCoverUrl}
          onDescriptionChange={setNewMangaDescription}
          onChaptersReadChange={setChaptersRead}
          onTotalChaptersChange={setNewMangaTotalChapters}
          onStatusChange={setNewMangaStatus}
          onReadingStatusChange={setNewMangaReadingStatus}
          onSubmit={addManga}
          onCancel={() => setIsAddFormVisible(false)}
        />
      ) : (
        <Pressable
          style={styles.addMangaButton}
          onPress={() => setIsAddFormVisible(true)}>
          <Text style={styles.addMangaButtonText}>+ Ajouter un manga</Text>
        </Pressable>
      )}

      {filteredMangas.length === 0 ? (
        <Text style={styles.emptyText}>Aucun manga</Text>
      ) : (
        filteredMangas.map((manga) => (
          <MangaCard
            key={manga.id}
            title={manga.title}
            author={manga.author}
            readingStatus={manga.readingStatus}
            coverUrl={manga.coverUrl}
            chaptersRead={manga.chaptersRead}
            totalChapters={manga.totalChapters}
            isFavorite={manga.isFavorite}
            onIncrement={() => incrementChapter(manga.id)}
            onDecrement={() => decrementChapter(manga.id)}
            onDelete={() => deleteManga(manga.id, manga.title)}
            onEdit={() =>
              router.push({
                pathname: '/manga/[id]/edit',
                params: { id: manga.id },
              } as unknown as Href)
            }
            onOpen={() => openManga(manga.id)}
            onToggleFavorite={() => toggleFavorite(manga.id)}
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
  addMangaButton: {
    backgroundColor: '#2563eb',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 16,
  },
  addMangaButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
