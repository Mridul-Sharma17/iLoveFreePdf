# iLoveFreePdf

iLoveFreePdf is a professional-grade, 100% private, local-first PDF suite. It processes all documents directly in your browser using high-performance WebAssembly (WASM), ensuring that your sensitive data never leaves your device.

## 🚀 Live Demo
[https://pdf-app-coral-beta.vercel.app](https://pdf-app-coral-beta.vercel.app)

## ✨ Features

- **Organize PDFs:** Merge, Split, and Remove Pages.
- **Convert to PDF:** Word (DOCX/DOC), PowerPoint (PPT/PPTX), Excel (XLS/XLSX), and Images (JPG/PNG).
- **Convert from PDF:** Extract pages as high-quality JPG images into a ZIP archive.
- **Privacy First:** 100% local processing. No backend, no uploads, no databases.

## 🛠️ Technology Stack

- **Frontend:** React + Vite + TypeScript.
- **Design System:** MiniMax-inspired, premium, and clean UI with vibrant gradient product cards.
- **Conversion Engines:**
  - **Office Docs:** Uses `@matbee/libreoffice-converter` (WASM) running in background Web Workers for desktop-class fidelity.
  - **Images:** Uses `pdf-lib` for fast image-to-PDF embedding and `pdf.js` for high-resolution PDF rendering.
- **Asset Performance:** Optimized for Vercel with automated asset caching for heavy binaries.

## 💻 Local Development

### Prerequisites
- Node.js 18.0.0+
- `npm`

### Setup Instructions
1. **Clone the repository:**
   ```bash
   git clone https://github.com/Mridul-Sharma17/iLoveFreePdf.git
   cd iLoveFreePdf
   ```
2. **Install dependencies:**
   ```bash
   cd pdf-app
   npm install
   ```
   *Note: This will automatically run the postinstall script to sync the WASM conversion engine to your `public/` folder.*
3. **Run the development server:**
   ```bash
   npm run dev
   ```
4. **Open in browser:**
   Navigate to `http://localhost:5173`.

## 🔒 Security & Isolation
The application implements Cross-Origin Opener Policy (COOP) and Cross-Origin Embedder Policy (COEP) headers to enable `SharedArrayBuffer`, which is required by the LibreOffice WASM engine for high-performance, multi-threaded document processing.

## 📄 License
MIT License.
