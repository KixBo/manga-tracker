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
          onPress={() => onFilterChange('inProgress')}
          style={[
            styles.filterButton,
            selectedFilter === 'inProgress' && styles.filterButtonSelected,
          ]}>
          <Text
            style={[
              styles.filterButtonText,
              selectedFilter === 'inProgress' && styles.filterButtonTextSelected,
            ]}>
            En cours
          </Text>
        </Pressable>
        <Pressable
          onPress={() => onFilterChange('upToDate')}
          style={[
            styles.filterButton,
            selectedFilter === 'upToDate' && styles.filterButtonSelected,
          ]}>
          <Text
            style={[
              styles.filterButtonText,
              selectedFilter === 'upToDate' && styles.filterButtonTextSelected,
            ]}>
            À jour
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
