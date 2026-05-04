import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Layers, GripVertical, X } from 'lucide-react';
import { Dropzone } from '../components/Dropzone';
import { mergePdfs, downloadPdf } from '../lib/pdf-utils';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, type DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

function SortableItem({ id, file, onRemove }: { id: string, file: File, onRemove: (id: string) => void }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
  const style = { transform: CSS.Transform.toString(transform), transition };

  return (
    <div ref={setNodeRef} style={style} className="flex items-center justify-between p-4 bg-canvas border border-hairline rounded-md mb-2">
      <div className="flex items-center gap-4">
        <button {...attributes} {...listeners} className="text-steel hover:text-ink cursor-grab" aria-label={`Reorder ${file.name}`}>
          <GripVertical size={20} />
        </button>
        <span className="font-medium text-sm truncate max-w-[200px] md:max-w-md">{file.name}</span>
      </div>
      <button onClick={() => onRemove(id)} className="text-steel hover:text-red-500" aria-label={`Remove ${file.name}`}>
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
            <p className="mb-8">Drop PDF files here to begin</p>
            <label 
              htmlFor="pdf-upload-input" 
              className="bg-surface text-ink border border-hairline px-6 py-2 rounded-full font-medium hover:bg-hairline transition-colors cursor-pointer pointer-events-auto"
            >
              Or Select Files
            </label>
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
