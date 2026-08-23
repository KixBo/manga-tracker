import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

import type { Manga } from '@/types/manga';

type MangaCardProps = {
  title: string;
  author: string;
  status: Manga['status'];
  readingStatus: Manga['readingStatus'];
  coverUrl: string;
  chaptersRead: number;
  totalChapters: number;
  isFavorite: boolean;
  onIncrement: () => void;
  onDecrement: () => void;
  onDelete: () => void;
  onEdit: () => void;
  onOpen: () => void;
  onToggleFavorite: () => void;
};

export function MangaCard({ title, author, status, readingStatus, coverUrl, chaptersRead, totalChapters, isFavorite, onIncrement, onDecrement, onDelete, onEdit, onOpen, onToggleFavorite }: MangaCardProps) {
  const progressPercent =
    totalChapters === 0 ? 0 : (chaptersRead / totalChapters) * 100;
  const remainingChapters = totalChapters - chaptersRead;

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        {coverUrl !== '' && (
          <Image source={{ uri: coverUrl }} style={styles.coverImage} />
        )}
        <View style={styles.infoColumn}>
          <View style={styles.titleRow}>
            <Text style={styles.cardTitle}>{title}</Text>
            <Pressable onPress={onToggleFavorite} style={styles.favoriteButton}>
              <Text style={styles.favoriteStar}>{isFavorite ? '★' : '☆'}</Text>
            </Pressable>
          </View>
          <Text style={styles.authorText}>{author}</Text>
          <Text style={styles.statusText}>
            {status === 'completed' ? 'Série : Terminée' : 'Série : En cours'}
          </Text>
          <Text style={styles.statusText}>
            {readingStatus === 'to-read'
              ? 'Lecture : À lire'
              : readingStatus === 'completed'
                ? 'Lecture : Terminé'
                : 'Lecture : En cours'}
          </Text>
          <Text style={styles.cardSubtitle}>
            {chaptersRead} / {totalChapters} chapitres lus
          </Text>
          {remainingChapters === 0 ? (
            <Text style={styles.remainingText}>À jour</Text>
          ) : remainingChapters === 1 ? (
            <Text style={styles.remainingText}>1 chapitre restant</Text>
          ) : (
            <Text style={styles.remainingText}>{remainingChapters} chapitres restants</Text>
          )}
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${progressPercent}%` }]} />
          </View>
        </View>
      </View>
      <View style={styles.chapterButtonRow}>
        <Pressable
          disabled={chaptersRead === 0}
          onPress={onDecrement}
          style={[
            styles.chapterButton,
            chaptersRead === 0 && styles.buttonDisabled,
          ]}>
          <Text style={styles.chapterButtonText}>-1 chapitre</Text>
        </Pressable>
        <Pressable
          disabled={chaptersRead === totalChapters}
          onPress={onIncrement}
          style={[
            styles.chapterButton,
            chaptersRead === totalChapters && styles.buttonDisabled,
          ]}>
          <Text style={styles.chapterButtonText}>+1 chapitre</Text>
        </Pressable>
      </View>
      <View style={styles.actionButtonRow}>
        <Pressable onPress={onOpen} style={styles.actionButton}>
          <Text style={styles.buttonText}>Voir la fiche</Text>
        </Pressable>
        <Pressable onPress={onEdit} style={styles.actionButton}>
          <Text style={styles.editText}>Modifier</Text>
        </Pressable>
        <Pressable onPress={onDelete} style={styles.actionButton}>
          <Text style={styles.deleteText}>Supprimer</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#f4f4f4',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  coverImage: {
    width: 80,
    height: 120,
    borderRadius: 8,
  },
  infoColumn: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111111',
    marginBottom: 2,
  },
  favoriteButton: {
    paddingVertical: 4,
    paddingLeft: 8,
  },
  favoriteStar: {
    fontSize: 18,
    color: '#111111',
  },
  authorText: {
    fontSize: 14,
    color: '#555555',
  },
  statusText: {
    fontSize: 13,
    color: '#777777',
    marginBottom: 2,
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#555555',
  },
  remainingText: {
    fontSize: 13,
    color: '#777777',
    marginTop: 2,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#dddddd',
    borderRadius: 4,
    marginTop: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#2563eb',
    borderRadius: 4,
  },
  chapterButtonRow: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 8,
  },
  actionButtonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 4,
  },
  actionButton: {
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  chapterButton: {
    backgroundColor: '#2563eb',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  chapterButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  buttonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2563eb',
  },
  buttonDisabled: {
    opacity: 0.4,
  },
  editText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2563eb',
  },
  deleteText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#dc2626',
  },
});
