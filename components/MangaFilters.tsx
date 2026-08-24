import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import type { MangaFilter, MangaSort } from '@/types/manga';

type MangaFiltersProps = {
  searchQuery: string;
  selectedFilter: MangaFilter;
  selectedSort: MangaSort;
  onSearchChange: (text: string) => void;
  onFilterChange: (filter: MangaFilter) => void;
  onSortChange: (sort: MangaSort) => void;
};

export function MangaFilters({
  searchQuery,
  selectedFilter,
  selectedSort,
  onSearchChange,
  onFilterChange,
  onSortChange,
}: MangaFiltersProps) {
  return (
    <>
      <TextInput
        style={styles.searchInput}
        placeholder="Rechercher un manga..."
        value={searchQuery}
        onChangeText={onSearchChange}
      />

      <View style={styles.wrappingFilterRow}>
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
          onPress={() => onFilterChange('to-read')}
          style={[
            styles.filterButton,
            selectedFilter === 'to-read' && styles.filterButtonSelected,
          ]}>
          <Text
            style={[
              styles.filterButtonText,
              selectedFilter === 'to-read' && styles.filterButtonTextSelected,
            ]}>
            À lire
          </Text>
        </Pressable>
        <Pressable
          onPress={() => onFilterChange('reading')}
          style={[
            styles.filterButton,
            selectedFilter === 'reading' && styles.filterButtonSelected,
          ]}>
          <Text
            style={[
              styles.filterButtonText,
              selectedFilter === 'reading' && styles.filterButtonTextSelected,
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
        <Pressable
          onPress={() => onFilterChange('favorites')}
          style={[
            styles.filterButton,
            selectedFilter === 'favorites' && styles.filterButtonSelected,
          ]}>
          <Text
            style={[
              styles.filterButtonText,
              selectedFilter === 'favorites' && styles.filterButtonTextSelected,
            ]}>
            Favoris
          </Text>
        </Pressable>
      </View>

      <Text style={styles.sortLabel}>Trier par</Text>
      <View style={styles.filterRow}>
        <Pressable
          onPress={() => onSortChange('az')}
          style={[
            styles.filterButton,
            selectedSort === 'az' && styles.filterButtonSelected,
          ]}>
          <Text
            style={[
              styles.filterButtonText,
              selectedSort === 'az' && styles.filterButtonTextSelected,
            ]}>
            A → Z
          </Text>
        </Pressable>
        <Pressable
          onPress={() => onSortChange('za')}
          style={[
            styles.filterButton,
            selectedSort === 'za' && styles.filterButtonSelected,
          ]}>
          <Text
            style={[
              styles.filterButtonText,
              selectedSort === 'za' && styles.filterButtonTextSelected,
            ]}>
            Z → A
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
  sortLabel: {
    fontSize: 13,
    color: '#555555',
    marginBottom: 8,
  },
  wrappingFilterRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
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
