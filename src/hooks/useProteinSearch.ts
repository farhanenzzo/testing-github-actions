import { useMemo } from 'react';
import { ProteinData } from '../types/protein';

export const useProteinSearch = (proteins: ProteinData[], searchQuery: string) => {
  return useMemo(() => {
    if (!searchQuery.trim()) return proteins;

    const query = searchQuery.toUpperCase().trim();
    return proteins.filter(protein => 
      protein.hgene_name === query || 
      protein.tgene_name === query
    );
  }, [proteins, searchQuery]);
};