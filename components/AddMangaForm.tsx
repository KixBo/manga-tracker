import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import type { Manga } from '@/types/manga';

type AddMangaFormProps = {
  title: string;
  author: string;
  totalChapters: string;
  status: Manga['status'];
  formError: string;
  onTitleChange: (text: string) => void;
  onAuthorChange: (text: string) => void;
  onTotalChaptersChange: (text: string) => void;
  onStatusChange: (status: Manga['status']) => void;
  onSubmit: () => void;
};

export function AddMangaForm({
  title,
  author,
  totalChapters,
  status,
  formError,
  onTitleChange,
  onAuthorChange,
  onTotalChaptersChange,
  onStatusChange,
  onSubmit,
}: AddMangaFormProps) {
  return (
    <>
      <TextInput
        style={styles.formInput}
        placeholder="Titre du manga"
        value={title}
        onChangeText={onTitleChange}
      />
      <TextInput
        style={styles.formInput}
        placeholder="Auteur"
        value={author}
        onChangeText={onAuthorChange}
      />
      <TextInput
        style={styles.formInput}
        placeholder="Nombre total de chapitres"
        value={totalChapters}
        onChangeText={onTotalChaptersChange}
        keyboardType="numeric"
      />
      <View style={styles.statusRow}>
        <Pressable
          onPress={() => onStatusChange('ongoing')}
          style={[
            styles.statusButton,
            status === 'ongoing' && styles.statusButtonActive,
          ]}>
          <Text
            style={[
              styles.statusButtonText,
              status === 'ongoing' && styles.statusButtonTextActive,
            ]}>
            En cours
          </Text>
        </Pressable>
        <Pressable
          onPress={() => onStatusChange('completed')}
          style={[
            styles.statusButton,
            status === 'completed' && styles.statusButtonActive,
          ]}>
          <Text
            style={[
              styles.statusButtonText,
              status === 'completed' && styles.statusButtonTextActive,
            ]}>
            Terminé
          </Text>
        </Pressable>
      </View>
      {formError !== '' && (
        <Text style={styles.formError}>{formError}</Text>
      )}
      <Pressable style={styles.addButton} onPress={onSubmit}>
        <Text style={styles.addButtonText}>Ajouter le manga</Text>
      </Pressable>
    </>
  );
}

const styles = StyleSheet.create({
  formInput: {
    backgroundColor: '#f4f4f4',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    marginBottom: 8,
  },
  statusRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  statusButton: {
    backgroundColor: '#eeeeee',
    borderRadius: 16,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  statusButtonActive: {
    backgroundColor: '#2563eb',
  },
  statusButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333333',
  },
  statusButtonTextActive: {
    color: '#ffffff',
  },
  formError: {
    color: '#dc2626',
    fontSize: 14,
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
