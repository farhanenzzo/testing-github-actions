import React from 'react';

interface ProteinStatusProps {
  isOutOfFrame: boolean;
  isAnalyzed: boolean;
}

const ProteinStatus: React.FC<ProteinStatusProps> = ({ isOutOfFrame, isAnalyzed }) => {
  return (
    <div className="flex gap-2">
      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
        isOutOfFrame 
          ? 'bg-red-50 text-red-700 border border-red-100' 
          : 'bg-green-50 text-green-700 border border-green-100'
      }`}>
        {isOutOfFrame ? 'Out of Frame' : 'In Frame'}
      </span>
      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
        isAnalyzed 
          ? 'bg-blue-50 text-blue-700 border border-blue-100' 
          : 'bg-gray-50 text-gray-700 border border-gray-100'
      }`}>
        {isAnalyzed ? 'Analyzed' : 'Pending Analysis'}
      </span>
    </div>
  );
};

export default ProteinStatus;