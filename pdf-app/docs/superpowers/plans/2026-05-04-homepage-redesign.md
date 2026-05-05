# Homepage Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign the homepage to match the MiniMax brand identity with a vibrant grid of 8 PDF tools.

**Architecture:** Update `Home.tsx` with a new Hero section and a responsive grid using custom colors and styles. Update `Home.test.tsx` to verify the new content.

**Tech Stack:** React, Tailwind CSS, Lucide React, Vitest, React Testing Library.

---

### Task 1: Update Home.tsx Implementation

**Files:**
- Modify: `src/pages/Home.tsx`

- [ ] **Step 1: Replace existing Home component implementation**

```tsx
import { Link } from 'react-router-dom';
import { 
  Layers, 
  SplitSquareHorizontal, 
  FileMinus, 
  FileText, 
  FileSpreadsheet, 
  Presentation, 
  Image as ImageIcon, 
  FileImage 
} from 'lucide-react';

export function Home() {
  const toolGroups = [
    {
      name: 'Organize PDF',
      color: 'bg-brand-purple',
      tools: [
        {
          id: 'merge',
          name: 'Merge PDF',
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
        },
      ]
    },
    {
      name: 'Convert to PDF',
      color: 'card-vibrant-coral',
      tools: [
        {
          id: 'word-to-pdf',
          name: 'Word to PDF',
          description: 'Convert DOCX and DOC files to PDF documents.',
          icon: FileText,
          href: '/word-to-pdf',
        },
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
          description: 'Convert images to PDF documents.',
          icon: ImageIcon,
          href: '/jpg-to-pdf',
        },
      ]
    },
    {
      name: 'Convert from PDF',
      color: 'bg-brand-blue',
      tools: [
        {
          id: 'pdf-to-jpg',
          name: 'PDF to JPG',
          description: 'Extract images or convert PDF pages to JPG.',
          icon: FileImage,
          href: '/pdf-to-jpg',
        },
      ]
    }
  ];

  return (
    <div className="py-20">
      <div className="mb-20 text-center md:text-left">
        <h1 className="hero-text mb-6">
          Every tool you need<br />to work with PDFs.
        </h1>
        <p className="text-gray-400 text-xl font-medium">
          100% Free, Local, and Private.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {toolGroups.flatMap(group => 
          group.tools.map((tool) => (
            <Link
              key={tool.id}
              to={tool.href}
              className={`group flex flex-col p-8 ${group.color} rounded-[32px] text-white hover:scale-[1.02] transition-transform cursor-pointer shadow-sm`}
            >
              <div className="mb-6">
                <tool.icon className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold mb-2">{tool.name}</h2>
              <p className="text-white/70 text-sm leading-relaxed">{tool.description}</p>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit changes to Home.tsx**

```bash
git add src/pages/Home.tsx
git commit -m "feat: redesign homepage with MiniMax vibrant grid"
```

---

### Task 2: Update Home.test.tsx

**Files:**
- Modify: `src/pages/Home.test.tsx`

- [ ] **Step 1: Update Home.test.tsx to match new content**

```tsx
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Home } from './Home';
import { describe, it, expect } from 'vitest';

describe('Home component', () => {
  it('renders the hero section and tool cards', () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

    // Check Hero text
    expect(screen.getByText(/Every tool you need/i)).toBeInTheDocument();
    expect(screen.getByText(/to work with PDFs/i)).toBeInTheDocument();
    expect(screen.getByText(/100% Free, Local, and Private/i)).toBeInTheDocument();

    // Check for some tool headings
    expect(screen.getByRole('heading', { level: 2, name: /Merge PDF/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: /Word to PDF/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: /PDF to JPG/i })).toBeInTheDocument();

    // Verify links
    expect(screen.getByRole('link', { name: /Merge PDF/i }).getAttribute('href')).toBe('/merge');
    expect(screen.getByRole('link', { name: /Word to PDF/i }).getAttribute('href')).toBe('/word-to-pdf');
    expect(screen.getByRole('link', { name: /PDF to JPG/i }).getAttribute('href')).toBe('/pdf-to-jpg');
  });
});
```

- [ ] **Step 2: Run tests to verify**

Run: `npm test src/pages/Home.test.tsx`
Expected: PASS

- [ ] **Step 3: Commit test changes**

```bash
git add src/pages/Home.test.tsx
git commit -m "test: update homepage tests for redesigned layout"
```
