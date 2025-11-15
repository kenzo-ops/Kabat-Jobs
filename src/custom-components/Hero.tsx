import BlurText from '@/components/BlurText'
import StarBorder from '@/components/StarBorder'

function Hero({ title = '', subtitle = '' }) {
  return (
    <>
      <div className="font-poppins">
        <section className="relative mx-auto w-full max-w-full px-4 sm:px-6 md:px-10 lg:px-14 pt-24 sm:pt-28 md:pt-32">
          <div className="relative mx-auto">

            {/* Spotlight Decorative */}
            <div className="pointer-events-none absolute inset-0 -z-10">
              <div className="absolute left-1/2 top-0 h-[350px] sm:h-[420px] w-[520px] sm:w-[720px] -translate-x-1/2 rounded-full bg-white/0" />
            </div>

            {/* Glass Card */}
            <div className="relative overflow-hidden rounded-2xl w-full border border-white/10 bg-black/40 backdrop-blur-xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.6)]">
              <div className="absolute inset-px rounded-[1rem] w-full bg-gradient-to-b from-white/5 to-white/0 pointer-events-none" />

              <div className="relative flex flex-col items-center justify-center text-center 
                  px-4 sm:px-8 md:px-12 lg:px-14 
                  py-10 sm:py-14 md:py-20 gap-6">

                {/* Badges */}
                <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mt-2">
                  <span className="inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-1.5 sm:px-3.5 sm:py-2 text-[10px] sm:text-xs md:text-sm text-white/80 ring-1 ring-inset ring-white/10">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                    Used by millions
                  </span>
                  <span className="inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-1.5 sm:px-3.5 sm:py-2 text-[10px] sm:text-xs md:text-sm text-white/80 ring-1 ring-inset ring-white/10">
                    <span className="h-1.5 w-1.5 rounded-full bg-sky-400" />
                    Recommended
                  </span>
                  <span className="inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-1.5 sm:px-3.5 sm:py-2 text-[10px] sm:text-xs md:text-sm text-white/80 ring-1 ring-inset ring-white/10">
                    <span className="h-1.5 w-1.5 rounded-full bg-violet-400" />
                    Trusted
                  </span>
                </div>

                <h1 className='text-center 
                    text-3xl sm:text-4xl md:text-5xl lg:text-6xl 
                    font-semibold tracking-tight text-white'>
                  {title}
                </h1>

                {/* Subtitle */}
                <p className="mt-2 sm:mt-4 max-w-3xl 
                    text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl 
                    text-white/70 [text-wrap:pretty] px-1">
                  {subtitle}
                </p>

                {/* CTA Buttons */}
                <div className="mt-6 sm:mt-8 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
                  <StarBorder
                    as="a"
                    href="#"
                    color="blue"
                    speed="3s"
                    thickness={3}
                    className="rounded-full text-xs sm:text-sm md:text-base px-4 sm:px-5 md:px-6 py-2 sm:py-2.5"
                  >
                    Explore Jobs
                  </StarBorder>

                  <a
                    href="#post"
                    className="inline-flex items-center justify-center rounded-lg bg-white/5 
                      px-4 sm:px-6 py-2 sm:py-3
                      text-xs sm:text-sm md:text-base 
                      font-semibold text-white/90 ring-1 ring-inset ring-white/15 
                      hover:bg-white/10 transition-colors"
                  >
                    Post a Job
                  </a>
                </div>

              </div>
            </div>

          </div>
        </section>
      </div>
    </>
  )
}

export default Hero
