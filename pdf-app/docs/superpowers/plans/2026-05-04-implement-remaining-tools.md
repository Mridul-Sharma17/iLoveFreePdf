# Implement Remaining Tool Pages

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement Excel to PDF, PPT to PDF, JPG to PDF, and PDF to JPG tool pages.

**Architecture:** Create individual page components using existing patterns (Dropzone, SuccessScreen, ProcessingOverlay) and integrate them into the routing and home page.

**Tech Stack:** React, TypeScript, React Router, LibreOffice WASM (via useLibreOffice), pdf-lib, jszip, pdfjs-dist.

---

### Task 1: Implement Excel to PDF Page

**Files:**
- Create: `src/pages/ExcelToPdf.tsx`

- [ ] **Step 1: Create ExcelToPdf component**

```tsx
import React, { useState } from 'react';
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
```

- [ ] **Step 2: Commit**

```bash
git add src/pages/ExcelToPdf.tsx
git commit -m "feat: add ExcelToPdf page"
```

### Task 2: Implement PPT to PDF Page

**Files:**
- Create: `src/pages/PptToPdf.tsx`

- [ ] **Step 1: Create PptToPdf component**

```tsx
import React, { useState } from 'react';
import { Dropzone } from '../components/Dropzone';
import { useLibreOffice } from '../lib/useLibreOffice';
import { SuccessScreen } from '../components/SuccessScreen';
import { ProcessingOverlay } from '../components/ProcessingOverlay';

export function PptToPdf() {
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
        message="Converting PowerPoint to PDF..."
      />
      
      <h1 className="text-4xl font-bold mb-10 text-center">PPT to PDF</h1>
      {!file ? (
        <Dropzone onFilesSelect={(files) => setFile(files[0])} accept=".ppt,.pptx">
          <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-hairline rounded-[32px] p-10 hover:border-brand-coral transition-colors">
            <div className="w-20 h-20 bg-brand-coral/10 rounded-2xl flex items-center justify-center mb-6">
              <svg className="w-10 h-10 text-brand-coral" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold mb-2">Choose PPT Files</h2>
            <p className="text-gray-400">or drop PPT files here</p>
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
```

- [ ] **Step 2: Commit**

```bash
git add src/pages/PptToPdf.tsx
git commit -m "feat: add PptToPdf page"
```

### Task 3: Implement JPG to PDF Page

**Files:**
- Create: `src/pages/JpgToPdf.tsx`

- [ ] **Step 1: Create JpgToPdf component**

```tsx
import React, { useState } from 'react';
import { Dropzone } from '../components/Dropzone';
import { SuccessScreen } from '../components/SuccessScreen';
import { ProcessingOverlay } from '../components/ProcessingOverlay';
import { convertJpgsToPdf } from '../lib/pdf-utils';

export function JpgToPdf() {
  const [files, setFiles] = useState<File[]>([]);
  const [blob, setBlob] = useState<Blob | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleConvert = async () => {
    if (files.length === 0) return;
    setIsProcessing(true);
    try {
      const result = await convertJpgsToPdf(files);
      setBlob(result);
    } catch (err) {
      console.error(err);
      alert('Conversion failed. Please try again.');
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
          a.download = "converted.pdf";
          a.click();
          URL.revokeObjectURL(url);
        }} 
        onRestart={() => { setFiles([]); setBlob(null); }} 
      />
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-20 px-4">
      <ProcessingOverlay 
        isConverting={isProcessing}
        message="Converting Images to PDF..."
      />
      
      <h1 className="text-4xl font-bold mb-10 text-center">JPG to PDF</h1>
      {files.length === 0 ? (
        <Dropzone onFilesSelect={setFiles} accept=".jpg,.jpeg,.png" multiple>
          <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-hairline rounded-[32px] p-10 hover:border-brand-coral transition-colors">
            <div className="w-20 h-20 bg-brand-coral/10 rounded-2xl flex items-center justify-center mb-6">
              <svg className="w-10 h-10 text-brand-coral" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h14a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold mb-2">Choose Image Files</h2>
            <p className="text-gray-400">or drop images here</p>
          </div>
        </Dropzone>
      ) : (
        <div className="bg-surface p-10 rounded-[32px] border border-hairline text-center">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {files.map((file, idx) => (
              <div key={idx} className="p-4 border border-hairline rounded-xl bg-canvas">
                <p className="text-sm font-medium truncate">{file.name}</p>
                <p className="text-xs text-gray-400">{(file.size / 1024).toFixed(1)} KB</p>
              </div>
            ))}
          </div>
          <button 
            onClick={handleConvert} 
            className="button-primary px-12"
            disabled={isProcessing}
          >
            {isProcessing ? 'Processing...' : 'Convert to PDF'}
          </button>
          <button 
            onClick={() => setFiles([])} 
            className="block w-full mt-4 text-gray-400 hover:text-white transition-colors"
          >
            Clear selection
          </button>
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/pages/JpgToPdf.tsx
git commit -m "feat: add JpgToPdf page"
```

### Task 4: Implement PDF to JPG Page

**Files:**
- Create: `src/pages/PdfToJpg.tsx`

- [ ] **Step 1: Create PdfToJpg component**

```tsx
import React, { useState } from 'react';
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
```

- [ ] **Step 2: Commit**

```bash
git add src/pages/PdfToJpg.tsx
git commit -m "feat: add PdfToJpg page"
```

### Task 5: Update Routing and Home Page

**Files:**
- Modify: `src/App.tsx`
- Modify: `src/pages/Home.tsx`

- [ ] **Step 1: Add routes to App.tsx**

```tsx
import { ExcelToPdf } from './pages/ExcelToPdf';
import { PptToPdf } from './pages/PptToPdf';
import { JpgToPdf } from './pages/JpgToPdf';
import { PdfToJpg } from './pages/PdfToJpg';

// ... inside Routes
<Route path="excel-to-pdf" element={<ExcelToPdf />} />
<Route path="ppt-to-pdf" element={<PptToPdf />} />
<Route path="jpg-to-pdf" element={<JpgToPdf />} />
<Route path="pdf-to-jpg" element={<PdfToJpg />} />
```

- [ ] **Step 2: Add tools to Home.tsx**

```tsx
import { FileSpreadsheet, Presentation, Image as ImageIcon, Images } from 'lucide-react';

// ... inside tools array
{
  id: 'excel-to-pdf',
  name: 'Excel to PDF',
  description: 'Convert Excel spreadsheets to PDF documents.',
  icon: FileSpreadsheet,
  href: '/excel-to-pdf',
},
{
  id: 'ppt-to-pdf',
  name: 'PPT to PDF',
  description: 'Convert PowerPoint presentations to PDF documents.',
  icon: Presentation,
  href: '/ppt-to-pdf',
},
{
  id: 'jpg-to-pdf',
  name: 'JPG to PDF',
  description: 'Convert JPG, PNG, and other images to PDF.',
  icon: ImageIcon,
  href: '/jpg-to-pdf',
},
{
  id: 'pdf-to-jpg',
  name: 'PDF to JPG',
  description: 'Extract pages from a PDF as JPG images.',
  icon: Images,
  href: '/pdf-to-jpg',
}
```

- [ ] **Step 3: Commit**

```bash
git add src/App.tsx src/pages/Home.tsx
git commit -m "feat: integrate new tools into routing and home page"
```

### Task 6: Final Verification

- [ ] **Step 1: Run build to check for errors**

Run: `npm run build`
Expected: Successful build

- [ ] **Step 2: Final Commit**

```bash
git commit --allow-empty -m "chore: final verification complete"
```
