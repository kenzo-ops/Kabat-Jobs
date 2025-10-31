import Navbar from '../custom-components/Navbar'
import DarkVeil from '../components/DarkVeil'

const SignInPage = () => {
  return (
    <div className="relative min-h-screen bg-black">
      <div className="fixed inset-0 z-0 pointer-events-none">
        <DarkVeil />
      </div>


      <div className="relative z-10 flex min-h-screen items-center justify-center px-6 sm:px-8 lg:px-10 py-10">
        <div className="w-full max-w-md">
          <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-black/40 backdrop-blur-xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.6)]">
            <div className="absolute inset-px rounded-[1rem] bg-gradient-to-b from-white/5 to-white/0 pointer-events-none" />
            <div className="relative p-6 sm:p-8">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">Sign In</h1>
              <p className="mt-1 text-white/70 text-sm">Create your account to get started.</p>

              <form className="mt-5 grid grid-cols-1 gap-3">
                <div>
                  <label htmlFor="name" className="block text-xs text-white/70 mb-2">Full Name</label>
                  <input
                    id="name"
                    type="text"
                    placeholder="Jane Doe"
                    className="w-full rounded-xl bg-white/5 text-white placeholder:text-white/40 border border-white/10 focus:border-white/20 focus:ring-2 focus:ring-white/20 outline-none px-4 py-3"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-xs text-white/70 mb-2">Email</label>
                  <input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    className="w-full rounded-xl bg-white/5 text-white placeholder:text-white/40 border border-white/10 focus:border-white/20 focus:ring-2 focus:ring-white/20 outline-none px-4 py-3"
                  />
                </div>
                <div>
                  <label htmlFor="password" className="block text-xs text-white/70 mb-2">Password</label>
                  <input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    className="w-full rounded-xl bg-white/5 text-white placeholder:text-white/40 border border-white/10 focus:border-white/20 focus:ring-2 focus:ring-white/20 outline-none px-4 py-3"
                  />
                </div>
                <div>
                  <label htmlFor="confirm" className="block text-xs text-white/70 mb-2">Confirm Password</label>
                  <input
                    id="confirm"
                    type="password"
                    placeholder="••••••••"
                    className="w-full rounded-xl bg-white/5 text-white placeholder:text-white/40 border border-white/10 focus:border-white/20 focus:ring-2 focus:ring-white/20 outline-none px-4 py-3"
                  />
                </div>

                <button
                  type="submit"
                  className="mt-1 inline-flex items-center justify-center rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors border border-white/10 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30 bg-white/10 hover:bg-white/15 text-white"
                >
                  Create Account
                </button>
              </form>

              {/* Google Sign-In */}
              <div className="mt-5">
                <div className="mb-4 flex items-center gap-3">
                  <div className="h-px w-full bg-white/10" />
                  <span className="text-[11px] text-white/50">or</span>
                  <div className="h-px w-full bg-white/10" />
                </div>
                <button
                  type="button"
                  className="w-full inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors border border-white/10 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30 bg-white/10 hover:bg-white/15 text-white"
                >
                  <svg viewBox="0 0 48 48" className="h-5 w-5" aria-hidden>
                    <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303C33.551 31.328 29.197 34 24 34c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C33.64 4.053 28.995 2 24 2 16.318 2 9.656 6.337 6.306 14.691z"/>
                    <path fill="#FF3D00" d="M6.306 14.691l6.571 4.817C14.4 16.062 18.822 14 24 14c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C33.64 4.053 28.995 2 24 2 16.318 2 9.656 6.337 6.306 14.691z"/>
                    <path fill="#4CAF50" d="M24 42c5.137 0 9.735-1.97 13.24-5.182l-6.104-5.159C29.145 33.188 26.705 34 24 34c-5.176 0-9.525-2.667-11.292-6.604l-6.54 5.038C9.474 37.738 16.17 42 24 42z"/>
                    <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303c-1.317 3.146-4.013 5.592-7.167 6.659.001-.001 6.104 5.159 6.104 5.159l.423.311C37.088 37.597 40 32.293 40 26c0-2.054-.369-4.022-1.052-5.917z"/>
                  </svg>
                  Continue with Google
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SignInPage


