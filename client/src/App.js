import { Routes, Route, Navigate } from 'react-router-dom';
import Login from "../src/pages/login/login";
import RequireAuth from './components/RequireAuth';
import Profile from './pages/profile/profile';
import Dashboard from './pages/dashboard/dashboard';
import useDocumentTitle from './hooks/useDocumentTitle';
import CurrencyTable from './components/currency/CurrencyTable';
import './App.css'

function App() {
  useDocumentTitle();

  return (
    <Routes>
      {/* public routes */}
      <Route path="/login" element={<Login />} />
      
      {/* protected routes */}
      <Route path="/" element={<RequireAuth />}>
        <Route path="/" element={<Navigate to="/dashboard" />} />
        <Route path="Profile" element={<Profile />} />
        <Route path="Dashboard" element={<Dashboard />} />
        <Route path="CurrencyTable" element={<CurrencyTable />} />
      </Route>
    </Routes>
  );
}

export default App;
