import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';

import { EditMangaForm } from '@/components/EditMangaForm';
import type { Manga } from '@/types/manga';

const MANGAS_STORAGE_KEY = 'mangas';

export default function EditMangaScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [manga, setManga] = useState<Manga | null>(null);
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [coverUrl, setCoverUrl] = useState('');
  const [description, setDescription] = useState('');
  const [totalChapters, setTotalChapters] = useState('');
  const [status, setStatus] = useState<Manga['status']>('ongoing');

  useEffect(() => {
    async function loadManga() {
      try {
        const storedValue = await AsyncStorage.getItem(MANGAS_STORAGE_KEY);
        if (storedValue === null) {
          setManga(null);
          return;
        }

        const parsedMangas: Manga[] = JSON.parse(storedValue);
        const mangaId = Number(id);
        const foundManga = parsedMangas.find((item) => item.id === mangaId) ?? null;
        setManga(foundManga);

        if (foundManga) {
          setTitle(foundManga.title);
          setAuthor(foundManga.author);
          setCoverUrl(foundManga.coverUrl);
          setDescription(foundManga.description ?? '');
          setTotalChapters(String(foundManga.totalChapters));
          setStatus(foundManga.status);
        }
      } catch (error) {
        console.error(error);
        setManga(null);
      }
    }

    loadManga();
  }, [id]);

  async function saveManga() {
    const trimmedTitle = title.trim();
    if (trimmedTitle === '') {
      Alert.alert('Erreur', 'Le titre est obligatoire.');
      return;
    }

    const nextTotalChapters = Number(totalChapters);
    if (!Number.isFinite(nextTotalChapters) || nextTotalChapters <= 0) {
      Alert.alert('Erreur', 'Le nombre de chapitres doit être supérieur à 0.');
      return;
    }

    try {
      const storedValue = await AsyncStorage.getItem(MANGAS_STORAGE_KEY);
      const parsedMangas: Manga[] =
        storedValue === null ? [] : JSON.parse(storedValue);
      const mangaId = Number(id);

      const updatedMangas = parsedMangas.map((item) =>
        item.id === mangaId
          ? {
              ...item,
              title: trimmedTitle,
              author: author.trim(),
              coverUrl: coverUrl.trim(),
              description: description.trim(),
              totalChapters: nextTotalChapters,
              status,
              chaptersRead: Math.min(item.chaptersRead, nextTotalChapters),
            }
          : item
      );

      await AsyncStorage.setItem(
        MANGAS_STORAGE_KEY,
        JSON.stringify(updatedMangas)
      );
      router.back();
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Modifier un manga</Text>
      {manga ? (
        <EditMangaForm
          mangaTitle={manga.title}
          title={title}
          author={author}
          coverUrl={coverUrl}
          description={description}
          totalChapters={totalChapters}
          status={status}
          onTitleChange={setTitle}
          onAuthorChange={setAuthor}
          onCoverUrlChange={setCoverUrl}
          onDescriptionChange={setDescription}
          onTotalChaptersChange={setTotalChapters}
          onStatusChange={setStatus}
          onCancel={() => router.back()}
          onSave={saveManga}
        />
      ) : (
        <Text style={styles.subtitle}>Manga introuvable</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    paddingHorizontal: 24,
    paddingTop: 24,
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
  },
});
