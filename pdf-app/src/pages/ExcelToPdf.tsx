import { useState } from 'react';
import { Dropzone } from '../components/Dropzone';
import { useLibreOffice } from '../lib/useLibreOffice';
import { SuccessScreen } from '../components/SuccessScreen';
import { ProcessingOverlay } from '../components/ProcessingOverlay';

export function ExcelToPdf() {
  const [file, setFile] = useState<File | null>(null);
  const [blob, setBlob] = useState<Blob | null>(null);
  const [isConverting, setIsConverting] = useState(false);
  const { convertToPdf, isInitializing, progress } = useLibreOffice();

  const handleConvert = async () => {
    if (!file) return;
    setIsConverting(true);
    try {
      const result = await convertToPdf(file);
      setBlob(result);
    } catch (err) {
      console.error(err);
      alert('Conversion failed. Please try again.');
    } finally {
      setIsConverting(false);
    }
  };

  if (blob) {
    return (
      <SuccessScreen 
        onDownload={() => {
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = file?.name.replace(/\.[^/.]+$/, "") + ".pdf";
          a.click();
          URL.revokeObjectURL(url);
        }} 
        onRestart={() => { setFile(null); setBlob(null); }} 
      />
    );
  }

  const isLoading = isInitializing || isConverting;

  return (
    <div className="max-w-4xl mx-auto py-20 px-4">
      <ProcessingOverlay 
        isInitializing={isInitializing}
        isConverting={isConverting}
        progress={progress}
        message="Converting Excel to PDF..."
      />
      
      <h1 className="text-4xl font-bold mb-10 text-center">Excel to PDF</h1>
      {!file ? (
        <Dropzone onFilesSelect={(files) => setFile(files[0])} accept=".xls,.xlsx">
          <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-hairline rounded-[32px] p-10 hover:border-brand-coral transition-colors">
            <div className="w-20 h-20 bg-brand-coral/10 rounded-2xl flex items-center justify-center mb-6">
              <svg className="w-10 h-10 text-brand-coral" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold mb-2">Choose Excel Files</h2>
            <p className="text-gray-400">or drop Excel files here</p>
          </div>
        </Dropzone>
      ) : (
        <div className="bg-surface p-10 rounded-[32px] border border-hairline text-center">
          <h2 className="text-xl font-bold mb-2">{file.name}</h2>
          <p className="text-gray-400 mb-8">{(file.size / 1024).toFixed(1)} KB</p>
          <button 
            onClick={handleConvert} 
            className="button-primary px-12"
            disabled={isLoading}
          >
            {isLoading ? 'Processing...' : 'Convert to PDF'}
          </button>
        </div>
      )}
    </div>
  );
}
