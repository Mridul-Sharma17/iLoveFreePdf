import React, { useCallback, useState, useRef } from 'react';

interface DropzoneProps {
  onFilesSelect: (files: File[]) => void;
  multiple?: boolean;
  accept?: string;
  children: React.ReactNode;
}

export function Dropzone({ onFilesSelect, multiple = false, accept = "*", children }: DropzoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const processFiles = useCallback((fileList: FileList | null) => {
    if (!fileList) return;
    const files = Array.from(fileList);
    // Removed hardcoded PDF filter to allow any file type specified by 'accept' prop

    if (files.length > 0) {
      onFilesSelect(multiple ? files : [files[0]]);
    }
  }, [onFilesSelect, multiple]);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      processFiles(e.dataTransfer.files);
    },
    [processFiles]
  );

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    processFiles(e.target.files);
  };

  const openFilePicker = () => {
    fileInputRef.current?.click();
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={openFilePicker}
      className={`min-h-[60vh] flex flex-col transition-colors duration-300 rounded-xl relative cursor-pointer ${
        isDragging ? 'bg-success-bg border-2 border-dashed border-ink/20' : 'bg-transparent'
      }`}
    >
      <input
        type="file"
        id="pdf-upload-input"
        ref={fileInputRef}
        onChange={handleFileInputChange}
        accept={accept}
        multiple={multiple}
        className="hidden"
        data-testid="file-input"
      />
      {children}
    </div>
  );
}
