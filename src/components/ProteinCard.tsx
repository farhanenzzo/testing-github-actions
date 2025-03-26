import React from 'react';
import { HeartPulse, Link, Download } from 'lucide-react';
import { ProteinData } from '../types/protein';
import ProteinStatus from './ProteinStatus';
import ProteinSequence from './ProteinSequence';

interface ProteinCardProps {
  protein: ProteinData;
}

const ProteinCard: React.FC<ProteinCardProps> = ({ protein }) => {
  const handleDownloadCSV = () => {
    // Define CSV headers
  const headers = [
    'Host Gene Name',
    'Target Gene Name',
    'Sequence Description',
    'Host Gene Sequence',
    'Target Gene Sequence',
    'Frame Status',
    'Analysis Status'
  ];

  // Define CSV row values
  const values = [
    protein.hgene_name,
    protein.tgene_name,
    protein.seq_desc || 'N/A',
    protein.hgene_seq,
    protein.tgene_seq,
    protein.isOutOfFrame ? 'Out of Frame' : 'In Frame',
    protein.isAnalyzed ? 'Analyzed' : 'Pending Analysis'
  ];

  // Convert to CSV format
  const csvContent = [headers, values]
    .map(row => row.map(cell => `"${cell}"`).join(','))
    .join('\n');

    // Create blob and download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `protein_data_${protein.hgene_name}_${protein.tgene_name}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
      <div className="border-b border-gray-100 bg-gray-50 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-rose-50 p-1.5 rounded">
              <HeartPulse className="text-rose-500 w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-lg font-semibold text-gray-800">
                  {protein.hgene_name}
                </h2>
                <Link className="w-4 h-4 text-gray-400" />
                <h2 className="text-lg font-semibold text-gray-800">
                  {protein.tgene_name}
                </h2>
              </div>
              <div className="flex gap-2">
                <ProteinStatus 
                  isOutOfFrame={protein.isOutOfFrame}
                  isAnalyzed={protein.isAnalyzed}
                />
              </div>
            </div>
          </div>
          <button
            onClick={handleDownloadCSV}
            className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Download CSV</span>
          </button>
        </div>
      </div>

      <div className="p-6">
        {protein.seq_desc && (
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-600 mb-2">Sequence Analysis</h3>
            <p className="text-gray-800 text-sm bg-gray-50 p-3 rounded-lg">{protein.seq_desc}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ProteinSequence 
            title="Host Gene Sequence" 
            sequence={protein.hgene_seq} 
            geneName={protein.hgene_name}
            hgeneName={protein.hgene_name}
            tgeneName={protein.tgene_name}
          />
          <ProteinSequence 
            title="Target Gene Sequence" 
            sequence={protein.tgene_seq}
            geneName={protein.tgene_name}
            hgeneName={protein.hgene_name}
            tgeneName={protein.tgene_name}
          />
        </div>
      </div>
    </div>
  );
};

export default ProteinCard;