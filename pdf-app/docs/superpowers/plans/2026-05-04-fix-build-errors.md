# Fix Build and TypeScript Errors Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix unused React imports (React 19), BlobPart casting for SharedArrayBuffer compatibility, and pdfjs-dist render call.

**Architecture:** Surgical code fixes in library and page components to satisfy TypeScript compiler and runtime requirements.

**Tech Stack:** React 19, TypeScript, pdf-lib, pdfjs-dist.

---

### Task 1: Fix Unused React Imports (React 19)

**Files:**
- Modify: `src/components/SuccessScreen.test.tsx`
- Modify: `src/components/SuccessScreen.tsx`
- Modify: `src/pages/ExcelToPdf.tsx`
- Modify: `src/pages/JpgToPdf.tsx`
- Modify: `src/pages/PdfToJpg.tsx`
- Modify: `src/pages/PptToPdf.tsx`
- Modify: `src/pages/WordToPdf.tsx`

- [ ] **Step 1: Remove React imports from SuccessScreen files**
- [ ] **Step 2: Remove React imports from Conversion page files**
- [ ] **Step 3: Commit**

```bash
git add src/components/SuccessScreen.test.tsx src/components/SuccessScreen.tsx src/pages/ExcelToPdf.tsx src/pages/JpgToPdf.tsx src/pages/PdfToJpg.tsx src/pages/PptToPdf.tsx src/pages/WordToPdf.tsx
git commit -m "fix: remove unused react imports for react 19"
```

### Task 2: Fix BlobPart errors (SharedArrayBuffer mismatch)

**Files:**
- Modify: `src/lib/pdf-utils.test.ts`
- Modify: `src/lib/pdf-utils.ts`
- Modify: `src/lib/useLibreOffice.ts`

- [ ] **Step 1: Cast bytes to any in src/lib/pdf-utils.test.ts**
- [ ] **Step 2: Cast bytes to any in src/lib/pdf-utils.ts (downloadPdf and convertJpgsToPdf)**
- [ ] **Step 3: Cast result.data to any in src/lib/useLibreOffice.ts**
- [ ] **Step 4: Commit**

```bash
git add src/lib/pdf-utils.test.ts src/lib/pdf-utils.ts src/lib/useLibreOffice.ts
git commit -m "fix: cast buffer to any in Blob/File constructor to satisfy SharedArrayBuffer types"
```

### Task 3: Fix pdfjs-dist render parameter error

**Files:**
- Modify: `src/lib/pdf-image-utils.ts`

- [ ] **Step 1: Update page.render call in src/lib/pdf-image-utils.ts**
- [ ] **Step 2: Commit**

```bash
git add src/lib/pdf-image-utils.ts
git commit -m "fix: include canvas in pdfjs-dist render call"
```

### Task 4: Verify Build

- [ ] **Step 1: Run build command**

Run: `npm run build`
Expected: PASS with no TypeScript or build errors.

- [ ] **Step 2: Final commit if any adjustments were made**
