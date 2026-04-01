import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';

// Components
import Preloader from '@/components/Preloader';
import ScrollTop from '@/components/ScrollTop';

function AppLayout({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 5000);
  }, []);

  if (loading) {
    return <Preloader />;
  }

  return (
    <div className='flex flex-col min-h-screen'>
      <ScrollTop />
      { children ? children : <Outlet /> }
    </div>
  )
}

export default AppLayout