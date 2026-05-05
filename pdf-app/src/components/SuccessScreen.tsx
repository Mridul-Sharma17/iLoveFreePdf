export function SuccessScreen({ onDownload, onRestart }: { onDownload: () => void, onRestart: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 animate-fade-in text-center">
      <span className="bg-success-bg text-success-text font-bold px-4 py-1 rounded-full text-xs uppercase mb-6 tracking-wider">Task Complete</span>
      <h1 className="text-4xl font-bold mb-8 text-primary">Your document is ready.</h1>
      <button onClick={onDownload} className="button-primary text-lg px-10 py-4 mb-4">
        Download File
      </button>
      <button onClick={onRestart} className="text-gray-400 hover:text-primary transition-colors underline text-sm block mx-auto">
        Start another task
      </button>
    </div>
  );
}
