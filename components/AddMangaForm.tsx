import * as ImagePicker from 'expo-image-picker';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import type { Manga } from '@/types/manga';

type AddMangaFormProps = {
  title: string;
  author: string;
  coverUrl: string;
  description: string;
  chaptersRead: string;
  totalChapters: string;
  status: Manga['status'];
  readingStatus: Manga['readingStatus'];
  formError: string;
  onTitleChange: (text: string) => void;
  onAuthorChange: (text: string) => void;
  onCoverUrlChange: (text: string) => void;
  onDescriptionChange: (text: string) => void;
  onChaptersReadChange: (text: string) => void;
  onTotalChaptersChange: (text: string) => void;
  onStatusChange: (status: Manga['status']) => void;
  onReadingStatusChange: (readingStatus: Manga['readingStatus']) => void;
  onSubmit: () => void;
  onCancel: () => void;
};

export function AddMangaForm({
  title,
  author,
  coverUrl,
  description,
  chaptersRead,
  totalChapters,
  status,
  readingStatus,
  formError,
  onTitleChange,
  onAuthorChange,
  onCoverUrlChange,
  onDescriptionChange,
  onChaptersReadChange,
  onTotalChaptersChange,
  onStatusChange,
  onReadingStatusChange,
  onSubmit,
  onCancel,
}: AddMangaFormProps) {
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
      <Pressable style={styles.cancelButton} onPress={pickCoverImage}>
        <Text style={styles.cancelButtonText}>Choisir une image depuis la galerie</Text>
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
      {formError !== '' && (
        <Text style={styles.formError}>{formError}</Text>
      )}
      <Pressable style={styles.addButton} onPress={onSubmit}>
        <Text style={styles.addButtonText}>Ajouter le manga</Text>
      </Pressable>
      <Pressable style={styles.cancelButton} onPress={onCancel}>
        <Text style={styles.cancelButtonText}>Annuler</Text>
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
  cancelButton: {
    backgroundColor: '#eeeeee',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 16,
  },
  cancelButtonText: {
    color: '#333333',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
