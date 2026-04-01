import LoginForm from "../components/forms/LoginForm";
import ADUNLOGO from "../assets/logo.png";
import Copyright from "../components/ui/copyright";
import { Link } from "react-router-dom";


function BrandHeader() {
  return (
    <div className="px-8 pt-10 pb-6 text-center">
      <div className="inline-flex items-center justify-center w-20 h-20 mb-6 bg-primary-container rounded-lg">
        <Link to="/">
          <img
            src={ADUNLOGO}
            alt="Admiralty University of Nigeria Logo"
            className="w-18 h-18 object-contain"
          />
        </Link>
      </div>
      <h1 className="text-2xl font-extrabold tracking-tight text-primary font-headline">
        Sign In to ADUN-EMS
      </h1>
      <p className="mt-2 text-sm font-medium text-on-surface-variant">
        Admiralty University Event Management System
      </p>
    </div>
  );
}



// ── Card footer ───────────────────────────────────────────────────────────────
function CardFooter() {
  return (
    <div className="px-8 py-6 bg-surface-container-low border-t border-outline-variant/10 text-center">
      <p className="text-sm text-on-surface-variant">
        Don't have an account?{" "}
        <Link
          to="/auth/signup"
          className="font-bold text-primary hover:text-muted-foreground underline decoration-2 underline-offset-4 transition-colors"
        >
          Register here
        </Link>
      </p>
    </div>
  );
}


// ── LoginPage (default export) ────────────────────────────────────────────────
export default function LoginPage() {
  async function handleLogin({ email, password, rememberMe }: { email: string, password: string, rememberMe: boolean }) {
    // Replace with your real auth / API call
    console.log("Login attempt:", { email, password, rememberMe });
    await new Promise((r) => setTimeout(r, 1200));
  }

  return (
    <main className="grow flex items-center justify-center p-6 bg-[#F4F6F9] min-h-screen font-body">
      <div className="relative w-full max-w-md">
        {/* Card */}
        <div className="relative bg-white shadow-xl border rounded-xl overflow-hidden">
          <BrandHeader />
          <LoginForm onSubmit={handleLogin} />
          <CardFooter />
        </div>

        <Copyright />
      </div>
    </main>
  );
}