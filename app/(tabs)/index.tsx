import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { AddMangaForm } from '@/components/AddMangaForm';
import { MangaCard } from '@/components/MangaCard';
import type { Manga } from '@/types/manga';

type Filter = 'all' | 'inProgress' | 'upToDate';

const MANGAS_STORAGE_KEY = 'mangas';

export default function HomeScreen() {
  const [mangas, setMangas] = useState<Manga[]>([
    { id: 1, title: 'One Piece', chaptersRead: 112, totalChapters: 115 },
    { id: 2, title: 'Berserk', chaptersRead: 50, totalChapters: 60 },
    { id: 3, title: 'Vinland Saga', chaptersRead: 80, totalChapters: 90 },
    { id: 4, title: 'Kingdom', chaptersRead: 35, totalChapters: 40 },
    { id: 5, title: 'Kagurabachi', chaptersRead: 35, totalChapters: 100 },
  ]);
  const [selectedFilter, setSelectedFilter] = useState<Filter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [newMangaTitle, setNewMangaTitle] = useState('');
  const [newMangaTotalChapters, setNewMangaTotalChapters] = useState('');
  const [formError, setFormError] = useState('');
  const [isStorageLoaded, setIsStorageLoaded] = useState(false);
  const [editingMangaId, setEditingMangaId] = useState<number | null>(null);
  const [editMangaTitle, setEditMangaTitle] = useState('');
  const [editMangaTotalChapters, setEditMangaTotalChapters] = useState('');

  useEffect(() => {
    async function loadMangas() {
      try {
        const storedValue = await AsyncStorage.getItem(MANGAS_STORAGE_KEY);
        if (storedValue !== null) {
          const parsedMangas: Manga[] = JSON.parse(storedValue);
          setMangas(parsedMangas);
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
      chaptersRead: 0,
      totalChapters,
    };

    setMangas((currentMangas) => [...currentMangas, newManga]);
    setNewMangaTitle('');
    setNewMangaTotalChapters('');
  }

  function startEditingManga(manga: Manga) {
    setEditingMangaId(manga.id);
    setEditMangaTitle(manga.title);
    setEditMangaTotalChapters(String(manga.totalChapters));
  }

  function cancelEditing() {
    setEditingMangaId(null);
    setEditMangaTitle('');
    setEditMangaTotalChapters('');
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
              totalChapters,
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

      <TextInput
        style={styles.searchInput}
        placeholder="Rechercher un manga..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      <View style={styles.filterRow}>
        <Pressable
          onPress={() => setSelectedFilter('all')}
          style={[
            styles.filterButton,
            selectedFilter === 'all' && styles.filterButtonSelected,
          ]}>
          <Text
            style={[
              styles.filterButtonText,
              selectedFilter === 'all' && styles.filterButtonTextSelected,
            ]}>
            Tous
          </Text>
        </Pressable>
        <Pressable
          onPress={() => setSelectedFilter('inProgress')}
          style={[
            styles.filterButton,
            selectedFilter === 'inProgress' && styles.filterButtonSelected,
          ]}>
          <Text
            style={[
              styles.filterButtonText,
              selectedFilter === 'inProgress' && styles.filterButtonTextSelected,
            ]}>
            En cours
          </Text>
        </Pressable>
        <Pressable
          onPress={() => setSelectedFilter('upToDate')}
          style={[
            styles.filterButton,
            selectedFilter === 'upToDate' && styles.filterButtonSelected,
          ]}>
          <Text
            style={[
              styles.filterButtonText,
              selectedFilter === 'upToDate' && styles.filterButtonTextSelected,
            ]}>
            À jour
          </Text>
        </Pressable>
      </View>

      <AddMangaForm
        title={newMangaTitle}
        totalChapters={newMangaTotalChapters}
        formError={formError}
        onTitleChange={setNewMangaTitle}
        onTotalChaptersChange={setNewMangaTotalChapters}
        onSubmit={addManga}
      />

      {editingManga && (
        <>
          <Text style={styles.subtitle}>Modification de : {editingManga.title}</Text>
          <TextInput
            style={styles.formInput}
            placeholder="Titre du manga"
            value={editMangaTitle}
            onChangeText={setEditMangaTitle}
          />
          <TextInput
            style={styles.formInput}
            placeholder="Nombre total de chapitres"
            value={editMangaTotalChapters}
            onChangeText={setEditMangaTotalChapters}
            keyboardType="numeric"
          />
          <View style={styles.filterRow}>
            <Pressable style={styles.filterButton} onPress={cancelEditing}>
              <Text style={styles.filterButtonText}>Annuler</Text>
            </Pressable>
            <Pressable style={styles.addButton} onPress={saveEditingManga}>
              <Text style={styles.addButtonText}>Enregistrer</Text>
            </Pressable>
          </View>
        </>
      )}

      {filteredMangas.length === 0 ? (
        <Text style={styles.emptyText}>Aucun manga</Text>
      ) : (
        filteredMangas.map((manga) => (
          <MangaCard
            key={manga.id}
            title={manga.title}
            chaptersRead={manga.chaptersRead}
            totalChapters={manga.totalChapters}
            onIncrement={() => incrementChapter(manga.id)}
            onDecrement={() => decrementChapter(manga.id)}
            onDelete={() => deleteManga(manga.id, manga.title)}
            onEdit={() => startEditingManga(manga)}
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
  searchInput: {
    backgroundColor: '#f4f4f4',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    marginBottom: 12,
  },
  filterRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  filterButton: {
    backgroundColor: '#eeeeee',
    borderRadius: 16,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  filterButtonSelected: {
    backgroundColor: '#2563eb',
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333333',
  },
  filterButtonTextSelected: {
    color: '#ffffff',
  },
  emptyText: {
    fontSize: 14,
    color: '#777777',
    marginBottom: 12,
  },
  formInput: {
    backgroundColor: '#f4f4f4',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    marginBottom: 8,
  },
  addButton: {
    backgroundColor: '#2563eb',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 16,
  },
  addButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
