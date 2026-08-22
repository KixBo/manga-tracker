import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import type { Manga } from '@/types/manga';

const MANGAS_STORAGE_KEY = 'mangas';

export default function MangaScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [manga, setManga] = useState<Manga | null>(null);

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
      } catch (error) {
        console.error(error);
        setManga(null);
      }
    }

    loadManga();
  }, [id]);

  const remainingChapters = manga
    ? manga.totalChapters - manga.chaptersRead
    : 0;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Fiche manga</Text>
      {manga ? (
        <>
          <Text style={styles.subtitle}>{manga.title}</Text>
          <Text style={styles.progressText}>
            {manga.chaptersRead} / {manga.totalChapters} chapitres lus
          </Text>
          {remainingChapters === 0 ? (
            <Text style={styles.remainingText}>À jour</Text>
          ) : remainingChapters === 1 ? (
            <Text style={styles.remainingText}>1 chapitre restant</Text>
          ) : (
            <Text style={styles.remainingText}>
              {remainingChapters} chapitres restants
            </Text>
          )}
        </>
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
  progressText: {
    fontSize: 16,
    color: '#555555',
    marginTop: 8,
  },
  remainingText: {
    fontSize: 14,
    color: '#777777',
    marginTop: 4,
  },
});
