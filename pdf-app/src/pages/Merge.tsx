import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Layers, GripVertical, X } from 'lucide-react';
import { Dropzone } from '../components/Dropzone';
import { mergePdfs } from '../lib/pdf-utils';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, type DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { SuccessScreen } from '../components/SuccessScreen';
import { ProcessingOverlay } from '../components/ProcessingOverlay';

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
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);

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
    try {
      const mergedBytes = await mergePdfs(files.map(f => f.file));
      setResultBlob(new Blob([mergedBytes as any], { type: 'application/pdf' }));
    } catch (e) {
      console.error(e);
      alert('Failed to merge PDFs');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!resultBlob) return;
    const url = URL.createObjectURL(resultBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'merged_result.pdf';
    a.click();
    URL.revokeObjectURL(url);
  };

  if (resultBlob) {
    return <SuccessScreen onDownload={handleDownload} onRestart={() => { setFiles([]); setResultBlob(null); }} />;
  }

  return (
    <div className="animate-in fade-in duration-300 max-w-4xl mx-auto py-10">
      <ProcessingOverlay isConverting={isProcessing} message="Merging PDFs..." />
      
      <Link to="/" className="inline-flex items-center text-sm font-medium text-steel hover:text-ink mb-8">
        <ArrowLeft size={16} className="mr-2" /> Back to tools
      </Link>
      
      <h1 className="text-4xl font-bold mb-2 text-center">Merge PDF</h1>
      <p className="text-steel mb-10 text-center">Drag and drop multiple PDFs and reorder them before merging.</p>

      {files.length === 0 ? (
        <Dropzone onFilesSelect={handleFilesDrop} multiple accept="application/pdf">
          <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-hairline rounded-[32px] p-10 hover:border-brand-purple transition-colors">
            <div className="w-20 h-20 bg-brand-purple/10 rounded-2xl flex items-center justify-center mb-6">
              <Layers size={40} className="text-brand-purple" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Choose PDF Files</h2>
            <p className="text-gray-400">or drop PDF files here</p>
          </div>
        </Dropzone>
      ) : (
        <div className="bg-surface p-8 rounded-[32px] border border-hairline">
          <div className="mb-6 flex justify-between items-center">
            <span className="text-sm font-bold text-steel uppercase tracking-wider">{files.length} Files selected</span>
            <button 
              onClick={() => {
                const input = document.createElement('input');
                input.type = 'file';
                input.accept = 'application/pdf';
                input.multiple = true;
                input.onchange = (e) => {
                  const files = (e.target as HTMLInputElement).files;
                  if (files) handleFilesDrop(Array.from(files));
                };
                input.click();
              }}
              className="text-brand-purple font-bold hover:underline"
            >
              + Add More
            </button>
          </div>

          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={files.map(f => f.id)} strategy={verticalListSortingStrategy}>
              <div className="grid grid-cols-1 gap-2">
                {files.map((fileObj) => (
                  <SortableItem key={fileObj.id} id={fileObj.id} file={fileObj.file} onRemove={removeFile} />
                ))}
              </div>
            </SortableContext>
          </DndContext>
          
          <div className="mt-12 flex justify-center">
            <button 
              onClick={handleMerge}
              disabled={files.length < 2 || isProcessing}
              className="button-primary px-12 text-lg"
            >
              Merge PDFs
            </button>
          </div>
          <button 
            onClick={() => setFiles([])}
            className="block w-full mt-4 text-gray-400 hover:text-ink transition-colors text-sm font-medium"
          >
            Clear selection
          </button>
        </div>
      )}
    </div>
  );
}
