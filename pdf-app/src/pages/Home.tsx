
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
