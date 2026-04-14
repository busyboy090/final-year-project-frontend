import { Routes, Route } from 'react-router-dom';

// Pages
import HomePage from '@/pages/HomePage';

// Components
import PageNotFound from '@/components/PageNotFound';

function PublicRoutes() {
    return (
        <Routes>
            <Route path="/" element={<HomePage />} />

            {/* 404 Route */}
            <Route path="*" element={<PageNotFound />} />
        </Routes>
    )
}

export default PublicRoutes