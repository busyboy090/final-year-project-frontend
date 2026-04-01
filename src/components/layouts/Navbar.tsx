import { Menu } from 'lucide-react';
import ADUNLOGO from '@/assets/logo.png';
import { Link } from 'react-router-dom';
import { Button } from '../ui/button';

const Navbar = () => {
    return (
        <nav className="fixed top-0 w-full z-50 flex justify-between items-center px-8 py-4 bg-[#003366] font-inter antialiased tracking-tight shadow-xl shadow-blue-900/20">
            {/* Logo and Brand */}
            <Link to="/" className="text-xl font-bold text-white flex items-center gap-2 hover:opacity-90 transition-opacity">
                <img 
                    src={ADUNLOGO} 
                    alt="ADUN-EMS" 
                    className="h-12 w-12 bg-white rounded-full p-1 object-contain" 
                />
                <span className="tracking-tighter">ADUN-EMS</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex gap-4 items-center">
                <Button 
                    variant="ghost" 
                    className="text-white hover:bg-white/10 hover:text-amber-400 font-bold" 
                    asChild
                >
                    <Link to="/auth/login">
                        Login
                    </Link>
                </Button>

                <Button 
                    className="bg-[#fec657] text-[#735200] hover:bg-[#fec657]/90 font-black px-6 shadow-lg shadow-black/10 active:scale-95 transition-all" 
                    asChild
                >
                    <Link to="/auth/signup">
                        Get Started
                    </Link>
                </Button>
            </div>

            {/* Mobile Menu Toggle */}
            <button className="md:hidden text-white p-2">
                <Menu size={28} />
            </button>
        </nav>
    );
};

export default Navbar;