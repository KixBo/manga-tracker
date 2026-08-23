import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import type { MangaFilter } from '@/types/manga';

type MangaFiltersProps = {
  searchQuery: string;
  selectedFilter: MangaFilter;
  onSearchChange: (text: string) => void;
  onFilterChange: (filter: MangaFilter) => void;
};

export function MangaFilters({
  searchQuery,
  selectedFilter,
  onSearchChange,
  onFilterChange,
}: MangaFiltersProps) {
  return (
    <>
      <TextInput
        style={styles.searchInput}
        placeholder="Rechercher un manga..."
        value={searchQuery}
        onChangeText={onSearchChange}
      />

      <View style={styles.filterRow}>
        <Pressable
          onPress={() => onFilterChange('all')}
          style={[
            styles.filterButton,
            selectedFilter === 'all' && styles.filterButtonSelected,
          ]}>
          <Text
            style={[
              styles.filterButtonText,
              selectedFilter === 'all' && styles.filterButtonTextSelected,
            ]}>
            Tous
          </Text>
        </Pressable>
        <Pressable
          onPress={() => onFilterChange('ongoing')}
          style={[
            styles.filterButton,
            selectedFilter === 'ongoing' && styles.filterButtonSelected,
          ]}>
          <Text
            style={[
              styles.filterButtonText,
              selectedFilter === 'ongoing' && styles.filterButtonTextSelected,
            ]}>
            En cours
          </Text>
        </Pressable>
        <Pressable
          onPress={() => onFilterChange('completed')}
          style={[
            styles.filterButton,
            selectedFilter === 'completed' && styles.filterButtonSelected,
          ]}>
          <Text
            style={[
              styles.filterButtonText,
              selectedFilter === 'completed' && styles.filterButtonTextSelected,
            ]}>
            Terminés
          </Text>
        </Pressable>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  searchInput: {
    backgroundColor: '#f4f4f4',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    marginBottom: 12,
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
  filterButtonSelected: {
    backgroundColor: '#2563eb',
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333333',
  },
  filterButtonTextSelected: {
    color: '#ffffff',
  },
});
