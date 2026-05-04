
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { Merge } from './pages/Merge';
import { Split } from './pages/Split';
import { Remove } from './pages/Remove';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="merge" element={<Merge />} />
          <Route path="split" element={<Split />} />
          <Route path="remove" element={<Remove />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
