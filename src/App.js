// src/App.js

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Students from './pages/Students';
import Evaluate from './pages/Evaluate';
import ErrorBoundary from './components/ErrorBoundary'; // Importer ErrorBoundary
import { AppProvider } from './context/AppContext'; // Le contexte global pour AppContext
import './styles.css';
function App() {
  return (
    <Router>
      <AppProvider>  {/* Encapsuler toute l'app dans le fournisseur de contexte */}
        <ErrorBoundary>
           <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/students" element={<Students />} />
          <Route path="/evaluate/:studentId" element={<Evaluate />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>  
    </ErrorBoundary>
    </AppProvider>
  </Router>
  );
}

export default App;
