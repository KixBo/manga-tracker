import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

type EditMangaFormProps = {
  mangaTitle: string;
  title: string;
  author: string;
  totalChapters: string;
  onTitleChange: (text: string) => void;
  onAuthorChange: (text: string) => void;
  onTotalChaptersChange: (text: string) => void;
  onCancel: () => void;
  onSave: () => void;
};

export function EditMangaForm({
  mangaTitle,
  title,
  author,
  totalChapters,
  onTitleChange,
  onAuthorChange,
  onTotalChaptersChange,
  onCancel,
  onSave,
}: EditMangaFormProps) {
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
      <TextInput
        style={styles.formInput}
        placeholder="Nombre total de chapitres"
        value={totalChapters}
        onChangeText={onTotalChaptersChange}
        keyboardType="numeric"
      />
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
