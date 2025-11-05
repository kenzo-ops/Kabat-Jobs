import React from 'react'
import DarkVeil from '@/components/DarkVeil'
import supabase from '@/supabase-client'
import type { User } from "@supabase/supabase-js"

const ProfilePage: React.FC = () => {
  // Static data placeholder; replace with real backend later
  const userEmail = 'john.doe@email.com'
  const userName = 'John Doe'

  return (
    <div className="relative min-h-dvh overflow-hidden font-poppins">
      <div className="absolute inset-0 -z-20">
        <DarkVeil />
      </div>
      <div className="relative z-10 mx-auto max-w-3xl px-6 sm:px-8 lg:px-10 py-8 sm:py-12">
        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-black/40 backdrop-blur-xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.6)]">
          <div className="absolute inset-px rounded-[1rem] bg-gradient-to-b from-white/5 to-white/0 pointer-events-none" />
          <div className="relative p-6 sm:p-8">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">Profile</h1>
            <p className="mt-2 text-white/70 text-sm sm:text-base">Kelola informasi akun Anda.</p>

            <div className="mt-6 grid gap-4">
              <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
                <div className="text-white/80 text-sm">Email</div>
                <div className="mt-1 text-white text-lg font-semibold break-all">{userEmail}</div>
              </div>

              <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4 flex items-center justify-between">
                <div>
                  <div className="text-white/80 text-sm">Nama</div>
                  <div className="mt-1 text-white text-lg font-semibold">{userName}</div>
                </div>
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 text-white font-semibold">
                  JD
                </span>
              </div>

              <div className="flex gap-3 pt-2">
                <a href="/home" className="rounded-lg border border-white/10 px-4 py-2 text-sm text-white/90 hover:bg-white/5">Kembali ke Home</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage

