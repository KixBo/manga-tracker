import { Pressable, StyleSheet, Text, TextInput } from 'react-native';

type AddMangaFormProps = {
  title: string;
  totalChapters: string;
  formError: string;
  onTitleChange: (text: string) => void;
  onTotalChaptersChange: (text: string) => void;
  onSubmit: () => void;
};

export function AddMangaForm({
  title,
  totalChapters,
  formError,
  onTitleChange,
  onTotalChaptersChange,
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
        placeholder="Nombre total de chapitres"
        value={totalChapters}
        onChangeText={onTotalChaptersChange}
        keyboardType="numeric"
      />
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
