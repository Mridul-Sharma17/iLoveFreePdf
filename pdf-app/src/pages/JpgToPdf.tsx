import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Image as ImageIcon, GripVertical, X } from 'lucide-react';
import { Dropzone } from '../components/Dropzone';
import { SuccessScreen } from '../components/SuccessScreen';
import { ProcessingOverlay } from '../components/ProcessingOverlay';
import { convertJpgsToPdf } from '../lib/pdf-utils';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, type DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

function SortableImage({ id, file, onRemove }: { id: string, file: File, onRemove: (id: string) => void }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
  const style = { transform: CSS.Transform.toString(transform), transition };
  const previewUrl = useMemo(() => URL.createObjectURL(file), [file]);

  return (
    <div ref={setNodeRef} style={style} className="group relative bg-white border border-hairline rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <div className="aspect-[3/4] flex items-center justify-center bg-surface">
        <img src={previewUrl} alt={file.name} className="max-w-full max-h-full object-contain" />
      </div>
      <div className="p-3 flex items-center justify-between bg-white border-t border-hairline">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <button {...attributes} {...listeners} className="text-steel hover:text-ink cursor-grab" aria-label={`Reorder ${file.name}`}>
            <GripVertical size={16} />
          </button>
          <span className="text-xs font-bold truncate flex-1">{file.name}</span>
        </div>
        <button onClick={() => onRemove(id)} className="ml-2 text-steel hover:text-red-500 transition-colors" aria-label={`Remove ${file.name}`}>
          <X size={16} />
        </button>
      </div>
    </div>
  );
}

export function JpgToPdf() {
  const [files, setFiles] = useState<{id: string, file: File}[]>([]);
  const [blob, setBlob] = useState<Blob | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleFilesSelect = (selectedFiles: File[]) => {
    const newFiles = selectedFiles.map(f => ({ id: Math.random().toString(36).substr(2, 9), file: f }));
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

  const handleConvert = async () => {
    if (files.length === 0) return;
    setIsProcessing(true);
    try {
      const result = await convertJpgsToPdf(files.map(f => f.file));
      setBlob(result);
    } catch (err) {
      console.error(err);
      alert('Conversion failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (blob) {
    return (
      <SuccessScreen 
        onDownload={() => {
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = "converted_images.pdf";
          a.click();
          URL.revokeObjectURL(url);
        }} 
        onRestart={() => { setFiles([]); setBlob(null); }} 
      />
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-10 px-4">
      <ProcessingOverlay 
        isConverting={isProcessing}
        message="Converting Images to PDF..."
      />
      
      <Link to="/" className="inline-flex items-center text-sm font-medium text-steel hover:text-ink mb-8">
        <ArrowLeft size={16} className="mr-2" /> Back to tools
      </Link>

      <h1 className="text-4xl font-bold mb-2 text-center">JPG to PDF</h1>
      <p className="text-steel mb-10 text-center">Convert multiple images into a single PDF document.</p>

      {files.length === 0 ? (
        <Dropzone onFilesSelect={handleFilesSelect} accept=".jpg,.jpeg,.png" multiple>
          <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-hairline rounded-[32px] p-10 hover:border-brand-coral transition-colors">
            <div className="w-20 h-20 bg-brand-coral/10 rounded-2xl flex items-center justify-center mb-6">
              <ImageIcon size={40} className="text-brand-coral" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Choose Image Files</h2>
            <p className="text-gray-400">or drop images here</p>
          </div>
        </Dropzone>
      ) : (
        <div className="bg-surface p-8 rounded-[32px] border border-hairline">
          <div className="mb-8 flex justify-between items-center">
            <span className="text-sm font-bold text-steel uppercase tracking-wider">{files.length} Images selected</span>
            <button 
              onClick={() => {
                const input = document.createElement('input');
                input.type = 'file';
                input.accept = '.jpg,.jpeg,.png';
                input.multiple = true;
                input.onchange = (e) => {
                  const files = (e.target as HTMLInputElement).files;
                  if (files) handleFilesSelect(Array.from(files));
                };
                input.click();
              }}
              className="text-brand-coral font-bold hover:underline"
            >
              + Add More
            </button>
          </div>

          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={files.map(f => f.id)} strategy={verticalListSortingStrategy}>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {files.map((fileObj) => (
                  <SortableImage key={fileObj.id} id={fileObj.id} file={fileObj.file} onRemove={removeFile} />
                ))}
              </div>
            </SortableContext>
          </DndContext>
          
          <div className="mt-12 flex justify-center">
            <button 
              onClick={handleConvert} 
              className="button-primary px-12 text-lg"
              disabled={isProcessing}
            >
              Convert to PDF
            </button>
          </div>
          <button 
            onClick={() => setFiles([])} 
            className="block w-full mt-6 text-gray-400 hover:text-ink transition-colors text-sm font-medium"
          >
            Clear selection
          </button>
        </div>
      )}
    </div>
  );
}
