interface ProcessingOverlayProps {
  progress?: {
    percent: number;
    message: string;
  };
  isConverting: boolean;
  isInitializing?: boolean;
  message?: string;
}

export function ProcessingOverlay({ progress, isConverting, isInitializing, message }: ProcessingOverlayProps) {
  if (!isConverting && !isInitializing) return null;

  const displayMessage = message || (isConverting 
    ? 'Converting...' 
    : (progress?.message || 'Loading Engine...'));
    
  const displayPercent = isConverting ? 100 : (progress?.percent || 0);

  return (
    <div className="fixed inset-0 bg-white/80 z-50 flex flex-col items-center justify-center">
      <div className="w-64 h-2 bg-gray-100 rounded-full overflow-hidden mb-4">
        <div 
          className="h-full bg-brand-coral transition-all duration-300" 
          style={{ width: `${displayPercent}%` }} 
        />
      </div>
      <p className="font-bold text-primary">
        {displayMessage}
      </p>
      {!isConverting && displayPercent > 0 && (
        <p className="text-sm text-gray-400 mt-2">{displayPercent}%</p>
      )}
    </div>
  );
}
