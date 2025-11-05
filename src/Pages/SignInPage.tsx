import supabase from '@/supabase-client'
import DarkVeil from '../components/DarkVeil'
import { SiGoogle } from 'react-icons/si'

const SignInPage = () => {
  
  const handlegoogleSignin = async () => {
    const {error} = await supabase.auth.signInWithOAuth({
      provider: 'google'
    })
    if (error) console.log("Error signing in : ", error)
  }

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
                  onClick={handlegoogleSignin}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors border border-white/10 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30 bg-white/10 hover:bg-white/15 text-white"
                >
                  <SiGoogle/>
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


