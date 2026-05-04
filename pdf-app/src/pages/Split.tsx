import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, SplitSquareHorizontal, File } from 'lucide-react';
import { Dropzone } from '../components/Dropzone';
import { extractPages, parsePageNumbers, downloadPdf, getPdfPageCount } from '../lib/pdf-utils';

export function Split() {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [pageInput, setPageInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);

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

  const handleSplit = async () => {
    if (!file) return;
    const pagesToExtract = parsePageNumbers(pageInput, pageCount);
    if (pagesToExtract.length === 0) {
      alert("Please enter valid page numbers.");
      return;
    }

    setIsProcessing(true);
    setProgress(50);
    try {
      const extractedBytes = await extractPages(file, pagesToExtract);
      setProgress(100);
      downloadPdf(extractedBytes, 'extracted_pages.pdf');
    } catch (e) {
      console.error(e);
      alert('Failed to extract pages');
    } finally {
      setTimeout(() => { setIsProcessing(false); setProgress(0); }, 1000);
    }
  };

  return (
    <div className="animate-in fade-in duration-300">
      <Link to="/" className="inline-flex items-center text-sm font-medium text-steel hover:text-ink mb-8">
        <ArrowLeft size={16} className="mr-2" /> Back to tools
      </Link>
      
      <h1 className="text-3xl font-semibold mb-2">Split PDF</h1>
      <p className="text-steel mb-8">Extract specific pages from a document.</p>

      <Dropzone onFilesDrop={handleFilesDrop} multiple={false}>
        {!file ? (
          <div className="flex-1 flex flex-col items-center justify-center text-steel pointer-events-none">
            <SplitSquareHorizontal size={64} strokeWidth={1} className="mb-4" />
            <p className="mb-8">Drop a single PDF file here</p>
            <label 
              htmlFor="pdf-upload-input" 
              className="bg-surface text-ink border border-hairline px-6 py-2 rounded-full font-medium hover:bg-hairline transition-colors cursor-pointer pointer-events-auto"
            >
              Or Select Files
            </label>
          </div>
        ) : (
          <div className="flex-1 p-6 bg-canvas border border-hairline rounded-xl">
            <div className="flex items-center gap-4 mb-8">
              <File size={32} className="text-steel" />
              <div>
                <p className="font-semibold">{file.name}</p>
                <p className="text-sm text-steel">{pageCount} pages total</p>
              </div>
            </div>

            <div className="mb-8">
              <label className="block text-sm font-semibold mb-2">Pages to extract</label>
              <input 
                type="text" 
                placeholder="e.g., 1, 3, 5-8" 
                value={pageInput}
                onChange={(e) => setPageInput(e.target.value)}
                className="w-full bg-canvas text-ink border border-hairline rounded-md px-4 py-2 focus:outline-none focus:border-ink transition-colors"
              />
              <p className="text-xs text-steel mt-2">Comma separated page numbers or ranges.</p>
            </div>
            
            <div className="flex flex-col items-end">
              {isProcessing && (
                <div className="w-full bg-surface h-2 rounded-full mb-4 overflow-hidden">
                  <div className="bg-ink h-full transition-all duration-300" style={{ width: `${progress}%` }}></div>
                </div>
              )}
              <button 
                onClick={handleSplit}
                disabled={isProcessing || !pageInput.trim()}
                className="bg-ink text-white px-6 py-3 rounded-full font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-black transition-colors"
              >
                {isProcessing ? 'Processing...' : 'Extract Pages'}
              </button>
            </div>
          </div>
        )}
      </Dropzone>
    </div>
  );
}
