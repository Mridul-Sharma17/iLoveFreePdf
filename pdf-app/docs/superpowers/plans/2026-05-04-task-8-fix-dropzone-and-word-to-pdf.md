# Task 8: Refactor Dropzone and Improve WordToPdf Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Refactor `Dropzone.tsx` to be generic and improve `WordToPdf.tsx` to handle conversion loading states and use the updated Dropzone correctly.

**Architecture:** 
1. Make `Dropzone.tsx` generic by accepting `onFilesSelect`, `accept`, and removing hardcoded PDF filters.
2. Update `WordToPdf.tsx` to show a processing overlay during conversion and use the new Dropzone API.

**Tech Stack:** React, TypeScript, Tailwind CSS

---

### Task 1: Refactor `Dropzone.tsx`

**Files:**
- Modify: `src/components/Dropzone.tsx`

- [ ] **Step 1: Update Dropzone interface and implementation**

```typescript
import React, { useCallback, useState, useRef } from 'react';

interface DropzoneProps {
  onFilesSelect: (files: File[]) => void;
  multiple?: boolean;
  accept?: string;
  children: React.ReactNode;
}

export function Dropzone({ onFilesSelect, multiple = false, accept = "*", children }: DropzoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const processFiles = useCallback((fileList: FileList | null) => {
    if (!fileList) return;
    const files = Array.from(fileList);
    // Removed hardcoded PDF filter to allow any file type specified by 'accept' prop

    if (files.length > 0) {
      onFilesSelect(multiple ? files : [files[0]]);
    }
  }, [onFilesSelect, multiple]);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      processFiles(e.dataTransfer.files);
    },
    [processFiles]
  );

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    processFiles(e.target.files);
  };

  const openFilePicker = () => {
    fileInputRef.current?.click();
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={openFilePicker}
      className={`min-h-[60vh] flex flex-col transition-colors duration-300 rounded-xl relative cursor-pointer ${
        isDragging ? 'bg-success-bg border-2 border-dashed border-ink/20' : 'bg-transparent'
      }`}
    >
      <input
        type="file"
        id="pdf-upload-input"
        ref={fileInputRef}
        onChange={handleFileInputChange}
        accept={accept}
        multiple={multiple}
        className="hidden"
        data-testid="file-input"
      />
      {children}
    </div>
  );
}
```

- [ ] **Step 2: Commit refactored Dropzone**

```bash
git add src/components/Dropzone.tsx
git commit -m "refactor: make Dropzone generic and rename onFilesDrop to onFilesSelect"
```

### Task 2: Fix `WordToPdf.tsx`

**Files:**
- Modify: `src/pages/WordToPdf.tsx`

- [ ] **Step 1: Update WordToPdf to use new Dropzone API and handle conversion loading state**

```typescript
import React, { useState } from 'react';
import { Dropzone } from '../components/Dropzone';
import { useLibreOffice } from '../lib/useLibreOffice';
import { SuccessScreen } from '../components/SuccessScreen';

export function WordToPdf() {
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
      {isLoading && (
        <div className="fixed inset-0 bg-white/80 z-50 flex flex-col items-center justify-center">
          <div className="w-64 h-2 bg-gray-100 rounded-full overflow-hidden mb-4">
            <div 
              className="h-full bg-brand-coral transition-all duration-300" 
              style={{ width: `${isConverting ? 100 : progress.percent}%` }} 
            />
          </div>
          <p className="font-bold text-primary">
            {isConverting ? 'Converting Word to PDF...' : (progress.message || 'Loading Engine...')}
          </p>
          {!isConverting && <p className="text-sm text-gray-400 mt-2">{progress.percent}%</p>}
        </div>
      )}
      <h1 className="text-4xl font-bold mb-10 text-center">Word to PDF</h1>
      {!file ? (
        <Dropzone onFilesSelect={(files) => setFile(files[0])} accept=".doc,.docx">
          <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-hairline rounded-[32px] p-10 hover:border-brand-coral transition-colors">
            <div className="w-20 h-20 bg-brand-coral/10 rounded-2xl flex items-center justify-center mb-6">
              <svg className="w-10 h-10 text-brand-coral" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold mb-2">Choose Word Files</h2>
            <p className="text-gray-400">or drop Word files here</p>
          </div>
        </Dropzone>
      ) : (
        <div className="bg-surface p-10 rounded-[32px] border border-hairline text-center">
          <h2 className="text-xl font-bold mb-2">{file.name}</h2>
          <p className="text-gray-400 mb-8">{(file.size / 1024).toFixed(1)} KB</p>
          {file.size > 50 * 1024 * 1024 && (
             <p className="text-brand-coral text-sm mb-4 font-bold italic">
               Large file detected. Processing may take a few moments.
             </p>
          )}
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

- [ ] **Step 2: Update other pages that use Dropzone**

I should check if `Merge.tsx`, `Split.tsx`, `Remove.tsx` also use `Dropzone`.

- [ ] **Step 3: Commit WordToPdf fixes**

```bash
git add src/pages/WordToPdf.tsx
git commit -m "fix: WordToPdf loading states and use updated Dropzone API"
```

### Task 3: Verification

- [ ] **Step 1: Check for compilation errors**

Run: `npm run tsc` (or equivalent)

- [ ] **Step 2: Run tests if any**

Run: `npm test`
