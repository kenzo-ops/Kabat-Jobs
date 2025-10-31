import DarkVeil from '@/components/DarkVeil'
import Footer from '@/custom-components/Footer'
import React from 'react'
import { Link } from 'react-router'

const NotFoundPage: React.FC = () => {
  return (
      <div className="relative min-h-dvh font-poppins">
        <div className="absolute inset-0 -z-20">
        <DarkVeil />
        </div>
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute left-1/2 top-10 h-[420px] w-[720px] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(99,102,241,0.18),transparent_60%)] blur-3xl" />
      </div>

      <div className="mx-auto flex min-h-dvh max-w-7xl items-center justify-center px-6 sm:px-8 lg:px-10">
        <div className="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-white/10 bg-black/40 backdrop-blur-xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.6)]">
          <div className="absolute inset-px rounded-[1rem] bg-gradient-to-b from-white/5 to-white/0 pointer-events-none" />

          <div className="relative px-6 sm:px-10 md:px-12 py-12 sm:py-16 text-center">
            <div className="inline-flex items-center justify-center rounded-full bg-white/5 px-4 py-1.5 text-xs font-medium text-white/70 ring-1 ring-inset ring-white/10">
              Error 404
            </div>
            <h1 className="mt-4 text-5xl sm:text-6xl font-extrabold tracking-tight text-white">Page not found</h1>
            <p className="mt-4 max-w-xl mx-auto text-sm sm:text-base text-white/70 [text-wrap:pretty]">
              The page you’re looking for doesn’t exist or has been moved. Check the URL or return to the homepage.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link
                to="/"
                className="inline-flex items-center justify-center rounded-full bg-indigo-500 px-5 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base font-semibold text-white shadow hover:bg-indigo-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300 transition-colors"
              >
                Go to Home
              </Link>
              <Link
                to="/home"
                className="inline-flex items-center justify-center rounded-full bg-white/5 px-5 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base font-semibold text-white/90 ring-1 ring-inset ring-white/15 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30 transition-colors"
              >
                Explore Dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>
      <Footer/>
    </div>
  )
}

export default NotFoundPage


