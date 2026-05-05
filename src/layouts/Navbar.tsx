import ADUNLOGO from '@/assets/logo.png';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';

const Navbar = () => {
    return (
        <nav className="fixed top-0 w-full z-50 flex justify-between items-center px-8 py-4 bg-[#003366] font-inter antialiased tracking-tight shadow-xl shadow-blue-900/20">
            {/* Logo and Brand */}
            <Link to="/" className="text-sm md:text-xl font-bold text-white flex items-center gap-2 hover:opacity-90 transition-opacity">
                <img 
                    src={ADUNLOGO} 
                    alt="ADUN-EMS" 
                    className="h-10 w-10 md:h-12 md:w-12 bg-white rounded-full p-1 object-contain" 
                />
                <span className="tracking-tighter text-md md:text-xl">ADUN-EMS</span>
            </Link>

            {/* Navigation Buttons */}
            <div className="flex gap-2 md:gap-4 items-center">
                <Button 
                    variant="ghost" 
                    className="text-white text-sm p-4 hover:bg-white/10 hover:text-amber-400 font-bold" 
                    asChild
                >
                    <Link to="/auth/login">
                        Login
                    </Link>
                </Button>

                <Button 
                    className="bg-[#fec657] text-sm p-4 text-[#735200] hover:bg-[#fec657]/90 font-black px-5 shadow-lg shadow-black/10 active:scale-95 transition-all" 
                    asChild
                >
                    <Link to="/auth/signup">
                        Register
                    </Link>
                </Button>
            </div>
        </nav>
    );
};

export default Navbar;