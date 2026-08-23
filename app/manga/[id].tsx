import AsyncStorage from '@react-native-async-storage/async-storage';
import { Href, useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

import type { Manga } from '@/types/manga';

const MANGAS_STORAGE_KEY = 'mangas';

export default function MangaScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [manga, setManga] = useState<Manga | null>(null);

  useFocusEffect(
    useCallback(() => {
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
    }, [id])
  );

  const remainingChapters = manga
    ? manga.totalChapters - manga.chaptersRead
    : 0;
  const progressPercent =
    manga === null || manga.totalChapters === 0
      ? 0
      : (manga.chaptersRead / manga.totalChapters) * 100;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Fiche manga</Text>
      {manga ? (
        <>
          {manga.coverUrl !== '' && (
            <Image source={{ uri: manga.coverUrl }} style={styles.coverImage} />
          )}
          <Text style={styles.subtitle}>{manga.title}</Text>
          <Text style={styles.authorText}>Auteur : {manga.author}</Text>
          <Text style={styles.statusText}>
            {manga.status === 'completed' ? 'Statut : Terminé' : 'Statut : En cours'}
          </Text>
          <Text style={styles.progressText}>
            {manga.chaptersRead} / {manga.totalChapters} chapitres lus
          </Text>
          <View style={styles.progressRow}>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${progressPercent}%` }]} />
            </View>
            <Text style={styles.percentText}>{Math.round(progressPercent)} %</Text>
          </View>
          {remainingChapters === 0 ? (
            <Text style={styles.remainingText}>À jour</Text>
          ) : remainingChapters === 1 ? (
            <Text style={styles.remainingText}>1 chapitre restant</Text>
          ) : (
            <Text style={styles.remainingText}>
              {remainingChapters} chapitres restants
            </Text>
          )}
          <Pressable
            onPress={() =>
              router.push({
                pathname: '/manga/[id]/edit',
                params: { id: manga.id },
              } as unknown as Href)
            }
            style={styles.actionButton}>
            <Text style={styles.editText}>Modifier</Text>
          </Pressable>
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
  coverImage: {
    width: 160,
    height: 240,
    borderRadius: 8,
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 18,
    color: '#555555',
  },
  authorText: {
    fontSize: 16,
    color: '#555555',
    marginTop: 4,
  },
  statusText: {
    fontSize: 16,
    color: '#555555',
    marginTop: 4,
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
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: 8,
  },
  progressBar: {
    flex: 1,
    height: 8,
    backgroundColor: '#dddddd',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#2563eb',
    borderRadius: 4,
  },
  percentText: {
    fontSize: 14,
    color: '#555555',
  },
  actionButton: {
    paddingVertical: 8,
    paddingHorizontal: 4,
    alignSelf: 'flex-start',
  },
  editText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2563eb',
  },
});
