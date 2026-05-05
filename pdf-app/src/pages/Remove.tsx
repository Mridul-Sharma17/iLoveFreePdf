import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, FileMinus, File } from 'lucide-react';
import { Dropzone } from '../components/Dropzone';
import { removePages, parsePageNumbers, getPdfPageCount } from '../lib/pdf-utils';
import { SuccessScreen } from '../components/SuccessScreen';
import { ProcessingOverlay } from '../components/ProcessingOverlay';

export function Remove() {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [pageInput, setPageInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);

  const handleFilesDrop = async (droppedFiles: File[]) => {
    if (droppedFiles.length > 0) {
      const f = droppedFiles[0];
      setFile(f);
      try {
        const count = await getPdfPageCount(f);
        setPageCount(count);
      } catch (e) {
        console.error("Invalid PDF", e);
        setFile(null);
      }
    }
  };

  const handleRemove = async () => {
    if (!file) return;
    const pagesToDelete = parsePageNumbers(pageInput, pageCount);
    if (pagesToDelete.length === 0) {
      alert("Please enter valid page numbers.");
      return;
    }
    if (pagesToDelete.length >= pageCount) {
      alert("You cannot remove all pages from the document.");
      return;
    }

    setIsProcessing(true);
    try {
      const resultBytes = await removePages(file, pagesToDelete);
      setResultBlob(new Blob([resultBytes as any], { type: 'application/pdf' }));
    } catch (e) {
      console.error(e);
      alert('Failed to remove pages');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!resultBlob) return;
    const url = URL.createObjectURL(resultBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'cleaned_document.pdf';
    a.click();
    URL.revokeObjectURL(url);
  };

  if (resultBlob) {
    return <SuccessScreen onDownload={handleDownload} onRestart={() => { setFile(null); setPageInput(''); setResultBlob(null); }} />;
  }

  return (
    <div className="animate-in fade-in duration-300 max-w-4xl mx-auto py-10">
      <ProcessingOverlay isConverting={isProcessing} message="Removing pages..." />
      
      <Link to="/" className="inline-flex items-center text-sm font-medium text-steel hover:text-ink mb-8">
        <ArrowLeft size={16} className="mr-2" /> Back to tools
      </Link>
      
      <h1 className="text-4xl font-bold mb-2 text-center">Remove Pages</h1>
      <p className="text-steel mb-10 text-center">Delete specific pages from a document.</p>

      {!file ? (
        <Dropzone onFilesSelect={handleFilesDrop} multiple={false} accept="application/pdf">
          <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-hairline rounded-[32px] p-10 hover:border-brand-purple transition-colors">
            <div className="w-20 h-20 bg-brand-purple/10 rounded-2xl flex items-center justify-center mb-6">
              <FileMinus size={40} className="text-brand-purple" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Choose PDF File</h2>
            <p className="text-gray-400">or drop a PDF file here</p>
          </div>
        </Dropzone>
      ) : (
        <div className="bg-surface p-8 rounded-[32px] border border-hairline">
          <div className="flex items-center gap-4 mb-10">
            <div className="w-12 h-12 bg-white rounded-lg border border-hairline flex items-center justify-center shadow-sm">
              <File size={24} className="text-brand-purple" />
            </div>
            <div>
              <p className="font-bold text-lg">{file.name}</p>
              <p className="text-sm text-steel font-medium">{pageCount} pages total</p>
            </div>
            <button 
              onClick={() => setFile(null)} 
              className="ml-auto text-brand-purple font-bold hover:underline text-sm"
            >
              Change File
            </button>
          </div>

          <div className="mb-10">
            <label className="block text-sm font-bold text-red-600 uppercase tracking-wider mb-3">Pages to delete</label>
            <input 
              type="text" 
              placeholder="e.g., 1, 3, 5-8" 
              value={pageInput}
              onChange={(e) => setPageInput(e.target.value)}
              className="w-full bg-white text-ink border border-hairline rounded-xl px-6 py-4 text-lg focus:outline-none focus:border-red-600 focus:ring-4 focus:ring-red-600/10 transition-all shadow-sm"
            />
            <p className="text-sm text-steel mt-3 font-medium">Comma separated page numbers or ranges.</p>
          </div>
          
          <div className="flex justify-center">
            <button 
              onClick={handleRemove}
              disabled={isProcessing || !pageInput.trim()}
              className="button-primary px-12 text-lg"
            >
              Remove Pages
            </button>
          </div>
          <button 
            onClick={() => setFile(null)}
            className="block w-full mt-4 text-gray-400 hover:text-ink transition-colors text-sm font-medium"
          >
            Clear selection
          </button>
        </div>
      )}
    </div>
  );
}
