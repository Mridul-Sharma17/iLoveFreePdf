# Design Spec: Homepage Redesign (MiniMax Vibrant Grid)

Implement Task 9: Final Polish - Homepage Redesign for iLoveFreePdf v2.

## Hero Section
- **Title**: "Every tool you need<br/>to work with PDFs."
- **Class**: `.hero-text` (defined in `index.css`).
- **Subtext**: "100% Free, Local, and Private."
- **Subtext Class**: `text-gray-400 text-xl`.

## Tool Grid
- **Layout**: `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6`.
- **Card Base Classes**: `flex flex-col p-8 rounded-[32px] text-white hover:scale-[1.02] transition-transform cursor-pointer`.

### Categories & Assignments
1. **Organize PDF (Purple: `bg-brand-purple`)**
   - Merge PDF (`/merge`)
   - Split PDF (`/split`)
   - Remove Pages (`/remove`)
2. **Convert to PDF (Coral: `.card-vibrant-coral`)**
   - Word to PDF (`/word-to-pdf`)
   - Excel to PDF (`/excel-to-pdf`)
   - PPT to PDF (`/ppt-to-pdf`)
   - JPG to PDF (`/jpg-to-pdf`)
3. **Convert from PDF (Blue: `bg-brand-blue`)**
   - PDF to JPG (`/pdf-to-jpg`)

### Card Content
- **Title**: `text-2xl font-bold mb-2`
- **Description**: `text-white/70 text-sm`
- **Icon**: Lucide icon in top-left or top-right.

## Verification
- Confirm all 8 tools are present.
- Confirm colors match categories.
- Confirm responsive grid works on mobile/desktop.
