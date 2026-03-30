import LoginForm from "../components/forms/LoginForm";
import ADUNLOGO from "../assets/logo.png";

// ── Background watermark ──────────────────────────────────────────────────────
function BackgroundDecoration() {
  return (
    <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
      <div className="absolute top-[10%] left-[5%] text-[12rem] font-black text-primary/[0.02] select-none rotate-12 leading-none">
        ADUN
      </div>
      <div className="absolute bottom-[10%] right-[5%] text-[12rem] font-black text-secondary/[0.02] select-none -rotate-12 leading-none">
        EMS
      </div>
    </div>
  );
}

// ── Brand header ──────────────────────────────────────────────────────────────
function BrandHeader() {
  return (
    <div className="px-8 pt-10 pb-6 text-center">
      <div className="inline-flex items-center justify-center w-20 h-20 mb-6 bg-primary-container rounded-lg shadow-xl shadow-primary/20">
        <img
          src={ADUNLOGO}
          alt="Admiralty University of Nigeria Logo"
          className="w-14 h-14 object-contain"
        />
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
        <a
          href="#"
          className="font-bold text-primary hover:text-secondary underline decoration-2 underline-offset-4 transition-colors"
        >
          Register here
        </a>
      </p>
    </div>
  );
}

// ── Credential footer ─────────────────────────────────────────────────────────
function CredentialFooter() {
  return (
    <div className="mt-8 text-center px-4">
      <p className="text-[10px] font-label uppercase tracking-[0.2em] text-on-surface-variant/60 leading-relaxed">
        © 2024 Admiralty University of Nigeria
        <br />
        Secured Academic Gateway • Event Management Unit
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
        {/* Glow blobs */}
        <div className="absolute -top-12 -left-12 w-32 h-32 bg-linear-to-br from-primary to-primary-container opacity-10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-linear-to-br from-secondary to-secondary-container opacity-10 rounded-full blur-3xl pointer-events-none" />

        {/* Card */}
        <div className="relative bg-surface-container-lowest shadow-[0px_20px_40px_rgba(0,30,64,0.06)] rounded-xl overflow-hidden">
          <BrandHeader />
          <LoginForm onSubmit={handleLogin} />
          <CardFooter />
        </div>

        <CredentialFooter />
      </div>

      <BackgroundDecoration />
    </main>
  );
}