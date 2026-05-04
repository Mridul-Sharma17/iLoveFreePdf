# PDF Processing MVP Web App - Design Spec

## 1. Overview
A client-side, minimal, and polished web app for processing PDF files. It focuses purely on three utilities: merging multiple PDFs, splitting a single PDF into extracted pages, and removing selected pages from a PDF. 

## 2. Architecture & Stack
- **Framework:** React (Vite) + TypeScript
- **Styling:** Tailwind CSS mapped to tokens from `DESIGN.md`.
- **Core Engine:** `pdf-lib` for completely client-side file merging, splitting, and page removal.
- **Icons:** `lucide-react` for monochrome, clean SVGs.
- **State Management:** React `useState` / `useReducer` for files and processing status.

## 3. Visual Design (per DESIGN.md & User Choices)
- **Cards:** Stark and minimal white backgrounds (`card-base`), black text, hairline borders, subtle hover elevation.
- **Dropzone:** Full-page dropzone. When a user drags a file over the tool screen, the entire page background subtly tints (e.g., using `success-bg`) to indicate readiness.
- **Transitions:** Subtle fades between screens and states (using Framer Motion or simple CSS transitions).
- **Empty States:** Text paired with oversized, monochrome Lucide icons centered on the screen.
- **Processing State:** A thin, elegant progress bar (e.g., filling up from 0% to 100%).

## 4. Layout & Navigation Flow
- **Home Screen (`/`)**:
  - Clean header ("PDF Utilities").
  - 3-column grid containing stark, minimal tool cards: Merge, Split, Remove Pages.
- **Tool Screens (`/merge`, `/split`, `/remove`)**:
  - Clean "← Back to tools" button at the top left.
  - Main container acts as the full-page dropzone.
  - Central area switches between Empty State (icon + text), Uploaded/Action State (file list/inputs + action button), Processing State (progress bar), and Success State (download button).

## 5. Core Features & UX Flow

### A. Merge PDFs (`/merge`)
- **Action:** User drops multiple PDFs.
- **UI:** List of files showing file name and page count. 
- **Interaction:** User can drag to reorder the list (using `@dnd-kit/sortable` or similar lightweight lib).
- **Execution:** Click "Merge PDFs" (black pill button). `pdf-lib` combines the files in the defined order.

### B. Split PDF (`/split`)
- **Action:** User drops a single PDF.
- **UI:** Shows file name and total page count.
- **Interaction:** Clean text input (`text-input` style) to enter pages to split/extract (e.g., "1-5", "8"). 
- **Execution:** Click "Split PDF". `pdf-lib` extracts those specific pages into a new document.

### C. Remove Pages (`/remove`)
- **Action:** User drops a single PDF.
- **UI:** Shows file name and total page count.
- **Interaction:** Clean text input to enter pages to delete (e.g., "2", "4-6").
- **Execution:** Click "Remove Pages". `pdf-lib` copies all pages *except* the targeted ones into a new document.

## 6. Edge Cases & Constraints
- Only `.pdf` files accepted. Display error toast if other types dropped.
- For Split/Remove: Inputs must be validated (e.g., cannot request page 10 if document only has 5 pages).
- All processing is client-side; memory limits apply based on the browser, but the UI should fail gracefully if `pdf-lib` throws an error.
