import * as ImagePicker from 'expo-image-picker';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import type { Manga } from '@/types/manga';

type EditMangaFormProps = {
  mangaTitle: string;
  title: string;
  author: string;
  coverUrl: string;
  description: string;
  chaptersRead: string;
  totalChapters: string;
  status: Manga['status'];
  readingStatus: Manga['readingStatus'];
  onTitleChange: (text: string) => void;
  onAuthorChange: (text: string) => void;
  onCoverUrlChange: (text: string) => void;
  onDescriptionChange: (text: string) => void;
  onChaptersReadChange: (text: string) => void;
  onTotalChaptersChange: (text: string) => void;
  onStatusChange: (status: Manga['status']) => void;
  onReadingStatusChange: (readingStatus: Manga['readingStatus']) => void;
  onCancel: () => void;
  onSave: () => void;
};

export function EditMangaForm({
  mangaTitle,
  title,
  author,
  coverUrl,
  description,
  chaptersRead,
  totalChapters,
  status,
  readingStatus,
  onTitleChange,
  onAuthorChange,
  onCoverUrlChange,
  onDescriptionChange,
  onChaptersReadChange,
  onTotalChaptersChange,
  onStatusChange,
  onReadingStatusChange,
  onCancel,
  onSave,
}: EditMangaFormProps) {
  async function pickCoverImage() {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: false,
      quality: 1,
    });

    if (!result.canceled) {
      onCoverUrlChange(result.assets[0].uri);
    }
  }

  return (
    <>
      <Text style={styles.subtitle}>Modification de : {mangaTitle}</Text>
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
      <Pressable style={styles.filterButton} onPress={pickCoverImage}>
        <Text style={styles.filterButtonText}>Choisir une nouvelle couverture</Text>
      </Pressable>
      <TextInput
        style={styles.formInput}
        placeholder="Description / Synopsis"
        value={description}
        onChangeText={onDescriptionChange}
        multiline
      />
      <TextInput
        style={styles.formInput}
        placeholder="Chapitres lus"
        value={chaptersRead}
        onChangeText={onChaptersReadChange}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.formInput}
        placeholder="Nombre total de chapitres"
        value={totalChapters}
        onChangeText={onTotalChaptersChange}
        keyboardType="numeric"
      />
      <Text style={styles.sectionLabel}>État de la série</Text>
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
      <Text style={styles.sectionLabel}>Ma lecture</Text>
      <View style={styles.statusRow}>
        <Pressable
          onPress={() => onReadingStatusChange('to-read')}
          style={[
            styles.statusButton,
            readingStatus === 'to-read' && styles.statusButtonActive,
          ]}>
          <Text
            style={[
              styles.statusButtonText,
              readingStatus === 'to-read' && styles.statusButtonTextActive,
            ]}>
            À lire
          </Text>
        </Pressable>
        <Pressable
          onPress={() => onReadingStatusChange('reading')}
          style={[
            styles.statusButton,
            readingStatus === 'reading' && styles.statusButtonActive,
          ]}>
          <Text
            style={[
              styles.statusButtonText,
              readingStatus === 'reading' && styles.statusButtonTextActive,
            ]}>
            En cours
          </Text>
        </Pressable>
        <Pressable
          onPress={() => onReadingStatusChange('completed')}
          style={[
            styles.statusButton,
            readingStatus === 'completed' && styles.statusButtonActive,
          ]}>
          <Text
            style={[
              styles.statusButtonText,
              readingStatus === 'completed' && styles.statusButtonTextActive,
            ]}>
            Terminé
          </Text>
        </Pressable>
      </View>
      <View style={styles.filterRow}>
        <Pressable style={styles.filterButton} onPress={onCancel}>
          <Text style={styles.filterButtonText}>Annuler</Text>
        </Pressable>
        <Pressable style={styles.addButton} onPress={onSave}>
          <Text style={styles.addButtonText}>Enregistrer</Text>
        </Pressable>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  subtitle: {
    fontSize: 18,
    color: '#555555',
    marginBottom: 16,
  },
  formInput: {
    backgroundColor: '#f4f4f4',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    marginBottom: 8,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333333',
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
  filterButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333333',
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
