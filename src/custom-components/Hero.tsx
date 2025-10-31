import BlurText from '@/components/BlurText'
import StarBorder from '@/components/StarBorder'

function Hero({title = '', subtitle = ''}) {
  return (
    <>
    <div className="font-poppins">
        <section className="relative mx-auto w-full max-w-full px-6 sm:px-8 lg:px-10 pt-10 sm:pt-14 md:pt-16">
          <div className="relative mx-auto">
            {/* decorative spotlight */}
            <div className="pointer-events-none absolute inset-0 -z-10">
              <div className="absolute left-1/2 top-0 h-[420px] w-[720px] -translate-x-1/2 rounded-full" />
            </div>

            {/* glass card */}
            <div className="relative overflow-hidden rounded-2xl w-full border border-white/10 bg-black/40 backdrop-blur-xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.6)]">
              <div className="absolute inset-px rounded-[1rem] w-full bg-gradient-to-b from-white/5 to-white/0 pointer-events-none" />

              <div className="relative gap-3.5 flex flex-col items-center justify-center text-center px-6 sm:px-10 md:px-14 lg:px-16 py-5 sm:py-14 md:py-9">
                <div className="mt-4 sm:mt-4 mb-6 sm:mb-6 flex flex-wrap items-center justify-center gap-2.5 sm:gap-3.5">
                  <span className="inline-flex items-center gap-2 rounded-full bg-white/5 px-3.5 py-2 text-xs sm:text-sm text-white/80 ring-1 ring-inset ring-white/10">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                    Used by millions
                  </span>
                  <span className="inline-flex items-center gap-2 rounded-full bg-white/5 px-3.5 py-2 text-xs sm:text-sm text-white/80 ring-1 ring-inset ring-white/10">
                    <span className="h-1.5 w-1.5 rounded-full bg-sky-400" />
                    Recommended
                  </span>
                  <span className="inline-flex items-center gap-2 rounded-full bg-white/5 px-3.5 py-2 text-xs sm:text-sm text-white/80 ring-1 ring-inset ring-white/10">
                    <span className="h-1.5 w-1.5 rounded-full bg-violet-400" />
                    Trusted
                  </span>
                </div>
                <BlurText
                  text={title}
                  delay={25}
                  animateBy="letters"
                  direction="top"
                  className="[text-wrap:balance] text-center text-5xl  sm:text-5xl  md:text-5xl  lg:text-5xl  xl:text-5xl  2xl:text-1xl font-semibold tracking-tight text-white"
                />

                <p className="mt-4 sm:mt-5 max-w-3xl text-sm sm:text-base md:text-lg lg:text-xl text-white/70 [text-wrap:pretty]">
                  {subtitle}
                </p>

                <div className="mt-6 sm:mt-8 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
                  
                  
                  <StarBorder
                    as="a"
                    href="#"
                    color='blue'
                    speed='3s'
                    thickness={3}
                    className='rounded-full'
                  >
                    Explore Jobs
                  </StarBorder>
                  <a
                    href="#post"
                    className="inline-flex items-center justify-center rounded-lg bg-white/5 px-5 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base font-semibold text-white/90 ring-1 ring-inset ring-white/15 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30 transition-colors"
                  >
                    Post a Job
                  </a>
                </div>



              </div>
            </div>

            {/* stats strip */}
            {/* <div className="mx-auto mt-6 sm:mt-8 grid w-full max-w-4xl grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 text-center">
              <div className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3">
                <div className="text-2xl sm:text-3xl font-bold text-white">50k+</div>
                <div className="text-xs sm:text-sm text-white/60">Active job listings</div>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3">
                <div className="text-2xl sm:text-3xl font-bold text-white">1k+</div>
                <div className="text-xs sm:text-sm text-white/60">Hiring companies</div>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3">
                <div className="text-2xl sm:text-3xl font-bold text-white">98%</div>
                <div className="text-xs sm:text-sm text-white/60">User satisfaction</div>
              </div>
            </div> */}
          </div>
        </section>
    </div>
    </>
  )
}
export default Hero
