import React, { useState } from 'react';
import ProteinCard from './components/ProteinCard';
import Pagination from './components/Pagination';
import ProteinHeader from './components/ProteinHeader';
import SearchBar from './components/SearchBar';
import { useProteinSearch } from './hooks/useProteinSearch';
import proteinData from './protein.json';

const ITEMS_PER_PAGE = 5;

function App() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProteins = useProteinSearch(proteinData, searchQuery);
  const totalPages = Math.ceil(filteredProteins.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentProteins = filteredProteins.slice(startIndex, endIndex);

  // Reset to first page when search query changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <ProteinHeader 
          startIndex={startIndex}
          endIndex={Math.min(endIndex, filteredProteins.length)}
          totalItems={filteredProteins.length}
        />

        <SearchBar 
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        <div className="space-y-6">
          {currentProteins.map((protein, index) => (
            <ProteinCard 
              key={`${protein._id.$oid}-${protein.hgene_name}-${protein.tgene_name}-${index}`} 
              protein={protein} 
            />
          ))}
        </div>

        {filteredProteins.length > ITEMS_PER_PAGE && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        )}
      </div>
    </div>
  );
}

export default App;