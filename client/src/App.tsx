import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import ProtectedRoute from './components/ProtectedRoute';
import GridPage from './components/pages/GridPage';
import InfoPage from './components/pages/InfoPage';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={
          <ProtectedRoute>
            <GridPage />
          </ProtectedRoute>
        } />
        <Route path="/info" element={
          <ProtectedRoute>
            <InfoPage />
          </ProtectedRoute>
        } />
      </Routes>
    </BrowserRouter>
  );
};

export default App;