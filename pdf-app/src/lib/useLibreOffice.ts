import { useState, useCallback, useEffect, useRef } from 'react';
import { WorkerBrowserConverter, createWasmPaths } from '@matbee/libreoffice-converter/browser';

export function useLibreOffice() {
  const [isInitializing, setIsInitializing] = useState(false);
  const [progress, setProgress] = useState({ percent: 0, message: '' });
  const [converter, setConverter] = useState<WorkerBrowserConverter | null>(null);
  const initPromiseRef = useRef<Promise<WorkerBrowserConverter> | null>(null);

  const initialize = useCallback(async () => {
    if (converter) return converter;
    if (initPromiseRef.current) return initPromiseRef.current;

    const init = async () => {
      setIsInitializing(true);
      try {
        const conv = new WorkerBrowserConverter({
          ...createWasmPaths('/wasm/'),
          browserWorkerJs: '/wasm/browser.worker.js',
          onProgress: (info) => setProgress({ percent: info.percent, message: info.message }),
        });
        await conv.initialize();
        setConverter(conv);
        return conv;
      } finally {
        setIsInitializing(false);
        initPromiseRef.current = null;
      }
    };

    initPromiseRef.current = init();
    return initPromiseRef.current;
  }, [converter]);

  const convertToPdf = useCallback(async (file: File) => {
    const conv = await initialize();
    const data = new Uint8Array(await file.arrayBuffer());
    const result = await conv.convert(data, { outputFormat: 'pdf' }, file.name);
    return new Blob([result.data as any], { type: 'application/pdf' });
  }, [initialize]);

  useEffect(() => {
    return () => {
      if (converter) {
        converter.destroy().catch(console.error);
      }
    };
  }, [converter]);

  return { convertToPdf, isInitializing, progress };
}
