import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import Settings from './pages/Settings';
import Private from './pages/Private';
import Notes from './pages/Notes';   // ← thêm dòng này

function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="notes" element={<Notes />} />   {/* ← thêm */}
            <Route path="settings" element={<Settings />} />
            <Route path="private" element={<Private />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;