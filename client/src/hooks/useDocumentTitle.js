import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const routeTitles = {
  '/login': 'Login',
  '/profile': 'Profile',
  '/dashboard': 'Dashboard',
  '/CurrencyTable':'Currency',
  '/types':'Types'
};

const useDocumentTitle = () => {
  const location = useLocation();

  useEffect(() => {
    const title = routeTitles[location.pathname] || 'Verona';
    document.title = title;
  }, [location]);
};

export default useDocumentTitle;
