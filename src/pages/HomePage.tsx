import Navbar from '@/layouts/Navbar';
import Hero from '@/features/home/Hero';
import Stats from '@/features/home/Stats';
import Features from '@/features/home/Features';
import Footer from '@/layouts/Footer';
import About from '@/features/home/About';

function HomePage() {
  return (
    <div className="min-h-screen bg-white selection:bg-[#fec657] selection:text-[#735200]">
      <Navbar />
      <main className="pt-16">
        <Hero />
        <Stats />
        <Features />
        <About />
        {/* CTA Section */}
        <section className="px-8 mb-24">
          <div className="container mx-auto bg-linear-to-br from-[#001e40] to-[#003366] rounded-3xl p-12 md:p-20 text-center relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
            <div className="relative z-10 max-w-2xl mx-auto">
              <h2 className="text-3xl md:text-5xl font-black text-white mb-8">Ready to streamline your next university event?</h2>
              <p className="text-blue-100/70 text-lg mb-12">Join the growing number of departments using ADUN-EMS to deliver world-class event experiences.</p>
              <button className="bg-[#fec657] text-[#735200] px-12 py-5 rounded-lg font-black text-xl hover:scale-105 transition-transform">
                Create Your First Event
              </button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

export default HomePage;