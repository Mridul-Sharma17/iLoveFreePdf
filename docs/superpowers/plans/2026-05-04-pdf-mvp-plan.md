# PDF Processing MVP Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a client-side, minimal, and polished web app for processing PDF files (Merge, Split, Remove Pages) with zero backend.

**Architecture:** A React Single Page Application utilizing Vite, Tailwind CSS for styling matching the `DESIGN.md` spec, `react-router-dom` for routing, `lucide-react` for icons, `@dnd-kit/sortable` for drag-and-drop file reordering, and `pdf-lib` for client-side PDF manipulation.

**Tech Stack:** React, TypeScript, Vite, Tailwind CSS, pdf-lib, react-router-dom, lucide-react, @dnd-kit/core, @dnd-kit/sortable.

---

### Task 1: Scaffold Project and Install Dependencies

**Files:**
- Create: `package.json`, `vite.config.ts`, `tailwind.config.js`, `postcss.config.js`, `src/index.css`

- [ ] **Step 1: Scaffold Vite Project**

```bash
npm create vite@latest pdf-app -- --template react-ts
cd pdf-app
npm install
```

- [ ] **Step 2: Install App Dependencies**

```bash
cd pdf-app
npm install react-router-dom lucide-react pdf-lib @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

- [ ] **Step 3: Configure Tailwind CSS**

```javascript
// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: "#ffffff",
        surface: "#f7f8fa",
        ink: "#0a0a0a",
        hairline: "#e5e7eb",
        steel: "#5f5f5f",
        "success-bg": "#e8ffea"
      },
      fontFamily: {
        sans: ["DM Sans", "Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
}
```

- [ ] **Step 4: Update Global CSS**

```css
/* src/index.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  body {
    @apply bg-canvas text-ink font-sans;
  }
}
```

- [ ] **Step 5: Verify Server Runs**

```bash
cd pdf-app
npm run build
```
Expected: successful build output with no errors.

---

### Task 2: Setup Routing and Base Layout

**Files:**
- Modify: `src/App.tsx`, `src/main.tsx`
- Create: `src/components/Layout.tsx`

- [ ] **Step 1: Create Base Layout Component**

```tsx
// src/components/Layout.tsx
import React from 'react';
import { Outlet, Link } from 'react-router-dom';

export function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-canvas text-ink">
      <header className="border-b border-hairline p-6">
        <Link to="/" className="text-xl font-bold tracking-tight">PDF Utilities</Link>
      </header>
      <main className="flex-1 w-full max-w-5xl mx-auto p-6">
        <Outlet />
      </main>
    </div>
  );
}
```

- [ ] **Step 2: Setup React Router in App.tsx**

```tsx
// src/App.tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';

function Home() { return <div>Home Screen</div>; }
function Merge() { return <div>Merge Screen</div>; }
function Split() { return <div>Split Screen</div>; }
function Remove() { return <div>Remove Screen</div>; }

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="merge" element={<Merge />} />
          <Route path="split" element={<Split />} />
          <Route path="remove" element={<Remove />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
```

- [ ] **Step 3: Update main.tsx**

```tsx
// src/main.tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
```

---

### Task 3: Implement Home Screen UI

**Files:**
- Create: `src/pages/Home.tsx`
- Modify: `src/App.tsx`

- [ ] **Step 1: Create Home Component**

```tsx
// src/pages/Home.tsx
import { Link } from 'react-router-dom';
import { Layers, SplitSquareHorizontal, FileMinus } from 'lucide-react';

export function Home() {
  const tools = [
    {
      id: 'merge',
      name: 'Merge PDFs',
      description: 'Combine multiple PDF files into a single document.',
      icon: Layers,
      href: '/merge',
    },
    {
      id: 'split',
      name: 'Split PDF',
      description: 'Extract specific pages from a PDF into a new file.',
      icon: SplitSquareHorizontal,
      href: '/split',
    },
    {
      id: 'remove',
      name: 'Remove Pages',
      description: 'Delete specific pages from a PDF document.',
      icon: FileMinus,
      href: '/remove',
    }
  ];

  return (
    <div className="py-12">
      <h1 className="text-4xl font-semibold mb-12 tracking-tight">Select a Tool</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {tools.map((tool) => (
          <Link
            key={tool.id}
            to={tool.href}
            className="group flex flex-col p-8 bg-canvas border border-hairline rounded-xl hover:shadow-md transition-all duration-300"
          >
            <div className="w-12 h-12 flex items-center justify-center rounded-full bg-surface mb-6">
              <tool.icon className="w-6 h-6 text-ink" />
            </div>
            <h2 className="text-xl font-semibold mb-2">{tool.name}</h2>
            <p className="text-steel text-sm leading-relaxed">{tool.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Update App.tsx**

```tsx
// src/App.tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';

function Merge() { return <div>Merge Screen</div>; }
function Split() { return <div>Split Screen</div>; }
function Remove() { return <div>Remove Screen</div>; }

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="merge" element={<Merge />} />
          <Route path="split" element={<Split />} />
          <Route path="remove" element={<Remove />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
```

---

### Task 4: Implement Drag & Drop Hook and Component

**Files:**
- Create: `src/components/Dropzone.tsx`

- [ ] **Step 1: Create reusable Dropzone component**

```tsx
// src/components/Dropzone.tsx
import React, { useCallback, useState } from 'react';

interface DropzoneProps {
  onFilesDrop: (files: File[]) => void;
  multiple?: boolean;
  children: React.ReactNode;
}

export function Dropzone({ onFilesDrop, multiple = false, children }: DropzoneProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);

      const files = Array.from(e.dataTransfer.files).filter(
        (file) => file.type === 'application/pdf'
      );

      if (files.length > 0) {
        onFilesDrop(multiple ? files : [files[0]]);
      }
    },
    [onFilesDrop, multiple]
  );

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`min-h-[60vh] flex flex-col transition-colors duration-300 rounded-xl ${
        isDragging ? 'bg-success-bg border-2 border-dashed border-ink/20' : 'bg-transparent'
      }`}
    >
      {children}
    </div>
  );
}
```

---

### Task 5: Implement PDF Utilities (Merge Logic)

**Files:**
- Create: `src/lib/pdf-utils.ts`

- [ ] **Step 1: Write PDF merge function**

```typescript
// src/lib/pdf-utils.ts
import { PDFDocument } from 'pdf-lib';

export async function mergePdfs(files: File[]): Promise<Uint8Array> {
  const mergedPdf = await PDFDocument.create();

  for (const file of files) {
    const arrayBuffer = await file.arrayBuffer();
    const pdfDoc = await PDFDocument.load(arrayBuffer);
    const copiedPages = await mergedPdf.copyPages(pdfDoc, pdfDoc.getPageIndices());
    
    copiedPages.forEach((page) => {
      mergedPdf.addPage(page);
    });
  }

  return await mergedPdf.save();
}

export function downloadPdf(bytes: Uint8Array, filename: string) {
  const blob = new Blob([bytes], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
```

---

### Task 6: Implement Merge UI

**Files:**
- Create: `src/pages/Merge.tsx`
- Modify: `src/App.tsx`

- [ ] **Step 1: Create Merge Screen**

```tsx
// src/pages/Merge.tsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Layers, GripVertical, X } from 'lucide-react';
import { Dropzone } from '../components/Dropzone';
import { mergePdfs, downloadPdf } from '../lib/pdf-utils';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

function SortableItem({ id, file, onRemove }: { id: string, file: File, onRemove: (id: string) => void }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
  const style = { transform: CSS.Transform.toString(transform), transition };

  return (
    <div ref={setNodeRef} style={style} className="flex items-center justify-between p-4 bg-canvas border border-hairline rounded-md mb-2">
      <div className="flex items-center gap-4">
        <button {...attributes} {...listeners} className="text-steel hover:text-ink cursor-grab">
          <GripVertical size={20} />
        </button>
        <span className="font-medium text-sm truncate max-w-[200px] md:max-w-md">{file.name}</span>
      </div>
      <button onClick={() => onRemove(id)} className="text-steel hover:text-red-500">
        <X size={20} />
      </button>
    </div>
  );
}

export function Merge() {
  const [files, setFiles] = useState<{id: string, file: File}[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleFilesDrop = (droppedFiles: File[]) => {
    const newFiles = droppedFiles.map(f => ({ id: Math.random().toString(36).substr(2, 9), file: f }));
    setFiles(prev => [...prev, ...newFiles]);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setFiles((items) => {
        const oldIndex = items.findIndex(i => i.id === active.id);
        const newIndex = items.findIndex(i => i.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const removeFile = (id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id));
  };

  const handleMerge = async () => {
    if (files.length < 2) return;
    setIsProcessing(true);
    setProgress(50);
    try {
      const mergedBytes = await mergePdfs(files.map(f => f.file));
      setProgress(100);
      downloadPdf(mergedBytes, 'merged_result.pdf');
    } catch (e) {
      console.error(e);
      alert('Failed to merge PDFs');
    } finally {
      setTimeout(() => { setIsProcessing(false); setProgress(0); }, 1000);
    }
  };

  return (
    <div className="animate-in fade-in duration-300">
      <Link to="/" className="inline-flex items-center text-sm font-medium text-steel hover:text-ink mb-8">
        <ArrowLeft size={16} className="mr-2" /> Back to tools
      </Link>
      
      <h1 className="text-3xl font-semibold mb-2">Merge PDFs</h1>
      <p className="text-steel mb-8">Drag and drop multiple PDFs and reorder them before merging.</p>

      <Dropzone onFilesDrop={handleFilesDrop} multiple>
        {files.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-steel pointer-events-none">
            <Layers size={64} strokeWidth={1} className="mb-4" />
            <p>Drop PDF files here to begin</p>
          </div>
        ) : (
          <div className="flex-1">
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <SortableContext items={files.map(f => f.id)} strategy={verticalListSortingStrategy}>
                {files.map((fileObj) => (
                  <SortableItem key={fileObj.id} id={fileObj.id} file={fileObj.file} onRemove={removeFile} />
                ))}
              </SortableContext>
            </DndContext>
            
            <div className="mt-8 flex flex-col items-end">
              {isProcessing && (
                <div className="w-full bg-surface h-2 rounded-full mb-4 overflow-hidden">
                  <div className="bg-ink h-full transition-all duration-300" style={{ width: `${progress}%` }}></div>
                </div>
              )}
              <button 
                onClick={handleMerge}
                disabled={files.length < 2 || isProcessing}
                className="bg-ink text-white px-6 py-3 rounded-full font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-black transition-colors"
              >
                {isProcessing ? 'Merging...' : 'Merge PDFs'}
              </button>
            </div>
          </div>
        )}
      </Dropzone>
    </div>
  );
}
```

- [ ] **Step 2: Update App.tsx to use Merge**

```tsx
// src/App.tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { Merge } from './pages/Merge';

function Split() { return <div>Split Screen</div>; }
function Remove() { return <div>Remove Screen</div>; }

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="merge" element={<Merge />} />
          <Route path="split" element={<Split />} />
          <Route path="remove" element={<Remove />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
```

---

### Task 7: Implement Split & Remove Logic

**Files:**
- Modify: `src/lib/pdf-utils.ts`

- [ ] **Step 1: Write page parsing utility**

```typescript
// src/lib/pdf-utils.ts (append to bottom)

// Parses a string like "1, 3, 5-8" into an array of 0-indexed page numbers [0, 2, 4, 5, 6, 7]
export function parsePageNumbers(input: string, maxPages: number): number[] {
  const pages = new Set<number>();
  const parts = input.split(',');

  for (const part of parts) {
    const trimmed = part.trim();
    if (!trimmed) continue;

    if (trimmed.includes('-')) {
      const [start, end] = trimmed.split('-').map(n => parseInt(n, 10));
      if (!isNaN(start) && !isNaN(end) && start <= end) {
        for (let i = start; i <= end; i++) {
          if (i > 0 && i <= maxPages) pages.add(i - 1);
        }
      }
    } else {
      const num = parseInt(trimmed, 10);
      if (!isNaN(num) && num > 0 && num <= maxPages) {
        pages.add(num - 1);
      }
    }
  }

  return Array.from(pages).sort((a, b) => a - b);
}
```

- [ ] **Step 2: Write specific extraction logic**

```typescript
// src/lib/pdf-utils.ts (append to bottom)

export async function extractPages(file: File, pageNumbers: number[]): Promise<Uint8Array> {
  const arrayBuffer = await file.arrayBuffer();
  const srcDoc = await PDFDocument.load(arrayBuffer);
  const newDoc = await PDFDocument.create();

  const pagesToExtract = pageNumbers.filter(n => n >= 0 && n < srcDoc.getPageCount());
  
  if (pagesToExtract.length === 0) throw new Error("No valid pages to extract");

  const copiedPages = await newDoc.copyPages(srcDoc, pagesToExtract);
  copiedPages.forEach((page) => newDoc.addPage(page));

  return await newDoc.save();
}

export async function removePages(file: File, pageNumbersToRemove: number[]): Promise<Uint8Array> {
  const arrayBuffer = await file.arrayBuffer();
  const srcDoc = await PDFDocument.load(arrayBuffer);
  const newDoc = await PDFDocument.create();

  const totalPages = srcDoc.getPageCount();
  const pagesToKeep = [];

  for (let i = 0; i < totalPages; i++) {
    if (!pageNumbersToRemove.includes(i)) {
      pagesToKeep.push(i);
    }
  }

  if (pagesToKeep.length === 0) throw new Error("Cannot remove all pages");

  const copiedPages = await newDoc.copyPages(srcDoc, pagesToKeep);
  copiedPages.forEach((page) => newDoc.addPage(page));

  return await newDoc.save();
}

export async function getPdfPageCount(file: File): Promise<number> {
  const arrayBuffer = await file.arrayBuffer();
  const pdfDoc = await PDFDocument.load(arrayBuffer);
  return pdfDoc.getPageCount();
}
```

---

### Task 8: Implement Split UI

**Files:**
- Create: `src/pages/Split.tsx`
- Modify: `src/App.tsx`

- [ ] **Step 1: Create Split Screen**

```tsx
// src/pages/Split.tsx
import React, { useState } from 'react';
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
            <p>Drop a single PDF file here</p>
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
```

- [ ] **Step 2: Update App.tsx**

```tsx
// src/App.tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { Merge } from './pages/Merge';
import { Split } from './pages/Split';

function Remove() { return <div>Remove Screen</div>; }

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="merge" element={<Merge />} />
          <Route path="split" element={<Split />} />
          <Route path="remove" element={<Remove />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
```

---

### Task 9: Implement Remove Pages UI

**Files:**
- Create: `src/pages/Remove.tsx`
- Modify: `src/App.tsx`

- [ ] **Step 1: Create Remove Screen**

```tsx
// src/pages/Remove.tsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, FileMinus, File } from 'lucide-react';
import { Dropzone } from '../components/Dropzone';
import { removePages, parsePageNumbers, downloadPdf, getPdfPageCount } from '../lib/pdf-utils';

export function Remove() {
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
    setProgress(50);
    try {
      const resultBytes = await removePages(file, pagesToDelete);
      setProgress(100);
      downloadPdf(resultBytes, 'cleaned_document.pdf');
    } catch (e) {
      console.error(e);
      alert('Failed to remove pages');
    } finally {
      setTimeout(() => { setIsProcessing(false); setProgress(0); }, 1000);
    }
  };

  return (
    <div className="animate-in fade-in duration-300">
      <Link to="/" className="inline-flex items-center text-sm font-medium text-steel hover:text-ink mb-8">
        <ArrowLeft size={16} className="mr-2" /> Back to tools
      </Link>
      
      <h1 className="text-3xl font-semibold mb-2">Remove Pages</h1>
      <p className="text-steel mb-8">Delete specific pages from a document.</p>

      <Dropzone onFilesDrop={handleFilesDrop} multiple={false}>
        {!file ? (
          <div className="flex-1 flex flex-col items-center justify-center text-steel pointer-events-none">
            <FileMinus size={64} strokeWidth={1} className="mb-4" />
            <p>Drop a single PDF file here</p>
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
              <label className="block text-sm font-semibold mb-2 text-red-600">Pages to delete</label>
              <input 
                type="text" 
                placeholder="e.g., 1, 3, 5-8" 
                value={pageInput}
                onChange={(e) => setPageInput(e.target.value)}
                className="w-full bg-canvas text-ink border border-hairline rounded-md px-4 py-2 focus:outline-none focus:border-red-600 transition-colors"
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
                onClick={handleRemove}
                disabled={isProcessing || !pageInput.trim()}
                className="bg-ink text-white px-6 py-3 rounded-full font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-black transition-colors"
              >
                {isProcessing ? 'Processing...' : 'Remove Pages'}
              </button>
            </div>
          </div>
        )}
      </Dropzone>
    </div>
  );
}
```

- [ ] **Step 2: Update App.tsx to complete routing**

```tsx
// src/App.tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { Merge } from './pages/Merge';
import { Split } from './pages/Split';
import { Remove } from './pages/Remove';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="merge" element={<Merge />} />
          <Route path="split" element={<Split />} />
          <Route path="remove" element={<Remove />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
```
