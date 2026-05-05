
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { Merge } from './pages/Merge';
import { Split } from './pages/Split';
import { Remove } from './pages/Remove';
import { WordToPdf } from './pages/WordToPdf';
import { ExcelToPdf } from './pages/ExcelToPdf';
import { PptToPdf } from './pages/PptToPdf';
import { JpgToPdf } from './pages/JpgToPdf';
import { PdfToJpg } from './pages/PdfToJpg';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="merge" element={<Merge />} />
          <Route path="split" element={<Split />} />
          <Route path="remove" element={<Remove />} />
          <Route path="word-to-pdf" element={<WordToPdf />} />
          <Route path="excel-to-pdf" element={<ExcelToPdf />} />
          <Route path="ppt-to-pdf" element={<PptToPdf />} />
          <Route path="jpg-to-pdf" element={<JpgToPdf />} />
          <Route path="pdf-to-jpg" element={<PdfToJpg />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
