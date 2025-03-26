import React from 'react';
import { Database, TestTube2 } from 'lucide-react';

interface ProteinHeaderProps {
  startIndex: number;
  endIndex: number;
  totalItems: number;
}

const ProteinHeader: React.FC<ProteinHeaderProps> = ({ startIndex, endIndex, totalItems }) => {
  return (
    <div className="mb-8">
      <div className="flex items-center gap-3 mb-4">
        <div className="bg-blue-50 p-2 rounded-lg">
          <TestTube2 className="w-8 h-8 text-blue-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Protein Analysis Database</h1>
          <p className="text-sm text-gray-600 mt-1">Gene Expression and Sequence Analysis Platform</p>
        </div>
      </div>
      <div className="flex items-center justify-between bg-white p-4 rounded-lg shadow-sm border border-gray-100">
        <div className="flex items-center gap-2">
          <Database className="w-5 h-5 text-blue-500" />
          <span className="text-sm font-medium text-gray-700">Database Statistics</span>
        </div>
        <div className="text-sm">
          <span className="font-mono bg-gray-50 px-2 py-1 rounded text-gray-700">
            {startIndex + 1}-{Math.min(endIndex, totalItems)}
          </span>
          <span className="text-gray-500 mx-2">of</span>
          <span className="font-mono bg-gray-50 px-2 py-1 rounded text-gray-700">
            {totalItems}
          </span>
          <span className="text-gray-500 ml-2">entries</span>
        </div>
      </div>
    </div>
  );
}

export default ProteinHeader;