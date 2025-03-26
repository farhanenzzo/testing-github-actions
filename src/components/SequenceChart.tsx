import React, { useState, useMemo, useRef } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { X, Settings2, Download, ChevronDown, FileSpreadsheet } from 'lucide-react';
import html2canvas from 'html2canvas';

interface SequenceChartProps {
  sequence: string;
  onClose: () => void;
  title: string;
  hgeneName: string;
  tgeneName: string;
}

const P_VALUES: { [key: string]: number } = {
  'A': 6.11, 'R': 10.76, 'N': 5.4, 'D': 2.98, 'C': 5.15,
  'E': 3.08, 'Q': 5.65, 'G': 6.06, 'H': 7.64, 'I': 6.04,
  'L': 6.04, 'K': 9.47, 'M': 5.71, 'F': 5.76, 'P': 6.30,
  'S': 5.70, 'T': 5.60, 'W': 5.88, 'Y': 5.63, 'V': 6.02
};

const RESIDUE = 5;

// New rolling mean function
const rollingMean = (data: number[], windowSize: number) => {
  const rollingMeans: (number | null)[] = [];
  for (let i = 0; i < data.length; i++) {
    if (i < windowSize - 1) {
      rollingMeans.push(null); // Not enough data to compute mean
    } else {
      const window = data.slice(i - windowSize + 1, i + 1);
      const mean = window.reduce((sum, value) => sum + value, 0) / windowSize;
      rollingMeans.push(Number(mean.toFixed(2)));
    }
  }
  return rollingMeans;
};

const EXPORT_OPTIONS = [
  { label: 'SVG', value: 'svg', icon: Download },
  { label: 'PNG', value: 'png', icon: Download },
  { label: 'JPEG', value: 'jpeg', icon: Download },
  { label: 'CSV', value: 'csv', icon: FileSpreadsheet }
] as const;

type ExportFormat = typeof EXPORT_OPTIONS[number]['value'];

const SequenceChart: React.FC<SequenceChartProps> = ({ sequence, onClose, title, hgeneName, tgeneName }) => {
  const [windowSize, setWindowSize] = useState(5);
  const [showSettings, setShowSettings] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const chartRef = useRef<HTMLDivElement>(null);
  const exportButtonRef = useRef<HTMLButtonElement>(null);
  const exportMenuRef = useRef<HTMLDivElement>(null);
  const [exporting, setExporting] = useState(false);

  const rawData = sequence.split('').map((char, index) => ({
    position: index + 1,
    pValue: P_VALUES[char.toUpperCase()] || RESIDUE,
    aminoAcid: char.toUpperCase()
  }));

  const rollingMeans = useMemo(() => rollingMean(rawData.map(d => d.pValue), windowSize), [rawData, windowSize]);

  const data = rawData.map((item, index) => ({
    ...item,
    rollingMean: rollingMeans[index]
  }));

  // Generate export filename
  const getExportFilename = (format: string) => {
    const baseFilename = `${hgeneName}-${tgeneName}-${windowSize}-pvalue-analysis`;
    return `${baseFilename}.${format}`;
  };

  // Close export menu when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (exportMenuRef.current && !exportMenuRef.current.contains(event.target as Node)) {
        setShowExportMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleExport = async (format: ExportFormat) => {
    if (!chartRef.current) return;
    setExporting(true);
    setShowExportMenu(false);

    try {
      if (format === 'csv') {
        const csvContent = generateCSVContent(data, windowSize);
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = getExportFilename('csv');
        link.click();
        URL.revokeObjectURL(link.href);
      } else {
        const canvas = await html2canvas(chartRef.current, {
          scale: 2,
          backgroundColor: '#ffffff',
        });

        switch (format) {
          case 'png': {
            const link = document.createElement('a');
            link.download = getExportFilename('png');
            link.href = canvas.toDataURL('image/png');
            link.click();
            break;
          }
          case 'jpeg': {
            const link = document.createElement('a');
            link.download = getExportFilename('jpeg');
            link.href = canvas.toDataURL('image/jpeg');
            link.click();
            break;
          }
          case 'svg': {
            const svgElement = chartRef.current.querySelector('svg');
            if (svgElement) {
              const svgData = new XMLSerializer().serializeToString(svgElement);
              const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
              const svgUrl = URL.createObjectURL(svgBlob);
              const link = document.createElement('a');
              link.download = getExportFilename('svg');
              link.href = svgUrl;
              link.click();
              URL.revokeObjectURL(svgUrl);
            }
            break;
          }
        }
      }
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setExporting(false);
    }
  };

  const generateCSVContent = (data: { position: number; aminoAcid: string; pValue: number; rollingMean: number | null }[], windowSize: number) => {
    const headers = ['Position', 'Amino Acid', 'Raw P-Value', `Rolling Mean (Window Size: ${windowSize})`];
    const rows = data.map(item => [
      item.position,
      item.aminoAcid,
      item.pValue.toFixed(2),
      item.rollingMean !== null ? item.rollingMean.toFixed(2) : 'N/A'
    ]);
  
    const csvContent = [headers, ...rows].map(e => e.join(',')).join('\n');
    return csvContent;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-[90vw] max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-gray-800">{title} P-Value Analysis</h3>
          <div className="flex items-center gap-2">
            <div className="relative" ref={exportMenuRef}>
              <button
                onClick={() => setShowExportMenu(!showExportMenu)}
                disabled={exporting}
                ref={exportButtonRef}
                className="px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors flex items-center gap-1 disabled:opacity-50"
              >
                <Download className="w-4 h-4" />
                Export
                <ChevronDown className="w-4 h-4" />
              </button>
              {showExportMenu && (
                <div className="absolute right-0 mt-1 w-36 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                  {EXPORT_OPTIONS.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => handleExport(option.value)}
                      className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                    >
                      <option.icon className="w-4 h-4" />
                      {option.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="p-2 hover:bg-gray-100 rounded-lg flex items-center gap-2 text-sm"
            >
              <Settings2 className="w-4 h-4" />
              <span>Settings</span>
            </button>
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-100 rounded-full"
            >
              <X className="w-6 h-6 text-gray-500" />
            </button>
          </div>
        </div>

        {showSettings && (
          <div className="mb-4 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-4">
              <label className="text-sm font-medium text-gray-700">
                Rolling Mean Window Size:
              </label>
              <input
                type="range"
                min="1"
                max="20"
                value={windowSize}
                onChange={(e) => setWindowSize(Number(e.target.value))}
                className="w-48"
              />
              <span className="text-sm font-mono bg-white px-2 py-1 rounded border">
                {windowSize}
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Larger window sizes result in smoother curves but may lose local details.
              Current window includes {windowSize} points.
            </p>
          </div>
        )}

        <div className="h-[60vh]" ref={chartRef}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{ top: 20, right: 30, left: 20, bottom: 70 }} // Increased bottom margin
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="position"
                label={{
                  value: '',
                  position: 'insideBottom',
                  offset: -5 // Moves label down
                }}
              />
              <YAxis
                domain={[0, 12]}
                label={{
                  value: 'P-Value',
                  angle: -90,
                  position: 'insideLeft'
                }}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-white p-3 border border-gray-200 rounded shadow-lg">
                        <p className="text-sm font-medium">Position: {data.position}</p>
                        <p className="text-sm">Amino Acid: {data.aminoAcid}</p>
                        <p className="text-sm">Raw P-Value: {data.pValue.toFixed(2)}</p>
                        <p className="text-sm">Rolling Mean: {data.rollingMean !== null ? data.rollingMean : 'N/A'}</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend wrapperStyle={{ marginTop: 20 }} /> {/* Moves legend down */}
              {/* <Line
                type="monotone"
                dataKey="pValue"
                stroke="#94a3b8"
                strokeWidth={1}
                dot={{ r: 2 }}
                name="Raw Values"
              /> */}
              <Line
                type="monotone"
                dataKey="rollingMean"
                stroke="#2563eb"
                strokeWidth={2}
                dot={false}
                name="Rolling Mean"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <h4 className="text-sm font-medium text-gray-700 mb-2">P-Values by Amino Acid</h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {Object.entries(P_VALUES).map(([acid, value]) => (
              <div key={acid} className="flex items-center gap-2">
                <span className="w-4 h-4 bg-blue-500 rounded-full"></span>
                <span className="text-sm text-gray-600">{acid}: {value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SequenceChart;