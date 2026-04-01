import { Link } from "react-router-dom";
import { ShieldCheck } from "lucide-react";
import SignupForm from "../components/forms/SignupForm";
import Copyright from "../components/ui/copyright";
import ADUNLOGO from "../assets/logo.png";

function SignupPage() {
  const handleRegister = async (data: any) => {
    console.log("Processing Registration:", data);
    await new Promise((r) => setTimeout(r, 2000));
  };

  return (
    <main className="min-h-screen flex items-center flex-col justify-center p-6 md:p-12 relative bg-[#F4F6F9] font-body">
      
      <div className="relative z-10 w-full max-w-4xl bg-white rounded-xl shadow-xl overflow-hidden flex flex-col md:flex-row border border-slate-200">
        {/* Branding Sidebar */}
        <div className="hidden md:flex flex-col justify-between p-10 bg-linear-to-br from-[#001e40] to-[#003366] w-1/3 text-white">
          <div>
            <div className="flex items-center gap-2 mb-8">
              <img src={ADUNLOGO} alt="ADUN-EMS" className="h-10 w-10 bg-white rounded-full p-1" />
              <span className="font-bold text-xl tracking-tighter">ADUN-EMS</span>
            </div>
            <h2 className="text-2xl font-bold leading-tight mb-4 text-white">Join the Admiralty Community</h2>
            <p className="text-sm opacity-70 leading-relaxed font-light">
              Secure access to the university's premier Event Management System.
            </p>
          </div>
          <div className="mt-auto pt-4 border-t border-white/10 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center">
              <ShieldCheck className="text-amber-500 h-4 w-4" />
            </div>
            <span className="text-[10px] uppercase tracking-widest font-semibold opacity-80">Official Portal</span>
          </div>
        </div>

        {/* Form Content Area */}
        <div className="flex-1 p-8 md:p-12 bg-white">
          <header className="mb-8 text-center md:text-left">
            <h1 className="text-3xl font-extrabold text-[#001e40] tracking-tight mb-2">Create Account</h1>
            <p className="text-slate-500 text-sm font-medium">Please enter your institutional details</p>
          </header>

          {/* Render the extracted Form Component */}
          <SignupForm onSubmit={handleRegister} />

          <footer className="mt-8 pt-6 border-t text-center text-sm">
            Already have an account?{" "}
            <Link to="/auth/login" className="text-[#7b5800] font-bold hover:underline">
              Sign in
            </Link>
          </footer>
        </div>
      </div>
      <Copyright />
    </main>
  );
}

export default SignupPage;