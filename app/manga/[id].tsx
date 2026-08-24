import AsyncStorage from '@react-native-async-storage/async-storage';
import { Href, useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

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
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Fiche manga</Text>
      {manga ? (
        <>
          {manga.coverUrl !== '' && (
            <Image source={{ uri: manga.coverUrl }} style={styles.coverImage} />
          )}
          <Text style={styles.mangaTitle}>{manga.title}</Text>
          {manga.author !== '' && (
            <Text style={styles.authorText}>Auteur : {manga.author}</Text>
          )}
          <View style={styles.statusBadgeRow}>
            <View style={styles.statusBadge}>
              <Text style={styles.statusBadgeText}>
                {manga.status === 'completed'
                  ? 'État de la série : Terminée'
                  : 'État de la série : En cours'}
              </Text>
            </View>
            <View style={styles.statusBadge}>
              <Text style={styles.statusBadgeText}>
                {manga.readingStatus === 'to-read'
                  ? 'Ma lecture : À lire'
                  : manga.readingStatus === 'completed'
                    ? 'Ma lecture : Terminé'
                    : 'Ma lecture : En cours'}
              </Text>
            </View>
          </View>
          {manga.description !== '' && (
            <View style={styles.synopsisSection}>
              <Text style={styles.descriptionTitle}>Synopsis</Text>
              <Text style={styles.descriptionText}>{manga.description}</Text>
            </View>
          )}
          <View style={styles.progressSection}>
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
          </View>
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
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: '#777777',
    marginBottom: 8,
  },
  coverImage: {
    width: 160,
    height: 240,
    borderRadius: 8,
    marginBottom: 12,
  },
  mangaTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#111111',
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
  statusBadgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#eeeeee',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  statusBadgeText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#333333',
  },
  synopsisSection: {
    backgroundColor: '#f7f7f7',
    borderRadius: 12,
    padding: 12,
    marginTop: 16,
  },
  descriptionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 6,
  },
  descriptionText: {
    fontSize: 15,
    color: '#555555',
    lineHeight: 22,
  },
  progressSection: {
    backgroundColor: '#f7f7f7',
    borderRadius: 12,
    padding: 12,
    marginTop: 16,
  },
  progressText: {
    fontSize: 16,
    color: '#555555',
  },
  remainingText: {
    fontSize: 14,
    color: '#777777',
    marginTop: 6,
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
    backgroundColor: '#2563eb',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignSelf: 'flex-start',
    marginTop: 16,
    marginBottom: 24,
  },
  editText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
  },
});
