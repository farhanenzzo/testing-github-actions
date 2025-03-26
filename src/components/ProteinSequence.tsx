import React, { useState } from 'react';
import { Copy, CheckCircle2, ChevronDown, ChevronUp, LineChart } from 'lucide-react';
import SequenceChart from './SequenceChart';

interface ProteinSequenceProps {
  title: string;
  sequence: string;
  geneName: string;
  hgeneName: string;
  tgeneName: string;
}

const ProteinSequence: React.FC<ProteinSequenceProps> = ({ title, sequence, geneName, hgeneName, tgeneName }) => {
  const [copied, setCopied] = useState(false);
  const [showFull, setShowFull] = useState(false);
  const [showChart, setShowChart] = useState(false);
  
  const handleCopy = async () => {
    await navigator.clipboard.writeText(sequence);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const displaySequence = showFull ? sequence : sequence.slice(0, 80) + (sequence.length > 80 ? '...' : '');

  return (
    <>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-gray-600">{title}</h3>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowChart(true)}
              className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700"
            >
              <LineChart className="w-4 h-4" />
              <span>View Chart</span>
            </button>
            <button
              onClick={handleCopy}
              className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"
            >
              {copied ? (
                <CheckCircle2 className="w-4 h-4 text-green-500" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
              <span>{copied ? 'Copied!' : 'Copy'}</span>
            </button>
          </div>
        </div>
        <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-medium text-gray-500">Gene:</span>
            <span className="text-xs font-mono bg-white px-2 py-0.5 rounded border border-gray-200">
              {geneName}
            </span>
          </div>
          <div className="overflow-x-auto">
            <code className="text-sm text-gray-800 font-mono whitespace-pre-wrap break-all">
              {sequence ? displaySequence : 'No sequence available'}
            </code>
          </div>
          {sequence && sequence.length > 80 && (
            <button
              onClick={() => setShowFull(!showFull)}
              className="flex items-center gap-1 mt-2 text-sm text-blue-600 hover:text-blue-700"
            >
              {showFull ? (
                <>
                  <ChevronUp className="w-4 h-4" />
                  <span>Show Less</span>
                </>
              ) : (
                <>
                  <ChevronDown className="w-4 h-4" />
                  <span>Show More</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {showChart && (
        <SequenceChart
          sequence={sequence}
          onClose={() => setShowChart(false)}
          title={title}
          hgeneName={hgeneName}
          tgeneName={tgeneName}
        />
      )}
    </>
  );
};

export default ProteinSequence;