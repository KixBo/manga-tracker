import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text } from 'react-native';

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
  const [chaptersRead, setChaptersRead] = useState('');
  const [totalChapters, setTotalChapters] = useState('');
  const [status, setStatus] = useState<Manga['status']>('ongoing');
  const [readingStatus, setReadingStatus] = useState<Manga['readingStatus']>('to-read');

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
          setChaptersRead(String(foundManga.chaptersRead));
          setTotalChapters(String(foundManga.totalChapters));
          setStatus(foundManga.status);
          setReadingStatus(foundManga.readingStatus);
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
    if (!Number.isInteger(nextTotalChapters) || nextTotalChapters <= 0) {
      Alert.alert(
        'Erreur',
        'Le nombre total de chapitres doit être un nombre entier supérieur à 0.'
      );
      return;
    }

    const parsedChaptersRead = Number(chaptersRead);
    if (!Number.isInteger(parsedChaptersRead) || parsedChaptersRead < 0) {
      Alert.alert(
        'Erreur',
        'Le nombre de chapitres lus doit être un nombre entier supérieur ou égal à 0.'
      );
      return;
    }

    let nextChaptersRead = parsedChaptersRead;
    if (readingStatus === 'to-read') {
      nextChaptersRead = 0;
    } else if (readingStatus === 'completed') {
      nextChaptersRead = nextTotalChapters;
    } else if (readingStatus === 'reading') {
      if (nextChaptersRead <= 0) {
        Alert.alert(
          'Erreur',
          'Un manga en cours de lecture doit avoir au moins 1 chapitre lu.'
        );
        return;
      }
      if (nextChaptersRead >= nextTotalChapters) {
        Alert.alert(
          'Erreur',
          'Un manga en cours de lecture doit avoir moins de chapitres lus que le nombre total de chapitres.'
        );
        return;
      }
    }

    if (nextChaptersRead > nextTotalChapters) {
      Alert.alert(
        'Erreur',
        'Le nombre de chapitres lus ne peut pas dépasser le nombre total de chapitres.'
      );
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
              readingStatus,
              chaptersRead: nextChaptersRead,
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
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Modifier un manga</Text>
      {manga ? (
        <EditMangaForm
          mangaTitle={manga.title}
          title={title}
          author={author}
          coverUrl={coverUrl}
          description={description}
          chaptersRead={chaptersRead}
          totalChapters={totalChapters}
          status={status}
          readingStatus={readingStatus}
          onTitleChange={setTitle}
          onAuthorChange={setAuthor}
          onCoverUrlChange={setCoverUrl}
          onDescriptionChange={setDescription}
          onChaptersReadChange={setChaptersRead}
          onTotalChaptersChange={setTotalChapters}
          onStatusChange={setStatus}
          onReadingStatusChange={setReadingStatus}
          onCancel={() => router.back()}
          onSave={saveManga}
        />
      ) : (
        <Text style={styles.subtitle}>Manga introuvable</Text>
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
    paddingTop: 24,
    paddingBottom: 24,
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
