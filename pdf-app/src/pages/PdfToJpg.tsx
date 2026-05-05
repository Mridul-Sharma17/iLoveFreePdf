import { useState } from 'react';
import { Dropzone } from '../components/Dropzone';
import { SuccessScreen } from '../components/SuccessScreen';
import { ProcessingOverlay } from '../components/ProcessingOverlay';
import { convertPdfToJpgs } from '../lib/pdf-image-utils';

export function PdfToJpg() {
  const [file, setFile] = useState<File | null>(null);
  const [blob, setBlob] = useState<Blob | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleConvert = async () => {
    if (!file) return;
    setIsProcessing(true);
    try {
      const result = await convertPdfToJpgs(file);
      setBlob(result);
    } catch (err) {
      console.error(err);
      alert('Extraction failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (blob) {
    return (
      <SuccessScreen 
        onDownload={() => {
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = file?.name.replace(/\.[^/.]+$/, "") + "-images.zip";
          a.click();
          URL.revokeObjectURL(url);
        }} 
        onRestart={() => { setFile(null); setBlob(null); }} 
      />
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-20 px-4">
      <ProcessingOverlay 
        isConverting={isProcessing}
        message="Extracting pages to JPG..."
      />
      
      <h1 className="text-4xl font-bold mb-10 text-center">PDF to JPG</h1>
      {!file ? (
        <Dropzone onFilesSelect={(files) => setFile(files[0])} accept="application/pdf">
          <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-hairline rounded-[32px] p-10 hover:border-brand-coral transition-colors">
            <div className="w-20 h-20 bg-brand-coral/10 rounded-2xl flex items-center justify-center mb-6">
              <svg className="w-10 h-10 text-brand-coral" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h14a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold mb-2">Choose PDF File</h2>
            <p className="text-gray-400">or drop PDF here</p>
          </div>
        </Dropzone>
      ) : (
        <div className="bg-surface p-10 rounded-[32px] border border-hairline text-center">
          <h2 className="text-xl font-bold mb-2">{file.name}</h2>
          <p className="text-gray-400 mb-8">{(file.size / 1024).toFixed(1)} KB</p>
          <button 
            onClick={handleConvert} 
            className="button-primary px-12"
            disabled={isProcessing}
          >
            {isProcessing ? 'Processing...' : 'Extract to JPG'}
          </button>
        </div>
      )}
    </div>
  );
}
