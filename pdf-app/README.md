# iLoveFreePdf

iLoveFreePdf is a professional-grade, 100% private, local-first PDF suite. It processes all documents directly in your browser using high-performance WebAssembly (WASM), ensuring that your sensitive data never leaves your device.

## Features

- **Organize PDFs:** Merge, Split, and Remove Pages.
- **Convert to PDF:** Word (DOCX/DOC), PowerPoint (PPT/PPTX), Excel (XLS/XLSX), and Images (JPG/PNG).
- **Convert from PDF:** Extract pages as high-quality JPG images into a ZIP archive.
- **Privacy First:** 100% local processing. No backend, no uploads, no databases.

## Technology

- **Framework:** React + Vite + TypeScript.
- **Design System:** MiniMax-inspired, premium, and clean UI with vibrant gradient product cards.
- **Conversion Engine:**
  - **Office Docs:** Uses `libreoffice-converter` (WASM) running in background Web Workers for desktop-class fidelity.
  - **Images:** Uses `pdf-lib` for fast image-to-PDF embedding and `pdf.js` for high-resolution PDF rendering.
- **Deployment:** Optimized for Vercel with automated asset caching for heavy binaries.

## Local Development

### Prerequisites
- Node.js 18.0.0+
- `npm`

### Setup
1. Clone the repository.
2. Run `npm install`.
   - *This will automatically run the postinstall script to sync the WASM conversion engine to your `public/` folder.*
3. Run `npm run dev` to start the development server.

## Security & Isolation
The app uses Cross-Origin Opener Policy (COOP) and Cross-Origin Embedder Policy (COEP) headers to enable `SharedArrayBuffer`, which is required by the LibreOffice WASM engine for multi-threaded performance.

## Licensing
MIT License.
