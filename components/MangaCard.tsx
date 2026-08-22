import { Pressable, StyleSheet, Text, View } from 'react-native';

type MangaCardProps = {
  title: string;
  chaptersRead: number;
  totalChapters: number;
  onIncrement: () => void;
  onDecrement: () => void;
  onDelete: () => void;
  onEdit: () => void;
};

export function MangaCard({ title, chaptersRead, totalChapters, onIncrement, onDecrement, onDelete, onEdit }: MangaCardProps) {
  const progressPercent =
    totalChapters === 0 ? 0 : (chaptersRead / totalChapters) * 100;
  const remainingChapters = totalChapters - chaptersRead;

  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{title}</Text>
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
      <View style={styles.buttonRow}>
        <Pressable
          disabled={chaptersRead === 0}
          onPress={onDecrement}
          style={chaptersRead === 0 ? styles.buttonDisabled : undefined}>
          <Text style={styles.buttonText}>-1 chapitre</Text>
        </Pressable>
        <Pressable
          disabled={chaptersRead === totalChapters}
          onPress={onIncrement}
          style={chaptersRead === totalChapters ? styles.buttonDisabled : undefined}>
          <Text style={styles.buttonText}>+1 chapitre</Text>
        </Pressable>
        <Pressable onPress={onEdit}>
          <Text style={styles.editText}>Modifier</Text>
        </Pressable>
        <Pressable onPress={onDelete}>
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
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111111',
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#555555',
  },
  remainingText: {
    fontSize: 13,
    color: '#777777',
    marginTop: 4,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#dddddd',
    borderRadius: 4,
    marginTop: 8,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#2563eb',
    borderRadius: 4,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 16,
  },
  buttonText: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2563eb',
  },
  buttonDisabled: {
    opacity: 0.4,
  },
  editText: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2563eb',
  },
  deleteText: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: 'bold',
    color: '#dc2626',
  },
});
