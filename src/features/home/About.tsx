
function About() {
  return (
    <section className="py-24 px-8 bg-surface-container-lowest">
      <div className="container mx-auto flex flex-col lg:flex-row items-center gap-20">
        <div className="w-full lg:w-1/2 order-2 lg:order-1">
          <div className="relative">
            <img alt="University Campus" className="rounded-xl shadow-2xl" data-alt="Stately stone university architecture with ivy-covered walls and a clock tower under a clear blue sky" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAPLrtAnu8WqjA2rEKZ-EBKpVVqxsesiNucwWfplvxb3GNj7lL883U0Lw8gSdxIkGOn1pPxHwhVUJDtr8yAgyM5vCFovJZFeJgFkrGvcuVjI37VDJbEwU3v2lKtTWaw-TW_r1_71yt_rNkVdzY4vCq52DuPR-sqOecv4rgY1yaVVFwUA3xRMl_fVNPAOQ9KX0ofgMkQ9vWJYGvavPOnglhelg2D_xWNpQ32nmNkozyeutIpxIQdKb0g1kEJgULL4xmqcv8j4xAX95k" />
            <div className="absolute -top-6 -right-6 w-32 h-32 bg-secondary border-8 border-surface-container-lowest rounded-full hidden md:block"></div>
          </div>
        </div>
        <div className="w-full lg:w-1/2 order-1 lg:order-2">
          <span className="text-secondary font-bold uppercase tracking-[0.3em] text-xs mb-4 block">The Mission</span>
          <h2 className="text-4xl md:text-5xl font-headline font-black text-primary leading-tight mb-8">Elevating Academic Coordination</h2>
          <div className="space-y-6 text-on-surface-variant text-lg leading-relaxed">
            <p>
              Adun-EMS replaces manual, fragmented event coordination at Admiralty University with a unified digital backbone. We understand the complexity of managing lectures, seminars, gala events, and administrative meetings.
            </p>
            <p>
              By bridging the gap between logistics and execution, our system ensures that every event reflects the prestige and excellence of our naval heritage. From department-level meetings to university-wide ceremonies, precision is our standard.
            </p>
          </div>
          <div className="mt-10 flex items-center gap-6">
            <div className="flex -space-x-4">
              <img alt="User 1" className="w-12 h-12 rounded-full border-4 border-surface shadow-sm" data-alt="Portrait of a smiling professional academic administrator in formal attire" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAh0A2UCAu5wp9F9z15Vo975u8qdsXlVBvo7vzAMkPBcZ0wghdOuPeM33MY_jEuI9aeN6JrsEhg9SRmlCYN6tF4EuCXWoZQIr2qvgEBpN9zCivlJG2f5AnWfcM0cwKK7R7eLMA4wsE4cTocf10v2_cEoEuQEjG3mTmh7vPQJdmfm-uTOB2XUJDEDPu6r-HrGxpQrieaOeI2bOiCXtV9_uHwT8yuT8-8Eqf-XPKh9QWPQGz1RHvHX02iYfLJccdXjIfp2Gac2a9Tth4" />
              <img alt="User 2" className="w-12 h-12 rounded-full border-4 border-surface shadow-sm" data-alt="Portrait of a young woman student leader with a warm professional expression" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAD74ASIuZufY_GkpS5A6YbqbDeJr5c-deswvGV2JCap6Sqb1faPd51i8rkmnWUsNIKpIdy7Mrdy50aFN2WHW-2iGJbEnV1KSMa4ySUSIyaZKCqsUxb4ejZ1p1FAIPP_KE7fn2IUNp5mSJ_6EeUH8kRGPYph2BvNvcHfADXzqQWYjimRGvffebpXFnsmPvfAQmOjOIkYhHRq-v2zN8ZOb-T5php6N13nahId7K5MoljK5uXNj2tarO5Qhgzm9klfPw-yiUtZ8eVo_g" />
              <div className="w-12 h-12 rounded-full border-4 border-surface bg-primary-container flex items-center justify-center text-xs text-white font-bold">+100</div>
            </div>
            <p className="text-sm font-bold text-primary">Trusted by University Staff &amp; Students</p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default About